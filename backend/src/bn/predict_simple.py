from src.bn.preprocess_simple import preprocess_patient

TARGET_VAR = "recidiva"

def predict_patient(patient_data: dict, artifacts):
    evidence = preprocess_patient(patient_data)

    # Remove variables not in the model
    evidence = {
        k: v for k, v in evidence.items()
        if k in artifacts.model.nodes()
    }

    query = artifacts.inference.query(
        variables=[TARGET_VAR],
        evidence=evidence,
        show_progress=False
    )

    probs = {
        state: float(prob)
        for state, prob in zip(
            query.state_names[TARGET_VAR],
            query.values
        )
    }

    most_likely = max(probs, key=probs.get)

    return {
        "target": TARGET_VAR,
        "probabilities": probs,
        "most_likely": most_likely
    }


def predict_flexible(targets, evidence, artifacts):
    from src.bn.preprocess_simple import preprocess_patient

    # Preprocess evidence
    if evidence is None:
        evidence = {}
    evidence_proc = preprocess_patient(evidence)

    # Remove unknown nodes
    evidence_proc = {k: v for k, v in evidence_proc.items() if k in artifacts.model.nodes()}

    results = {}
    for target in targets:
        if target not in artifacts.model.nodes():
            raise ValueError(f"Target '{target}' is not a valid node in the network")
        
        query = artifacts.inference.query(
            variables=[target],
            evidence=evidence_proc,
            show_progress=False
        )

        # Convert to dictionary: {state_name: probability}
        probs = {state: float(prob) for state, prob in zip(query.state_names[target], query.values)}
        results[target] = probs

    return {"results": results}

