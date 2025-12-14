import pickle, json
import pandas as pd
import numpy as np

from pathlib import Path
from sklearn.model_selection import train_test_split
from lifelines import KaplanMeierFitter, CoxPHFitter
from lifelines.utils import concordance_index

def c_index_check(df, features, seed):
    model_df = df[features + ["time_days", "event"]].copy()

    num_cols = model_df.select_dtypes(include=[np.number]).columns
    model_df[num_cols] = model_df[num_cols].fillna(model_df[num_cols].median())

    model_df = pd.get_dummies(model_df, drop_first=True)

    train_df, test_df = train_test_split(
        model_df, test_size=0.2, random_state=seed
    )

    cph = CoxPHFitter(penalizer=0.1)
    cph.fit(train_df, duration_col="time_days", event_col="event")

    risk = cph.predict_partial_hazard(test_df)

    return concordance_index(
        test_df["time_days"],
        -risk,
        test_df["event"]
    )

def penalty_value_check(df, features, seed = 42):
    model_df = df[features + ["time_days", "event"]].copy()

    num_cols = model_df.select_dtypes(include=[np.number]).columns
    model_df[num_cols] = model_df[num_cols].fillna(model_df[num_cols].median())

    model_df = pd.get_dummies(model_df, drop_first=True)

    train_df, test_df = train_test_split(
        model_df, test_size=0.2, random_state=seed
    )

    penalties = [0.01, 0.1, 0.5]
    pen_results = []

    for p in penalties:
        cph = CoxPHFitter(penalizer=p)
        cph.fit(train_df, duration_col="time_days", event_col="event")

        risk = cph.predict_partial_hazard(test_df)
        cidx = concordance_index(
            test_df["time_days"],
            -risk,
            test_df["event"]
        )

        pen_results.append({"penalizer": p, "C_index": cidx})

    return pen_results

from pathlib import Path
import json, pickle
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from lifelines import CoxPHFitter, KaplanMeierFitter


def save_model(
    df,
    features,
    path="artifacts",
    seed=42,
    penalizer=0.1
):
    """
    Trains a Cox model and saves:
    - fitted model
    - preprocessing metadata
    - risk group thresholds
    - feature importance
    - KM survival curves by risk group
    """

    path = Path(path)
    path.mkdir(exist_ok=True)

    # -------------------------
    # 1) Build raw modeling DF
    # -------------------------
    df_raw = df[features + ["time_days", "event"]].copy()

    train_raw, test_raw = train_test_split(
        df_raw, test_size=0.2, random_state=seed
    )

    # -------------------------
    # 2) Compute medians on RAW TRAIN data
    # -------------------------
    num_cols = train_raw[features].select_dtypes(include=["number"]).columns.tolist()
    medians = train_raw[num_cols].median().to_dict()

    # -------------------------
    # 3) Preprocess function
    # -------------------------
    def preprocess(df_in):
        df_p = df_in.copy()

        # median imputation
        for c, m in medians.items():
            df_p[c] = df_p[c].fillna(m)

        # one-hot encoding
        df_p = pd.get_dummies(df_p, drop_first=True)

        return df_p

    # -------------------------
    # 4) Apply preprocessing
    # -------------------------
    train_df = preprocess(train_raw)
    test_df = preprocess(test_raw)

    train_df, test_df = train_df.align(
        test_df, join="left", axis=1, fill_value=0
    )

    # -------------------------
    # 5) Fit Cox model
    # -------------------------
    cph = CoxPHFitter(penalizer=penalizer)
    cph.fit(train_df, duration_col="time_days", event_col="event")

    # -------------------------
    # 6) Save model
    # -------------------------
    with open(path / "cox_model.pkl", "wb") as f:
        pickle.dump(cph, f)

    # -------------------------
    # 7) Save preprocessing metadata
    # -------------------------
    preprocess_meta = {
        "final_features": features,
        "num_medians": medians,
        "train_columns": [
            c for c in train_df.columns if c not in ["time_days", "event"]
        ],
        "seed": seed,
        "penalizer": penalizer
    }

    with open(path / "preprocess.json", "w") as f:
        json.dump(preprocess_meta, f, indent=2)

    # -------------------------
    # 8) Risk thresholds (TRAIN only)
    # -------------------------
    risk_train = cph.predict_partial_hazard(train_df).values.reshape(-1)
    q1, q2 = np.quantile(risk_train, [1/3, 2/3])

    with open(path / "risk_thresholds.json", "w") as f:
        json.dump({"q1": float(q1), "q2": float(q2)}, f, indent=2)

    # -------------------------
    # 9) Feature importance (Cox coefficients)
    # -------------------------
    coef_df = cph.summary.reset_index()
    coef_df["importance"] = coef_df["coef"].abs()
    coef_df = coef_df.sort_values("importance", ascending=False)

    feature_importance = [
        {
            "internal_name": row["covariate"],
            "hazard_ratio": float(row["exp(coef)"]),
            "coef": float(row["coef"]),
            "importance": float(row["importance"])
        }
        for _, row in coef_df.iterrows()
    ]

    with open(path / "feature_importance.json", "w") as f:
        json.dump(feature_importance, f, indent=2)

    # -------------------------
    # 10) KM curves by risk group (TRAIN only)
    # -------------------------
    df_km = train_raw.copy()
    df_km["risk_score"] = risk_train

    df_km["risk_group"] = pd.cut(
        df_km["risk_score"],
        bins=[-np.inf, q1, q2, np.inf],
        labels=["Low", "Medium", "High"]
    )

    km_data = {}

    for g in ["Low", "Medium", "High"]:
        mask = df_km["risk_group"] == g

        kmf = KaplanMeierFitter()
        kmf.fit(
            df_km.loc[mask, "time_days"],
            df_km.loc[mask, "event"]
        )

        km_df = kmf.survival_function_.reset_index()

        km_data[g] = {
            "n_patients": int(mask.sum()),
            "curve": [
                {
                    "time_days": int(row["timeline"]),
                    "survival": float(row[kmf.survival_function_.columns[0]])
                }
                for _, row in km_df.iterrows()
            ]
        }

    with open(path / "km_curves.json", "w") as f:
        json.dump(km_data, f, indent=2)

    return cph
