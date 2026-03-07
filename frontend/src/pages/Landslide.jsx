import React from 'react';
import DisasterPredictor from '../components/DisasterPredictor';
import { Mountain, MapPin, Users, Navigation } from 'lucide-react';

export default function Landslide() {
    return (
        <DisasterPredictor
            title="Landslide Risk Analysis"
            description="Computes slope instability risk and human impact distance using topographical data."
            disasterType="landslide"
            themeColor="orange"
            icon={Mountain}
            featuresMeta={{
                latitude: { icon: MapPin, label: "Latitude", desc: "N/S Topographical position", min: -90, max: 90, step: 0.1, default: 35.0 },
                longitude: { icon: Navigation, label: "Longitude", desc: "E/W Topographical position", min: -180, max: 180, step: 0.1, default: -118.0 },
                population: { icon: Users, label: "Local Population", desc: "Density in vulnerable slope zones", min: 0, max: 1000000, step: 1000, default: 50000 },
                distance: { icon: Navigation, label: "Fault Distance (km)", desc: "Proximity to fracture zone", min: 0, max: 500, step: 1, default: 50 }
            }}
        />
    );
}
