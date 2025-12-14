import React from "react";
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineOppositeContent,
} from '@mui/lab';
import { Box, Typography, LinearProgress } from '@mui/material';

export type Results = {
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

    const riskClass =
        risk_group === "High" ? "risk-high" :
            risk_group === "Medium" ? "risk-medium" :
                "risk-low";

    const dfsPoints = [
        { year: 1, prob: dfs_prob_1y },
        { year: 3, prob: dfs_prob_3y },
        { year: 5, prob: dfs_prob_5y },
    ];

    const topContributors = Object.entries(top_contributors);

    // Function to get bar color (green = good/high, red = bad/low)
    const getBarColor = (prob: number) => {
        if (prob >= 0.7) return "#16a34a"; // green
        if (prob >= 0.4) return "#f97316"; // orange
        return "#dc2626"; // red
    };

    return (
        <section className="section results-section">
            <div className="section-card">
                <h2 className="page-title">Results</h2>

                {/* Row 1: Risk Score & Risk Group */}
                <div className="results-row">
                    <div className="results-card">
                        <p className="results-label">Risk Score</p>
                        <p className={`results-number`}>{risk_score.toFixed(2)}</p>
                    </div>
                    <div className="results-card">
                        <p className="results-label">Risk Group</p>
                        <p className={`results-number ${riskClass}`}>{risk_group}</p>
                    </div>
                </div>

                {/* Row 2: DFS timeline & Top Contributors side by side */}
                <Box display="flex" gap={4} mt={3}>
                    {/* Left: Vertical DFS Timeline */}
                    <Box flex={1}>
                        <Typography variant="h6" gutterBottom><b>Disease Free Surivival</b> Probabilities Timeline</Typography>
                        <Timeline position="right">
                            {dfsPoints.map((point, index) => (
                                <TimelineItem key={point.year}>

                                    {/* Left: Year */}
                                    <TimelineOppositeContent
                                        sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', pr: 2 }}
                                    >
                                        <Typography variant="body2">{point.year} years</Typography>
                                    </TimelineOppositeContent>

                                    {/* Node + connector */}
                                    <TimelineSeparator>
                                        <TimelineDot sx={{ bgcolor: "#c0266d", width: 24, height: 24 }} />
                                        {index < dfsPoints.length - 1 && (
                                            <TimelineConnector sx={{ bgcolor: "#c0266d", width: 2 }} />
                                        )}
                                    </TimelineSeparator>

                                    {/* Right: Probability bar + number */}
                                    <TimelineContent sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box display="flex" alignItems="center" gap={1} width="100%">
                                            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={point.prob * 100}
                                                    sx={{
                                                        height: 12,
                                                        borderRadius: 6,
                                                        width: "100%",
                                                        bgcolor: "#f0f0f0",
                                                        '& .MuiLinearProgress-bar': { bgcolor: getBarColor(point.prob) },
                                                    }}
                                                />
                                            </Box>
                                            <Typography variant="body2" width={40} textAlign="right">
                                                {(point.prob * 100).toFixed(1)}%
                                            </Typography>
                                        </Box>
                                    </TimelineContent>

                                </TimelineItem>
                            ))}
                        </Timeline>



                    </Box>

                    {/* Right: Top Contributors Table */}
                    <Box flex={1}>
                        <Typography variant="h6" gutterBottom>Top Contributors</Typography>
                        <Box component="table" width="100%" borderCollapse="collapse">
                            <thead>
                                <tr>
                                    <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e7eb" }}>Feature</th>
                                    <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e7eb" }}>Coefficient</th>
                                    <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e7eb" }}>Impact</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topContributors.map(([feature, coef]) => (
                                    <tr key={feature}>
                                        <td style={{ padding: "0.5rem" }}>{feature}</td>
                                        <td style={{ padding: "0.5rem" }}>{coef.toFixed(3)}</td>
                                        <td style={{ padding: "0.5rem" }}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={Math.min(Math.abs(coef) * 50, 100)}
                                                sx={{
                                                    height: 10,
                                                    borderRadius: 5,
                                                    '& .MuiLinearProgress-bar': { bgcolor: "#c0266d" },
                                                    bgcolor: "#f0f0f0",
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Box>
                    </Box>
                </Box>
            </div>
        </section>
    );
}

export default ResultsSection;
