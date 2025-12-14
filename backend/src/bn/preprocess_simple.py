def preprocess_patient(patient: dict) -> dict:
    processed = {}

    for k, v in patient.items():
        if v is None:
            processed[k] = "Missing"
        else:
            processed[k] = str(v)

    return processed
