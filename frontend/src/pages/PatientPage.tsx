import React from "react";
import { useState } from "react";

import IntroSection from "../components/sections/IntroSection";
import FormSection from "../components/sections/FormSection";
import ResultsSection from "../components/sections/ResultsSection";
import type { Results } from "../components/sections/ResultsSection";
const API_URL = import.meta.env.VITE_API_URL;

function MainPage() {
    const [patient, setPatient] = useState<Record<string, any>>({});
    const [results, setResults] = useState<Results | null>(null);

    const handleAnalyze = async (payload: Record<string, any>) => {
        console.log("Analyzing patient:", payload);

        try {
            const response = await fetch(`${API_URL}/cox/predict`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Prediction API request failed");
            }

            const data = await response.json();
            setResults(data);
        } catch (err) {
            console.error("Prediction failed:", err);
        }
    };

    const handleChange = (name: string, value: any) => {
        setPatient((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="page page-main">
            <IntroSection />
            <FormSection
                patient={patient}
                onChange={handleChange}
                onAnalyze={handleAnalyze}
            />
            {results && <ResultsSection results={results} />}
        </div>
    );
}

export default MainPage;
