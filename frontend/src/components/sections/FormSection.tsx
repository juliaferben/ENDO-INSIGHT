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
    defaultValue?: number | string | boolean;
    unit?: string | number;
    allowedValues?: Array<number | string>;
};


type FormSectionProps = {
    patient: Record<string, any>;
    onChange: (name: string, value: any) => void;
    onAnalyze: (payload: Record<string, any>) => void;
};

function FormSection({ patient, onChange, onAnalyze }: FormSectionProps) {
    const [schema, setSchema] = useState<FieldSchema[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSchema() {
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/cox/schema`);
                const data = await res.json();

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

        console.log("Submitting:", payload);

        onAnalyze(payload);
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

export default FormSection;
