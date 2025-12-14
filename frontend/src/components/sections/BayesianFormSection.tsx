import React from "react";
import { useEffect, useState } from "react";
import PatientForm from "../forms/PatientForm";
import { mapType } from "../../utils/uitls";

const API_URL = import.meta.env.VITE_API_URL;

type SchemaResponse = {
    model: string;
    fields: any[];
    targets: string[];
};

export type FieldSchema = {
    name: string;
    label: string;
    type: "number" | "boolean" | "text";
    min?: number;
    max?: number;
    step?: number;
    defaultValue?: number | string | boolean;
    unit?: string | number;
    allowedValues?: Array<number | string>;
};


type FormSectionProps = {
    patient: Record<string, any>;
    onChange: (name: string, value: any) => void;
    onAnalyze: (payload: Record<string, any>) => void;
};

function BayesianFormSection({ patient, onChange, onAnalyze }: FormSectionProps) {
    const [schema, setSchema] = useState<FieldSchema[]>([]);
    const [targets, setTargets] = useState<string[]>([]);
    const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSchema() {
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/bayesian/schema`);
                const data: SchemaResponse = await res.json();

                const mappedSchema = data.fields.map((f: any) => ({
                    name: f.internal_name,
                    label: f.external_name,
                    type: mapType(f.type),
                    min: f.constraints?.min,
                    max: f.constraints?.max,
                    step: f.constraints?.step,
                    defaultValue: f.constraints?.default,
                    unit: f.constraints?.unit,
                    allowedValues: f.constraints?.allowed_values
                }));

                setSchema(mappedSchema);
                setTargets(data.targets);
            } catch (err) {
                console.error(err);
                setSchema([]);
            } finally {
                setLoading(false);
            }
        }

        fetchSchema();
    }, []);

    const handleSubmit = () => {
        const payload: Record<string, any> = { ...patient };

        schema.forEach((field) => {
            if (payload[field.name] === undefined) {
                if (field.defaultValue !== undefined) {
                    payload[field.name] = field.defaultValue;
                } else if (field.type === "boolean") {
                    payload[field.name] = false;
                }
            }
        });

        Object.keys(payload).forEach((key) => {
            if (payload[key] === "Missing") {
                delete payload[key];
            }
        });

        const finalPayload = {
            patient: payload,
            targets: selectedTargets
        };

        console.log("Submitting:", finalPayload);
        onAnalyze(finalPayload);
    };

    const toggleTarget = (target: string) => {
        setSelectedTargets((prev) =>
            prev.includes(target)
                ? prev.filter((t) => t !== target)
                : [...prev, target]
        );
    };

    return (
        <section className="section form-section">

            <h2 className="page-title">Targets</h2>
            <div className="section-card">
                {targets.length > 0 && (
                    <div className="targets-section">
                        <div className="targets-grid">
                            {targets.map((target) => (
                                <label key={target} className="target-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={selectedTargets.includes(target)}
                                        onChange={() => toggleTarget(target)}
                                    />
                                    <span className="target-label">{target}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <h2 className="page-title">Patient Form</h2>
            <div className="section-card">
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading form...</p>
                    </div>
                ) : schema.length > 0 ? (
                    <PatientForm
                        schema={schema}
                        values={patient}
                        onChange={onChange}
                        onSubmit={handleSubmit} />
                ) : (
                    <p>Error loading schema.</p>
                )}
            </div>
        </section>
    );
}

export default BayesianFormSection;
