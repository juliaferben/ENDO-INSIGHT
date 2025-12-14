import pandas as pd

def preprocess_one(patient_dict, artifacts):
    df = pd.DataFrame([patient_dict])

    # Keep only final features
    df = df[[c for c in artifacts.final_features if c in df.columns]]

    # Median imputation
    for col, med in artifacts.medians.items():
        if col in df.columns:
            df[col] = df[col].astype(float).fillna(med)

    # One-hot encode
    df = pd.get_dummies(df, drop_first=True)

    # Align to training columns
    df = df.reindex(columns=artifacts.train_columns, fill_value=0)

    return df
