import React from "react";

type ResultsType = Record<string, Record<string, number>>;

interface BayesianResultsSectionProps {
    results: ResultsType | null;
}

const BayesianResultsSection: React.FC<BayesianResultsSectionProps> = ({ results }) => {
    if (!results || Object.keys(results).length === 0) {
        return (
            <section className="section results-section">
                <div className="section-card">
                    <h2 className="page-title">Results</h2>
                    <p>No results available.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="section results-section">
            <div className="section-card">
                <h2 className="page-title">Results</h2>
                {Object.entries(results).map(([target, values]) => (
                    <div key={target} className="result-variable">
                        <h3 className="result-title">{target}</h3>
                        <table className="result-table">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Probability</th>
                                </tr>
                            </thead>
                            <tbody>
                                {values &&
                                    Object.entries(values).map(([category, prob]) => (
                                        <tr key={category}>
                                            <td>{category}</td>
                                            <td>{Number(prob).toFixed(3)}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default BayesianResultsSection;
