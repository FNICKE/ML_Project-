import React from 'react';
import DisasterPredictor from '../components/DisasterPredictor';
import { MapPin, Navigation, ArrowDown } from 'lucide-react';

export default function Earthquake() {
    return (
        <DisasterPredictor
            title="Seismic Intelligence"
            description="Predict high-magnitude earthquakes (≥6.0) using geolocation and depth data. Based on USGS seismic database."
            disasterType="earthquake"
            themeColor="amber"
            icon={ArrowDown}
            featuresMeta={{
                Latitude:  { icon: MapPin,      label: "Latitude",         desc: "N/S Geolocation (-90 to 90)",    min: -90,  max: 90,  step: 0.1, default: 35.0  },
                Longitude: { icon: Navigation,  label: "Longitude",        desc: "E/W Geolocation (-180 to 180)",  min: -180, max: 180, step: 0.1, default: -118.0 },
                Depth:     { icon: ArrowDown,   label: "Focal Depth (km)", desc: "Hypocenter depth below surface", min: 0,    max: 700, step: 1,   default: 10    }
            }}
        />
    );
}
