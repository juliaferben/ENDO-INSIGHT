from pydantic import BaseModel
from typing import Dict

class PredictionOutput(BaseModel):
    target: str
    probabilities: Dict[str, float]
    most_likely: str
