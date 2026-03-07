import React from 'react';
import DisasterPredictor from '../components/DisasterPredictor';
import { Wind, Settings, AlertTriangle, Droplets, TrendingUp } from 'lucide-react';

export default function Flood() {
    return (
        <DisasterPredictor
            title="Flood Risk Engine"
            description="Predicts urban and coastal flooding using 20 complex hydro-geological variants."
            disasterType="flood"
            themeColor="indigo"
            icon={Droplets}
            featuresMeta={{
                CoastalVulnerability: { icon: Wind, label: "Coastal Vulnerability", desc: "Storm surge susceptibility", min: 0, max: 16, default: 5 },
                DamsQuality: { icon: Settings, label: "Dams Quality", desc: "Structural integrity", min: 0, max: 16, default: 5 },
                DeterioratingInfrastructure: { icon: AlertTriangle, label: "Deteriorating Infra", desc: "Aging roads, pipes", min: 0, max: 16, default: 5 },
                Watersheds: { icon: Droplets, label: "Watersheds", desc: "Catchment vitality", min: 0, max: 16, default: 5 },
                Landslides: { icon: TrendingUp, label: "Soil Displacement", desc: "Erosion leading to flood", min: 0, max: 16, default: 5 }
            }}
        />
    );
}
