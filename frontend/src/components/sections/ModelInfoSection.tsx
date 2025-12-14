import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";

const API_URL = import.meta.env.VITE_API_URL;

function ModelInfoSection() {
    const [modelData, setModelData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [graphImageUrl, setGraphImageUrl] = useState<string | null>(null);

    useEffect(() => {
        async function fetchModelData() {
            try {
                const response = await fetch(`${API_URL}/cox/model-info`);
                const data = await response.json();
                setModelData(data);
            } catch (error) {
                console.error("Error fetching model data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchModelData();
    }, []);

    return (
        <section className="section model-info-section">

            <h1>COX model</h1>

            <div className="">
                <p>
                    This tool estimates the risk of cancer recurrence using a statistical survival model trained on patients with non-specific molecular profile (NSMP) endometrial cancer. The model integrates routinely collected clinical, pathological, and biomarker information to assess how a patient’s risk compares with similar patients in the training cohort.
                </p>
                <p>
                    Results are presented as predicted probabilities of remaining disease-free at 1, 3, and 5 years after treatment, together with a relative risk category (low, medium, or high). The relative risk score reflects how the patient’s recurrence risk compares to the reference population and should be interpreted comparatively rather than as an absolute probability.
                </p>
                <p>
                    This model is intended to support clinical decision-making and risk stratification, and should always be interpreted in the context of multidisciplinary clinical judgment and current clinical guidelines.
                </p>
            </div>
            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading model info...</p>
                </div>
            ) : modelData ? (
                // Safe to destructure here
                (() => {
                    const { model, risk_groups } = modelData;

                    const traces = Object.entries(risk_groups).map(([groupName, groupData]) => ({
                        x: groupData.curve.map((point) => point.time_days),
                        y: groupData.curve.map((point) => point.survival),
                        type: "scatter",
                        mode: "lines+markers",
                        name: `${groupName} (${groupData.n_patients} patients)`,
                    }));

                    return (
                        <div className="model-info">
                            <h2>Model Information</h2>
                            <p>Type: {model.type}</p>
                            <p>Population: {model.population}</p>
                            <p>Number of patients: {model.n_patients}</p>
                            <p>Number of events: {model.n_events}</p>
                            <p>Test C-index: {model.test_c_index}</p>

                            <h2>Survival Curves</h2>
                            <Plot
                                data={traces}
                                layout={{
                                    width: 900,
                                    height: 500,
                                    title: "Survival Curves by Risk Group",
                                    xaxis: { title: "Time (days)" },
                                    yaxis: { title: "Survival Probability", range: [0, 1] },
                                }}
                            />
                        </div>
                    );
                })()
            ) : (
                <p>Error loading model data.</p>
            )}



            <h1>Bayesian Network-Based Risk Assessment</h1>

            <p>
                This tool uses a Bayesian Network to model probabilistic relationships between clinical, pathological, and biomarker variables. The network represents how variables influence one another and allows uncertainty to be handled in a transparent and interpretable way.
            </p>

            <p>
                Unlike traditional predictive models that require a fixed set of inputs and a single predefined outcome, a Bayesian Network can compute probability distributions for any variable in the model, with or without additional evidence. This means that the target of inference is flexible: clinicians can explore different questions depending on the available information and clinical context.
            </p>

            <p>
                The model supports partial evidence. Not all variables need to be observed in order to perform inference. When some data are missing or unknown, the network automatically marginalizes over unobserved variables and still produces coherent probability estimates based on learned dependencies.
            </p>

            <p>
                A key feature of Bayesian Networks is their ability to represent causal reasoning phenomena, such as explaining away. When multiple causes can lead to the same outcome, observing evidence for one cause can reduce the inferred probability of alternative causes. This enables more nuanced interpretation compared to models that assume independent effects.
            </p>

            <p>
                Probabilities can be updated dynamically as new information becomes available, allowing the model to reflect how clinical beliefs should change in light of new evidence. This makes the network particularly well suited for exploratory analysis, decision support, and reasoning under uncertainty.
            </p>

            <div className="model-info">
                <h2>Model Information</h2>
                <p>Type: Bayesian Network (Probabilistic Graphical Model)</p>
                <p>Inference: Exact probabilistic inference</p>
                <p>Variables: Clinical, pathological, and biomarker features</p>
                <p>Outputs: Marginal and conditional probability distributions for any variable</p>
            </div>

            <div>
                <h2>Interpretation and Use</h2>
                <p>
                    This Bayesian Network is intended to support probabilistic reasoning and hypothesis exploration, rather than to provide deterministic predictions. Outputs should be interpreted as probabilities conditioned on the current evidence and the learned structure of the network.
                </p>

                <p>
                    The current model represents a demonstration network learned from data and simplified assumptions. Its performance and interpretability can be substantially improved by incorporating expert knowledge, such as clinically validated causal relationships, constraints on dependencies, or refined variable definitions.
                </p>
            </div>

            <img src="/graph_image.jpg" alt="Project Logo" />
        </section>
    );
}

export default ModelInfoSection;
