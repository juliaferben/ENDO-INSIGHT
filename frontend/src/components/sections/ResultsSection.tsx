import React from "react";

type Results = {
  risk_score: number;
  risk_group: string;
  dfs_prob_1y: number;
  dfs_prob_3y: number;
  dfs_prob_5y: number;
  top_contributors: Record<string, number>;
};

type Props = {
  results: Results;
};

function ResultsSection({ results }: Props) {
  const { risk_score, risk_group, dfs_prob_1y, dfs_prob_3y, dfs_prob_5y, top_contributors } = results;

  // Map risk group to CSS class
  const riskClass =
    risk_group === "High" ? "risk-high" :
    risk_group === "Medium" ? "risk-medium" :
    "risk-low";

  return (
    <section className="section results-section">
      <div className="section-card">
        <h2 className="page-title">Results</h2>

        {/* Risk Score */}
        <div style={{ marginBottom: "1.5rem" }}>
          <p className="results-label">Risk Score:</p>
          <p className={`results-number ${riskClass}`}>{risk_score.toFixed(2)}</p>
        </div>

        {/* Risk Group */}
        <div style={{ marginBottom: "1.5rem" }}>
          <p className="results-label">Risk Group:</p>
          <p className={`results-number ${riskClass}`}>{risk_group}</p>
        </div>

        {/* DFS Probabilities */}
        <div style={{ marginBottom: "1.5rem" }}>
          <p className="results-label">Disease-Free Survival Probabilities:</p>
          <ul style={{ fontSize: "1.1rem", marginLeft: "1rem" }}>
            <li>1 year: {(dfs_prob_1y * 100).toFixed(1)}%</li>
            <li>3 years: {(dfs_prob_3y * 100).toFixed(1)}%</li>
            <li>5 years: {(dfs_prob_5y * 100).toFixed(1)}%</li>
          </ul>
        </div>

        {/* Top Contributors */}
        <div>
          <p className="results-label">Top Contributors (Cox PH coefficients):</p>
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Coefficient</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(top_contributors).map(([feature, coef]) => (
                <tr key={feature}>
                  <td>{feature}</td>
                  <td className="numeric">{coef.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default ResultsSection;
