def risk_group_from_score(score, thresholds):
    if score <= thresholds["q1"]:
        return "Low"
    elif score <= thresholds["q2"]:
        return "Medium"
    return "High"