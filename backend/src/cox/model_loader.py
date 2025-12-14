import json, pickle
from pathlib import Path

class ModelArtifacts:
    def __init__(self, path="model"):
        path = Path(path)

        with open(path / "cox_model.pkl", "rb") as f:
            self.model = pickle.load(f)

        with open(path / "preprocess.json") as f:
            self.preprocess = json.load(f)

        with open(path / "risk_thresholds.json") as f:
            self.thresholds = json.load(f)

        with open(path / "feature_importance.json") as f:
            self.feature_importance = json.load(f)

        with open(path / "km_curves.json") as f:
            self.km_curves = json.load(f)

        self.final_features = self.preprocess["final_features"]
        self.medians = self.preprocess["num_medians"]
        self.train_columns = self.preprocess["train_columns"]

