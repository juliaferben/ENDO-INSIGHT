import pickle
from pgmpy.inference import VariableElimination
from pathlib import Path

class ModelArtifacts:
    def __init__(self, path="model"):
        path = Path(path)
        with open(path / "bayesian_network.pkl", "rb") as f:
            self.model = pickle.load(f)

        self.inference = VariableElimination(self.model)

    @property
    def nodes(self):
        return list(self.model.nodes())

    @property
    def edges(self):
        return list(self.model.edges())
