from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Union

class FlexiblePredictionInput(BaseModel):
    targets: List[str] = Field(
        ..., 
        description="One or more target variable names in the Bayesian Network"
    )
    evidence: Optional[Dict[str, Union[str, float, int]]] = Field(
        None,
        description="Known values (evidence) for variables in the network"
    )


class FlexiblePredictionOutput(BaseModel):
    results: Dict[str, Dict[str, float]]
