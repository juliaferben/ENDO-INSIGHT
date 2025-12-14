import React from "react";
import type { FieldSchema } from "../sections/FormSection";

type Props = {
    schema: FieldSchema[];
    values: Record<string, any>;
    onChange: (name: string, value: any) => void;
    onSubmit: () => void;
};

function PatientForm({ schema, values, onChange, onSubmit }: Props) {
    return (
        <form
            className="patient-form"
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
            }}
        >
            {schema.map((field) => (
                <div className="form-field" key={field.name}>
                    <label className="form-label">{field.label}</label>

                    {field.allowedValues ? (
                        <select
                            className="form-input form-input-select"
                            value={values[field.name] ?? ""}
                            onChange={(e) => onChange(field.name, e.target.value)}
                        >
                            <option value="" disabled>
                                {field.defaultValue ?? "Select..."}
                            </option>
                            {field.allowedValues.map((val) => (
                                <option key={val} value={val}>
                                    {val}
                                </option>
                            ))}
                        </select>
                    ) : field.type === "number" ? (
                        <input
                            className="form-input form-input-number"
                            type="number"
                            min={field.min}
                            max={field.max}
                            step={field.step}
                            value={values[field.name] ?? ""}
                            placeholder={field.defaultValue !== undefined ? String(field.defaultValue) : ""}
                            onChange={(e) => onChange(field.name, Number(e.target.value))}
                        />
                    ) : field.type === "text" ? (
                        <input
                            className="form-input form-input-text"
                            type="text"
                            value={values[field.name] ?? ""}
                            placeholder={field.defaultValue !== undefined ? String(field.defaultValue) : ""}
                            onChange={(e) => onChange(field.name, e.target.value)}
                        />
                    ) : field.type === "boolean" ? (
                        <input
                            className="form-input form-input-checkbox"
                            type="checkbox"
                            checked={values[field.name] ?? false}
                            onChange={(e) => onChange(field.name, e.target.checked)}
                        />
                    ) : null}
                </div>
            ))}

            {/* Wrap submit button */}
            <div className="form-submit-wrapper">
                <button className="form-submit" type="submit">
                    Analyze patient
                </button>
            </div>
        </form>

    );
}

export default PatientForm;
