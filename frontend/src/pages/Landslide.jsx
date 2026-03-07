import React from 'react';
import DisasterPredictor from '../components/DisasterPredictor';
import { Mountain, MapPin, Users, Navigation } from 'lucide-react';

export default function Landslide() {
    return (
        <DisasterPredictor
            title="Landslide Risk Analyzer"
            description="Predict landslide casualty risk using geolocation and proximity factors. Powered by NASA global landslide catalog."
            disasterType="landslide"
            themeColor="orange"
            icon={Mountain}
            featuresMeta={{
                latitude:   { icon: MapPin,     label: "Latitude",              desc: "N/S Topography (-90 to 90)",   min: -90,    max: 90,     step: 0.1,  default: 35.0   },
                longitude:  { icon: Navigation, label: "Longitude",             desc: "E/W Topography (-180 to 180)", min: -180,   max: 180,    step: 0.1,  default: -118.0 },
                population: { icon: Users,      label: "Local Population",      desc: "Density in slope-risk zones",  min: 0,      max: 1000000, step: 1000, default: 50000  },
                distance:   { icon: Navigation, label: "Fault Distance (km)",   desc: "Proximity to fracture zone",   min: 0,      max: 500,    step: 1,    default: 50     }
            }}
        />
    );
}
