from pydantic import BaseModel
from typing import List

class GraphNode(BaseModel):
    id: str
    label: str

class GraphEdge(BaseModel):
    source: str
    target: str

class GraphOutput(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]
