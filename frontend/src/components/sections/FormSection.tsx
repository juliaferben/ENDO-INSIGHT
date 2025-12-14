import React from "react";
import { useEffect, useState } from "react";
import PatientForm from "../forms/PatientForm";
import { mapType } from "../../utils/uitls";

const API_URL = import.meta.env.VITE_API_URL;

export type FieldSchema = {
    name: string;
    label: string;
    type: "number" | "boolean" | "text";
    min?: number;
    max?: number;
    step?: number;
};

type FormSectionProps = {
    patient: Record<string, any>;
    onChange: (name: string, value: any) => void;
    onAnalyze: () => void;
};

function FormSection({ patient, onChange, onAnalyze }: FormSectionProps) {
    const [schema, setSchema] = useState<FieldSchema[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSchema() {
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/api/schema`);
                const data = await res.json();

                // Extract fields and map them to FieldSchema format
                const mappedSchema = data.fields.map((f: any) => ({
                    name: f.internal_name,
                    label: f.external_name,
                    type: mapType(f.type),
                    min: f.constraints?.min,
                    max: f.constraints?.max,
                    step: f.constraints?.step,
                }));

                setSchema(mappedSchema);
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
        console.log("Submitting:", patient);
        // API call goes here
        onAnalyze();
    };

    return (
        <section className="section form-section">
            <h2 className="page-title">Patient Form</h2>
            <div className="section-card">
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading form...</p>
                    </div>
                ) : (
                    <PatientForm
                        schema={schema}
                        values={patient}
                        onChange={onChange}
                        onSubmit={handleSubmit} />
                )}
            </div>
        </section>
    );
}

export default FormSection;
