import React, { useState, useEffect } from 'react';
import { checkHealth, predictDisaster } from '../api';
import { 
    Activity, 
    AlertTriangle, 
    CheckCircle2, 
    Info, 
    Loader2
} from 'lucide-react';

export default function DisasterPredictor({ 
    title, 
    description, 
    disasterType, 
    themeColor, 
    icon: MainIcon,
    featuresMeta 
}) {
    // dynamically initialize state
    const initialFeatures = Object.keys(featuresMeta).reduce((acc, key) => {
        acc[key] = featuresMeta[key].default;
        return acc;
    }, {});

    const [features, setFeatures] = useState(initialFeatures);
    const [status, setStatus] = useState({ state: 'checking', msg: 'Connecting to backend...' });
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Initial Health Check
    useEffect(() => {
        let isMounted = true;
        const checkConnection = async () => {
            const health = await checkHealth();
            if(!isMounted) return;
            
            if (health.status === 'ok') {
                if (health.models && health.models[disasterType]) {
                    setStatus({ state: 'online', msg: 'Engine Online' });
                } else {
                    setStatus({ state: 'error', msg: `Model for ${disasterType} not loaded on server` });
                }
            } else if (health.status === 'offline') {
                setStatus({ state: 'offline', msg: 'Backend Server Offline!' });
                setError("CRITICAL ERROR: The Python ML engine is offline! Please double-click 'start_project.bat' in your project folder to start the backend.");
            } else {
                setStatus({ state: 'error', msg: health.message || 'Error checking status' });
            }
        };
        checkConnection();
        return () => { isMounted = false; };
    }, [disasterType]);

    const handleSliderChange = (key, value) => {
        setFeatures(prev => ({ ...prev, [key]: Number(value) }));
    };

    const handlePredict = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await predictDisaster(disasterType, features);
            setPrediction(res);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (level) => {
        switch(level) {
            case 'Low': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
            case 'Moderate': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
            case 'High': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
            case 'Very High': return 'text-red-500 bg-red-500/10 border-red-500/30';
            default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
        }
    };

    const getRiskGradientBackground = (level) => {
        switch(level) {
            case 'Low': return 'bg-emerald-500';
            case 'Moderate': return 'bg-yellow-500';
            case 'High': return 'bg-orange-500';
            case 'Very High': return 'bg-red-600';
            default: return `bg-${themeColor}-500`;
        }
    };

    // Use dynamic theme classes
    // removed unused string interpolations as they are used directly in className

    return (
        <div className="flex-1 flex flex-col relative">
            {/* Header / Top Bar localized to this predictor */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${themeColor}-400 to-${themeColor}-600 flex items-center justify-center shadow-lg shadow-${themeColor}-500/25 border border-${themeColor}-400/20`}>
                            <MainIcon className="w-7 h-7 text-white" />
                        </div>
                        {title}
                    </h1>
                    <p className="text-sm text-slate-400 font-medium mt-2">{description}</p>
                </div>
                
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-md">
                    {status.state === 'online' && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />}
                    {status.state === 'checking' && <Loader2 className={`w-4 h-4 text-${themeColor}-400 animate-spin`} />}
                    {(status.state === 'offline' || status.state === 'error') && <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse" />}
                    <span className="text-sm font-semibold tracking-wide text-slate-300">
                        {status.state === 'online' ? 'Engine Online' : status.msg}
                    </span>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start w-full">
                
                {/* Left Column: Input Form */}
                <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
                    <div className="bg-[#1e293b]/60 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden flex flex-col">
                        <div className="p-8 border-b border-slate-700/50">
                            <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                <Activity className={`w-6 h-6 text-${themeColor}-400`} />
                                Environmental Parameters
                            </h2>
                        </div>
                        
                        <div className="p-8 flex-1">
                            <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
                                {Object.entries(featuresMeta).map(([key, meta]) => {
                                    const Icon = meta.icon;
                                    const percentage = ((features[key] - meta.min) / (meta.max - meta.min)) * 100;
                                    
                                    return (
                                        <div key={key} className="group relative">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg bg-slate-800 text-${themeColor}-400 border border-slate-700 group-hover:border-${themeColor}-500 transition-colors`}>
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-semibold text-slate-200 block">{meta.label}</label>
                                                        <span className="text-xs text-slate-500">{meta.desc}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="relative pt-4 pb-2">
                                                <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-800 rounded-full -translate-y-1/2 overflow-hidden">
                                                    <div 
                                                        className={`h-full bg-${themeColor}-500 rounded-full transition-all duration-300 ease-out`}
                                                        style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
                                                    />
                                                </div>
                                                
                                                <input 
                                                    type="range" 
                                                    min={meta.min} 
                                                    max={meta.max} 
                                                    step={meta.step || 1}
                                                    value={features[key]} 
                                                    onChange={(e) => handleSliderChange(key, e.target.value)}
                                                    className={`w-full relative z-10 appearance-none bg-transparent cursor-pointer
                                                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-${themeColor}-500 [&::-webkit-slider-thumb]:transition-transform hover:[&::-webkit-slider-thumb]:scale-125`}
                                                />
                                            </div>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-xs font-bold text-slate-600">{meta.min}</span>
                                                <span className={`text-sm font-black text-${themeColor}-400`}>{features[key]}</span>
                                                <span className="text-xs font-bold text-slate-600">{meta.max}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="p-8 border-t border-slate-700/50 bg-slate-800/30">
                            <button 
                                onClick={() => handlePredict()}
                                disabled={loading || status.state !== 'online'}
                                className={`w-full flex items-center justify-center px-8 py-5 rounded-2xl text-white font-bold bg-${themeColor}-600/80 hover:bg-${themeColor}-500 border border-${themeColor}-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_30px_rgba(0,0,0,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]`}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin mr-3"/> PROCESSING NEURAL NETWORK...
                                    </>
                                ) : (
                                    <>
                                        <Activity className="w-6 h-6 mr-3"/> RUN PREDICTION MODEL
                                    </>
                                )}
                            </button>
                            {error && (
                                <div className="mt-4 flex items-center gap-3 text-sm text-red-400 bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Prediction Results sticky */}
                <div className="lg:col-span-5 xl:col-span-4 sticky top-10">
                    <div className="bg-[#1e293b]/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden relative">
                        {prediction && (
                            <div className={`absolute -top-32 -right-32 w-64 h-64 blur-[100px] rounded-full opacity-30 ${getRiskGradientBackground(prediction.risk_level)}`}></div>
                        )}
                        
                        <div className="p-8 relative">
                            <h2 className="text-sm font-black tracking-widest uppercase text-slate-400 mb-8 flex items-center gap-2">
                                <Activity className="w-4 h-4" /> Analysis Output
                            </h2>

                            {!prediction && !loading && !error && (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 border border-slate-700">
                                        <Info className="w-10 h-10 text-slate-500" />
                                    </div>
                                    <p className="text-slate-300 font-semibold text-lg">Awaiting Parameters</p>
                                </div>
                            )}

                            {loading && (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <Loader2 className={`w-16 h-16 text-${themeColor}-400 animate-spin mb-6`} />
                                    <p className={`text-${themeColor}-400 font-bold tracking-widest text-sm uppercase animate-pulse`}>Computing Risk...</p>
                                </div>
                            )}

                            {prediction && !loading && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="relative flex justify-center py-4">
                                        <svg className="w-56 h-56 transform -rotate-90 filter drop-shadow-xl">
                                            <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-slate-800" />
                                            <circle 
                                                cx="112" cy="112" r="100" 
                                                stroke="currentColor" 
                                                strokeWidth="16" 
                                                fill="transparent" 
                                                strokeDasharray={2 * Math.PI * 100}
                                                strokeDashoffset={2 * Math.PI * 100 * (1 - prediction.probability)}
                                                className={`transition-all duration-1500 ease-out ${getRiskColor(prediction.risk_level).split(' ')[0]}`}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-5xl font-black text-white tracking-tighter drop-shadow-md">
                                                {(prediction.probability * 100).toFixed(1)}<span className="text-2xl text-slate-400">%</span>
                                            </span>
                                            <span className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold mt-2">Probability</span>
                                        </div>
                                    </div>

                                    <div className={`p-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg transform transition-all duration-500 border ${getRiskColor(prediction.risk_level)}`}>
                                        <span className="text-xs uppercase tracking-widest font-bold opacity-80 mb-2">Severity Level</span>
                                        <span className="text-4xl font-black tracking-tight">{prediction.risk_level}</span>
                                    </div>
                                    
                                    <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-3">
                                                <span className="text-slate-400">Classification</span>
                                                <span className="font-bold text-slate-200">{prediction.label}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-3">
                                                <span className="text-slate-400">ML Engine</span>
                                                <span className={`font-mono text-xs font-bold text-${themeColor}-400 px-2 py-1 bg-${themeColor}-500/10 rounded-md`}>XGBClassifier</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
