from fastapi import APIRouter
from app.schemas.patient import PatientInput
from app.schemas.prediction import PredictionOutput
from src.cox.model_loader import ModelArtifacts
from src.cox.predict import predict_patient

router = APIRouter(prefix="/cox", tags=["cox"])
artifacts = ModelArtifacts()

@router.post("/predict", response_model=PredictionOutput)
def predict(patient: PatientInput):
    return predict_patient(patient.model_dump(), artifacts)

@router.get("/schema")
def get_patient_schema():
    schema = PatientInput.model_json_schema()

    fields = []
    for name, props in schema["properties"].items():
        fields.append({
            "internal_name": name,
            "external_name": props.get("title", name),
            "required": name in schema.get("required", []),
            "description": props.get("description", ""),
            "constraints": props.get("extra", {}),
            "default": props.get("default")
        })

    return {
        "model": "PatientInput",
        "fields": fields
    }

@router.get("/model-info")
def model_info():
    return {
        "model": {
            "type": "Cox proportional hazards",
            "population": "NSMP endometrial cancer",
            "n_patients": 113,
            "n_events": 21,
            "test_c_index": 0.80,
            "assumptions": {
                "proportional_hazards": "passed"
            }
        },
        "features": artifacts.feature_importance,
        "risk_groups": artifacts.km_curves
    }

if __name__ == "__main__":

    print(get_patient_schema())