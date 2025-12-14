from pydantic import BaseModel
from typing import Dict

class PredictionOutput(BaseModel):
    risk_score: float
    risk_group: str
    dfs_prob_1y: float
    dfs_prob_3y: float
    dfs_prob_5y: float
    top_contributors: Dict[str, float]
