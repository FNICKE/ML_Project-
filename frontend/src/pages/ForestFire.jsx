import React from 'react';
import DisasterPredictor from '../components/DisasterPredictor';
import { Flame, Wind, Droplets, ThermometerSun, Activity } from 'lucide-react';

export default function ForestFire() {
    return (
        <DisasterPredictor
            title="Wildfire Risk Engine"
            description="Analyze forest fire danger using fire weather indices and meteorological data from the UCI Forest Fire dataset."
            disasterType="forestfire"
            themeColor="rose"
            icon={Flame}
            featuresMeta={{
                FFMC: { icon: Activity,       label: "FFMC",               desc: "Fine Fuel Moisture Code",   min: 18,  max: 100, step: 1,   default: 90  },
                DMC:  { icon: Activity,       label: "DMC",                desc: "Duff Moisture Code",        min: 1,   max: 300, step: 1,   default: 110 },
                DC:   { icon: Activity,       label: "DC",                 desc: "Drought Code",              min: 7,   max: 860, step: 1,   default: 500 },
                ISI:  { icon: Activity,       label: "ISI",                desc: "Initial Spread Index",      min: 0,   max: 60,  step: 0.1, default: 8.5 },
                temp: { icon: ThermometerSun, label: "Temperature (°C)",   desc: "Current ambient heat",      min: 2,   max: 40,  step: 0.5, default: 25  },
                RH:   { icon: Droplets,       label: "Relative Humidity",  desc: "Air moisture (%)",          min: 15,  max: 100, step: 1,   default: 45  },
                wind: { icon: Wind,           label: "Wind Speed (km/h)",  desc: "Atmospheric air velocity",  min: 0.4, max: 10,  step: 0.1, default: 4.0 },
                rain: { icon: Droplets,       label: "Rainfall (mm/m²)",   desc: "Recent precipitation",      min: 0,   max: 7,   step: 0.1, default: 0.0 }
            }}
        />
    );
}
