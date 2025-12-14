import React from "react";
import { useState } from "react";

import IntroSection from "../components/sections/IntroSection";
import ModelInfoSection from "../components/sections/ModelInfoSection";

const API_URL = import.meta.env.VITE_API_URL;

function ModelPage() {

    return (
        <div className="page page-model">
            <IntroSection />
            <ModelInfoSection />
        </div>
    );
}

export default ModelPage;
