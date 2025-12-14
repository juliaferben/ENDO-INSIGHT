import pandas as pd

def build_summarized_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    nodal_cols = [
        "n_GC_Afect",
        "n_gangP_afec",
        "n_ganPaor_InfrM_afec",
        "n_ganPaor_Sup_afec",
    ]

    df["nodal_positive"] = (
        df[nodal_cols]
        .fillna(0)
        .gt(0)
        .any(axis=1)
        .astype(int)
    )

    gen_cols = [f"estudio_genetico_r0{i}" for i in range(1, 7)]

    df["genetic_test_done"] = (
        df[gen_cols]
        .notna()
        .any(axis=1)
        .astype(int)
    )

    df["genetic_abnormal"] = (df[gen_cols] == 1).any(axis=1).astype(int)

    return df
