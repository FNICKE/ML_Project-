import React from 'react';
import DisasterPredictor from '../components/DisasterPredictor';
import { Waves, Activity, ArrowDown } from 'lucide-react';

export default function Tsunami() {
    return (
        <DisasterPredictor
            title="Tsunami Detection Engine"
            description="Predict devastating tsunami wave generation based on submarine earthquake magnitude and depth. Uses NOAA tsunami dataset."
            disasterType="tsunami"
            themeColor="cyan"
            icon={Waves}
            featuresMeta={{
                EQ_MAGNITUDE: { icon: Activity, label: "Seismic Magnitude",    desc: "Richter scale (0–10)",          min: 0,   max: 10,  step: 0.1, default: 7.5 },
                EQ_DEPTH:     { icon: ArrowDown, label: "Focal Depth (km)",    desc: "Ocean floor rupture point",    min: 0,   max: 200, step: 1,   default: 20  }
            }}
        />
    );
}
