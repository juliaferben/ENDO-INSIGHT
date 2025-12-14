import React from "react";

function IntroSection() {
  return (
    <section className="section">
      <div className="intro-section">
        <div className="title-row">
          <img src="/page_icon.png" alt="Project Logo" />
          <h1 className="page-title">Endometrial Cancer Risk Assessment</h1>
        </div>
        <p className="page-subtitle">
          This tool estimates mortality risk using clinical data, statistical analysis, and interpretable models.
        </p>
      </div>
    </section>
  );
}

export default IntroSection;