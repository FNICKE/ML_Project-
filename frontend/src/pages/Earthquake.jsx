import React from 'react';
import DisasterPredictor from '../components/DisasterPredictor';
import { MapPin, Navigation, ArrowDown } from 'lucide-react';

export default function Earthquake() {
    return (
        <DisasterPredictor
            title="Seismic Magnitude AI"
            description="Estimates earthquake High-Risk magnitude (>6.0) probability using geo-coordinates."
            disasterType="earthquake"
            themeColor="amber"
            icon={ArrowDown}
            featuresMeta={{
                Latitude: { icon: MapPin, label: "Latitude", desc: "N/S Continental position", min: -90, max: 90, step: 0.1, default: 35.0 },
                Longitude: { icon: Navigation, label: "Longitude", desc: "E/W Continental position", min: -180, max: 180, step: 0.1, default: -118.0 },
                Depth: { icon: ArrowDown, label: "Focal Depth (km)", desc: "Hypocenter depth", min: 0, max: 700, step: 1, default: 10 }
            }}
        />
    );
}
