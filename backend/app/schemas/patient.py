from pydantic import BaseModel, Field
from typing import Optional

class PatientInput(BaseModel):
    # --------------------
    # Patient
    # --------------------
    edad: float = Field(
        ...,
        title="Age",
        description="Age at diagnosis (years)",
        extra={"min": 18, "max": 100, "default": 18}
    )

    imc: Optional[float] = Field(
        None,
        title="Body Mass Index",
        description="Body Mass Index (kg/m²)",
        extra={"min": 10, "max": 60, "unit": "kg/m²", "default": 10}
    )

    asa: Optional[int] = Field(
        None,
        title="ASA score",
        description="American Society of Anesthesiologists physical status",
        extra={"allowed_values": [1, 2, 3, 4], "default": 1}
    )

    # --------------------
    # Tumor
    # --------------------
    grado_histologi: int = Field(
        ...,
        title="Histological grade",
        description="Tumor histological grade",
        extra={"allowed_values": [1, 2, 3], "default": 1}
    )

    tamano_tumoral: Optional[float] = Field(
        None,
        title="Tumor size",
        description="Maximum tumor diameter (cm)",
        extra={"min": 0, "unit": "cm", "default": 1}
    )

    infiltracion_mi: Optional[int] = Field(
        None,
        title="Myometrial invasion",
        description="Presence of myometrial invasion",
        extra={"allowed_values": [0, 1], "default": 0}
    )

    afectacion_linf: Optional[int] = Field(
        None,
        title="Lymphovascular space invasion (LVSI)",
        description="Presence of lymphovascular invasion",
        extra={"allowed_values": [0, 1], "default": 0}
    )

    metasta_distan: int = Field(
        ...,
        title="Distant metastasis",
        description="Presence of distant metastasis at diagnosis",
        extra={"allowed_values": [0, 1], "default": 0}
    )

    # --------------------
    # Nodal raw info
    # --------------------
    n_GC_Afect: Optional[int] = Field(
        None,
        title="Positive sentinel lymph nodes",
        description="Number of affected sentinel lymph nodes",
        extra={"min": 0, "default": 0}
    )

    n_gangP_afec: Optional[int] = Field(
        None,
        title="Positive pelvic lymph nodes",
        description="Number of affected pelvic lymph nodes",
        extra={"min": 0, "default": 0},
    )

    n_ganPaor_InfrM_afec: Optional[int] = Field(
        None,
        title="Positive para-aortic nodes (infra-mesenteric)",
        description="Number of affected para-aortic lymph nodes (infra-mesenteric)",
        extra={"min": 0, "default": 0}
    )

    n_ganPaor_Sup_afec: Optional[int] = Field(
        None,
        title="Positive para-aortic nodes (supra-mesenteric)",
        description="Number of affected para-aortic lymph nodes (supra-mesenteric)",
        extra={"min": 0,  "default": 0}
    )

    # --------------------
    # Hormonal
    # --------------------
    recep_est_porcent: Optional[float] = Field(
        None,
        title="Estrogen receptor expression",
        description="Percentage of estrogen receptor expression",
        extra={"min": 0, "max": 100, "unit": "%",  "default": 0}
    )

    rece_de_Ppor: Optional[float] = Field(
        None,
        title="Progesterone receptor expression",
        description="Percentage of progesterone receptor expression",
        extra={"min": 0, "max": 100, "unit": "%",  "default": 0}
    )

    # --------------------
    # Genetics
    # --------------------
    estudio_genetico_r01: Optional[int] = Field(
        None,
        title="Genetic study result 1",
        description="Genetic study performed (flag)",
        extra={"allowed_values": [0, 1],  "default": 0},
    )
    estudio_genetico_r02: Optional[int] = Field(
        None, 
        title="Genetic study result 2",
        description="Genetic study performed (flag)",
        extra={"allowed_values": [0, 1],  "default": 0},
    )

    estudio_genetico_r03: Optional[int] = Field(
        None, 
        title="Genetic study result 3",
        description="Genetic study performed (flag)",
        extra={"allowed_values": [0, 1],  "default": 0},
    )

    estudio_genetico_r04: Optional[int] = Field(
        None, 
        title="Genetic study result 4",
        description="Genetic study performed (flag)",
        extra={"allowed_values": [0, 1], "default": 0},
    )

    estudio_genetico_r05: Optional[int] = Field(
        None, 
        title="Genetic study result 5",
        description="Genetic study performed (flag)",
        extra={"allowed_values": [0, 1],  "default": 0},
    )

    estudio_genetico_r06: Optional[int] = Field(
        None, 
        title="Genetic study result 5",
        description="Genetic study performed (flag)",
        extra={"allowed_values": [0, 1],  "default": 0},
    )
    # --------------------
    # Stage
    # --------------------
    FIGO2023: int = Field(
        title="FIGO stage (2023)",
        description="Final surgical FIGO stage",
        extra={"allowed_values": [1, 2, 3, 4], "default": 0},
    )