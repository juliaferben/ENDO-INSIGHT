from pydantic import BaseModel, Field
from typing import Optional, Literal


class PatientInput(BaseModel):
    # --------------------
    # Patient
    # --------------------
    edad: Literal["0.0", "1.0", "2.0", "3.0", "Missing"] = Field(
        ...,
        title="Age group",
        description="Discretized age group used by the Bayesian Network",
        extra={
            "allowed_values": ["0.0", "1.0", "2.0", "3.0", "Missing"],
            "default": "Missing"
        }
    )

    imc: Optional[Literal["0.0", "1.0", "2.0", "3.0", "Missing"]] = Field(
        None,
        title="BMI group",
        description="Discretized body mass index group",
        extra={
            "allowed_values": ["0.0", "1.0", "2.0", "3.0", "Missing"],
            "default": "Missing"
        }
    )

    asa: Optional[Literal["0.0", "1.0", "2.0", "Missing"]] = Field(
        None,
        title="ASA score",
        description="Discretized ASA physical status category",
        extra={
            "allowed_values": ["0.0", "1.0", "2.0", "Missing"],
            "default": "Missing"
        }
    )

    # --------------------
    # Tumor pathology
    # --------------------
    grado_histologi: Literal["1.0", "2.0", "Missing"] = Field(
        ...,
        title="Histological grade",
        description="Discretized tumor histological grade",
        extra={
            "allowed_values": ["1.0", "2.0", "Missing"],
            "default": "Missing"
        }
    )

    tamano_tumoral: Optional[Literal["0.0", "1.0", "2.0", "3.0", "Missing"]] = Field(
        None,
        title="Tumor size group",
        description="Discretized tumor size category",
        extra={
            "allowed_values": ["0.0", "1.0", "2.0", "3.0", "Missing"],
            "default": "Missing"
        }
    )

    afectacion_linf: Optional[Literal["0.0", "1.0", "Missing"]] = Field(
        None,
        title="Lymphovascular space invasion",
        description="Discretized lymphovascular invasion status",
        extra={
            "allowed_values": ["0.0", "1.0", "Missing"],
            "default": "Missing"
        }
    )

    # --------------------
    # Metastasis
    # --------------------
    metasta_distan: Literal["0.0", "1.0", "Missing"] = Field(
        ...,
        title="Distant metastasis",
        description="Discretized distant metastasis status",
        extra={
            "allowed_values": ["0.0", "1.0", "Missing"],
            "default": "Missing"
        }
    )

    # --------------------
    # Hormonal receptors
    # --------------------
    recep_est_porcent: Optional[
        Literal["-1.0", "0.0", "1.0", "2.0", "Missing"]
    ] = Field(
        None,
        title="Estrogen receptor group",
        description="Discretized estrogen receptor expression",
        extra={
            "allowed_values": ["-1.0", "0.0", "1.0", "2.0", "Missing"],
            "default": "Missing"
        }
    )

    rece_de_Ppor: Optional[
        Literal["-1.0", "0.0", "1.0", "2.0", "3.0", "Missing"]
    ] = Field(
        None,
        title="Progesterone receptor group",
        description="Discretized progesterone receptor expression",
        extra={
            "allowed_values": ["-1.0", "0.0", "1.0", "2.0", "3.0", "Missing"],
            "default": "Missing"
        }
    )

    # --------------------
    # Genetics
    # --------------------
    estudio_genetico_r01: Optional[
        Literal["0.0", "1.0", "Missing"]
    ] = Field(
        None,
        title="Genetic study performed",
        description="Whether a genetic study was performed",
        extra={
            "allowed_values": ["0.0", "1.0", "Missing"],
            "default": "Missing"
        }
    )

    # --------------------
    # Stage
    # --------------------
    FIGO2023: Literal[
        "1.0", "2.0", "4.0", "6.0", "7.0", "8.0",
        "9.0", "10.0", "11.0", "12.0", "13.0", "14.0",
        "Missing"
    ] = Field(
        ...,
        title="FIGO stage (2023)",
        description="Discretized FIGO 2023 surgical stage",
        extra={
            "allowed_values": [
                "1.0", "2.0", "4.0", "6.0", "7.0", "8.0",
                "9.0", "10.0", "11.0", "12.0", "13.0", "14.0",
                "Missing"
            ],
            "default": "Missing"
        }
    )
