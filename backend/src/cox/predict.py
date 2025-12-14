def predict_patient(patient_dict, artifacts):
    from .preprocessing import preprocess_one
    from .risk import risk_group_from_score

    X = preprocess_one(patient_dict, artifacts)

    score = float(artifacts.model.predict_partial_hazard(X).iloc[0])

    surv = artifacts.model.predict_survival_function(
        X, times=[365, 3*365, 5*365]
    )

    result = {
        "risk_score": score,
        "risk_group": risk_group_from_score(score, artifacts.thresholds),
        "dfs_prob_1y": float(surv.iloc[0, 0]),
        "dfs_prob_3y": float(surv.iloc[1, 0]),
        "dfs_prob_5y": float(surv.iloc[2, 0]),
    }

    # Explainability: beta * x
    coefs = artifacts.model.params_
    contrib = (X.iloc[0] * coefs).sort_values(
        key=lambda v: v.abs(), ascending=False
    )
    result["top_contributors"] = contrib.head(5).to_dict()

    return result
