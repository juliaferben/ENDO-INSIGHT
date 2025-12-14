from fastapi import APIRouter
from app.schemas.patient_simple import PatientInput
from app.schemas.prediction_simple import PredictionOutput
from app.schemas.graph_simple import GraphOutput, GraphNode, GraphEdge
from src.bn.model_loader_simple import ModelArtifacts
from src.bn.predict_simple import predict_patient
from src.bn.predict_simple import predict_flexible
from app.schemas.flexible_prediction_simple import FlexiblePredictionInput, FlexiblePredictionOutput
from fastapi import HTTPException

from fastapi.responses import StreamingResponse
import io
import matplotlib.pyplot as plt
import networkx as nx

router = APIRouter(prefix="/bayesian", tags=["Bayesian Network"])
artifacts = ModelArtifacts()


@router.post("/predict", response_model=PredictionOutput)
def predict(patient: PatientInput):
    return predict_patient(patient.model_dump(), artifacts)


@router.get("/graph", response_model=GraphOutput)
def get_graph():
    nodes = [
        GraphNode(id=n, label=n.replace("_", " ").title())
        for n in artifacts.nodes
    ]

    edges = [
        GraphEdge(source=u, target=v)
        for u, v in artifacts.edges
    ]

    return {
        "nodes": nodes,
        "edges": edges
    }


@router.get("/schema")
def get_patient_schema():
    schema = PatientInput.model_json_schema()

    fields = []
    for name, props in schema["properties"].items():
        fields.append({
            "internal_name": name,
            "external_name": props.get("title", name),
            "type": props.get("type"),
            "required": name in schema.get("required", []),
            "description": props.get("description", ""),
            "constraints": props.get("extra", {})
        })

    return {
        "model": "PatientInput",
        "fields": fields, 
        "targets": ['edad', 'asa', 'grupo_riesgo', 'imc', 'tipo_histologico', 'Grado', 'valor_de_ca125', 'ecotv_infiltsub', 'ecotv_infiltobj', 'estadiaje_pre_i', 'metasta_distan', 'tto_NA', 'tto_1_quirugico', 'histo_defin', 'grado_histologi', 'tamano_tumoral', 'afectacion_linf', 'AP_centinela_pelvico', 'AP_ganPelv', 'AP_glanPaor', 'estudio_genetico_r01', 'grupo_de_riesgo_definitivo', 'beta_cateninap', 'recep_est_porcent', 'rece_de_Ppor', 'FIGO2023', 'Tributaria_a_Radioterapia', 'Tratamiento_RT', 'Tratamiento_sistemico', 'recidiva', 'numero_de_recid', 'dx_recidiva', 'tto_recidiva', 'Tt_recidiva_qx', 'Reseccion_macroscopica_complet', 'libre_enferm', 'estad', 'causa_muerte'], 
    }


@router.get("/model-info")
def model_info():
    return {
        "model": {
            "type": "Bayesian Network",
            "engine": "pgmpy",
            "target": "recidiva",
            "inference": "Exact (Variable Elimination)"
        },
        "n_nodes": len(artifacts.nodes),
        "n_edges": len(artifacts.edges)
    }


@router.get("/graph-image")
def get_graph_image():
    """
    Returns a PNG image of the Bayesian Network.
    """
    G = nx.DiGraph()
    G.add_edges_from(artifacts.edges)

    plt.figure(figsize=(16, 12))
    
    # Use spring_layout if pygraphviz is unavailable
    try:
        pos = nx.nx_agraph.graphviz_layout(G, prog="dot")
    except:
        pos = nx.spring_layout(G, seed=42, k=1.5)

    nx.draw(
        G,
        pos,
        with_labels=True,
        node_size=2500,
        node_color="lightblue",
        font_size=10,
        arrowsize=20
    )

    # Save image to bytes
    buf = io.BytesIO()
    plt.savefig(buf, format="png", bbox_inches="tight")
    plt.close()
    buf.seek(0)
    return StreamingResponse(buf, media_type="image/png")


@router.post("/predict-flexible", response_model=FlexiblePredictionOutput)
def predict_flexible_endpoint(request: FlexiblePredictionInput):
    try:
        return predict_flexible(request.targets, request.evidence, artifacts)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
