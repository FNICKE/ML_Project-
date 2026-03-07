import React from 'react';
import DisasterPredictor from '../components/DisasterPredictor';
import { Waves, Activity, ArrowDown } from 'lucide-react';

export default function Tsunami() {
    return (
        <DisasterPredictor
            title="Tsunami Detection Engine"
            description="Predicts devastating tsunami wave generation based on marine seismic activity."
            disasterType="tsunami"
            themeColor="cyan"
            icon={Waves}
            featuresMeta={{
                EQ_MAGNITUDE: { icon: Activity, label: "Marine Magnitude", desc: "Seismic scale", min: 0, max: 10, step: 0.1, default: 7.5 },
                EQ_DEPTH: { icon: ArrowDown, label: "Focal Depth (km)", desc: "Ocean floor rupture point", min: 0, max: 200, step: 1, default: 20 }
            }}
        />
    );
}
