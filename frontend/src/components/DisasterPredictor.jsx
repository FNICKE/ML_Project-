import React, { useState, useEffect, useCallback } from 'react';
import { checkHealth, predictDisaster } from '../api';
import {
    Activity,
    AlertTriangle,
    CheckCircle2,
    Info,
    Loader2,
    ShieldAlert,
    TrendingUp,
    WifiOff,
    RefreshCw,
    ServerCrash
} from 'lucide-react';

// Helper: map Tailwind color name to actual CSS rgba for glows  
const COLOR_MAP = {
    amber:  { primary: '251,191,36',  glow: '245,158,11' },
    blue:   { primary: '96,165,250',  glow: '59,130,246' },
    cyan:   { primary: '34,211,238',  glow: '6,182,212'  },
    rose:   { primary: '251,113,133', glow: '244,63,94'  },
    orange: { primary: '251,146,60',  glow: '249,115,22' },
    indigo: { primary: '129,140,248', glow: '99,102,241' },
    green:  { primary: '74,222,128',  glow: '34,197,94'  },
    purple: { primary: '192,132,252', glow: '168,85,247' },
};

function CircleProgress({ probability, riskLevel, themeColor }) {
    const pct = Math.round(probability * 100);
    const r = 88;
    const circ = 2 * Math.PI * r;
    const offset = circ * (1 - probability);
    const c = COLOR_MAP[themeColor] || COLOR_MAP.blue;

    const strokeColor = {
        'Low':       '#10b981',
        'Moderate':  '#f59e0b',
        'High':      '#f97316',
        'Very High': '#ef4444',
    }[riskLevel] || `rgb(${c.primary})`;

    return (
        <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
            <svg width="200" height="200" style={{ transform: 'rotate(-90deg)', filter: `drop-shadow(0 0 12px ${strokeColor}55)` }}>
                <circle cx="100" cy="100" r={r} fill="none" stroke="#1e293b" strokeWidth="14" />
                <circle
                    cx="100" cy="100" r={r}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    strokeDashoffset={offset}
                    style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-white tracking-tighter">{pct}<span className="text-xl text-slate-400">%</span></span>
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold mt-1">Probability</span>
            </div>
        </div>
    );
}

// Particle data generated once at module load (not during render) to avoid impure-function lint
const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: 2 + (i * 0.35) % 4,
    x: (i * 8.3) % 100,
    y: (i * 13.7) % 100,
    duration: 6 + (i * 0.67) % 8,
    delay: (i * 0.41) % 4,
}));

function ParticleBackground({ themeColor }) {
    const c = COLOR_MAP[themeColor] || COLOR_MAP.blue;
    const particles = PARTICLES;
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
            {particles.map(p => (
                <div
                    key={p.id}
                    className="absolute rounded-full opacity-30"
                    style={{
                        width: p.size,
                        height: p.size,
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        background: `rgb(${c.primary})`,
                        boxShadow: `0 0 ${p.size * 3}px rgb(${c.glow})`,
                        animation: `floatParticle ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
                    }}
                />
            ))}
        </div>
    );
}

export default function DisasterPredictor({
    title,
    description,
    disasterType,
    themeColor,
    icon: MainIcon,
    featuresMeta
}) {
    const initialFeatures = Object.keys(featuresMeta).reduce((acc, key) => {
        acc[key] = featuresMeta[key].default;
        return acc;
    }, {});

    const [features, setFeatures]     = useState(initialFeatures);
    const [status, setStatus]         = useState({ state: 'checking', msg: 'Connecting...' });
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading]       = useState(false);
    const [error, setError]           = useState(null);
    const [mounted, setMounted]       = useState(false);
    const [retrying, setRetrying]     = useState(false);

    const c = COLOR_MAP[themeColor] || COLOR_MAP.blue;

    const runHealthCheck = useCallback(async (isManual = false) => {
        if (isManual) setRetrying(true);
        const health = await checkHealth();
        if (health.status === 'ok') {
            if (health.models && health.models[disasterType]) {
                setStatus({ state: 'online', msg: 'Engine Online' });
                setError(null);
            } else {
                setStatus({ state: 'error', msg: `${disasterType} model not loaded` });
            }
        } else {
            setStatus({ state: 'offline', msg: 'Backend Offline' });
        }
        if (isManual) setRetrying(false);
    }, [disasterType]);

    useEffect(() => {
        setMounted(true);
        runHealthCheck();
        // Re-check every 10 seconds automatically
        const interval = setInterval(() => runHealthCheck(), 10000);
        return () => clearInterval(interval);
    }, [runHealthCheck]);

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

    const riskStyle = {
        'Low':       { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', glow: '#10b981' },
        'Moderate':  { text: 'text-yellow-400',  bg: 'bg-yellow-500/10',  border: 'border-yellow-500/40',  glow: '#f59e0b' },
        'High':      { text: 'text-orange-400',  bg: 'bg-orange-500/10',  border: 'border-orange-500/40',  glow: '#f97316' },
        'Very High': { text: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/40',     glow: '#ef4444' },
    }[prediction?.risk_level] || { text: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/40', glow: '#64748b' };

    const themeRgb = c.primary;

    return (
        <div
            className="flex-1 flex flex-col relative"
            style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div style={{ animation: 'slideInLeft 0.5s ease both' }}>
                    <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{
                                background: `linear-gradient(135deg, rgba(${themeRgb},0.8), rgba(${c.glow},0.6))`,
                                boxShadow: `0 0 24px rgba(${themeRgb},0.35)`,
                                border: `1px solid rgba(${themeRgb},0.3)`,
                                animation: 'iconPulse 3s ease-in-out infinite'
                            }}
                        >
                            <MainIcon className="w-6 h-6 text-white" />
                        </div>
                        {title}
                    </h1>
                    <p className="text-sm text-slate-400 font-medium mt-2">{description}</p>
                </div>

                <div style={{ animation: 'slideInRight 0.5s ease both' }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/60 border border-slate-700/60 backdrop-blur-md">
                    {status.state === 'online'  && <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 8px #10b981', animation: 'pulse 2s infinite' }} />}
                    {status.state === 'checking' && <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />}
                    {(status.state === 'offline' || status.state === 'error') && <div className="w-2.5 h-2.5 rounded-full bg-red-500" style={{ boxShadow: '0 0 8px #ef4444', animation: 'pulse 1s infinite' }} />}
                    <span className="text-sm font-semibold text-slate-300">{status.msg}</span>
                    {(status.state === 'offline' || status.state === 'error') && (
                        <button
                            onClick={() => runHealthCheck(true)}
                            disabled={retrying}
                            title="Retry connection"
                            className="ml-1 p-1 rounded-full hover:bg-slate-700/60 transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 text-red-400 ${retrying ? 'animate-spin' : ''}`} />
                        </button>
                    )}
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">

                {/* LEFT: Input Form */}
                <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6 relative" style={{ animation: 'fadeInUp 0.6s 0.1s ease both' }}>
                    {/* Offline overlay on form */}
                    {(status.state === 'offline') && (
                        <div className="absolute inset-0 z-20 rounded-3xl backdrop-blur-sm flex items-center justify-center"
                            style={{ background: 'rgba(10,15,30,0.6)', border: '1px solid rgba(239,68,68,0.2)' }}>
                            <div className="text-center">
                                <WifiOff className="w-8 h-8 text-red-400 mx-auto mb-2" />
                                <p className="text-red-400 font-bold text-sm">Backend Offline</p>
                                <p className="text-slate-500 text-xs mt-1">Form disabled until connected</p>
                            </div>
                        </div>
                    )}
                    <div
                        className="backdrop-blur-xl rounded-3xl border overflow-hidden relative"
                        style={{
                            background: 'linear-gradient(145deg, rgba(30,41,59,0.7), rgba(15,23,42,0.8))',
                            borderColor: `rgba(${themeRgb},0.2)`,
                            boxShadow: `0 0 40px rgba(${themeRgb},0.08), 0 25px 50px rgba(0,0,0,0.4)`
                        }}
                    >
                        <ParticleBackground themeColor={themeColor} />

                        {/* Card header stripe */}
                        <div
                            className="h-1 w-full"
                            style={{ background: `linear-gradient(90deg, transparent, rgba(${themeRgb},0.8), transparent)` }}
                        />

                        <div className="p-7 border-b border-slate-700/40 relative z-10">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Activity className="w-5 h-5" style={{ color: `rgb(${themeRgb})` }} />
                                Environmental Parameters
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">Adjust sliders to match real-world conditions</p>
                        </div>

                        <div className="p-7 relative z-10">
                            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
                                {Object.entries(featuresMeta).map(([key, meta], idx) => {
                                    const Icon = meta.icon;
                                    const pct = ((features[key] - meta.min) / (meta.max - meta.min)) * 100;
                                    return (
                                        <div key={key} className="group" style={{ animation: `fadeInUp 0.4s ${0.05 * idx}s ease both` }}>
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="p-1.5 rounded-lg border transition-all duration-300"
                                                        style={{
                                                            background: `rgba(${themeRgb},0.1)`,
                                                            borderColor: `rgba(${themeRgb},0.2)`,
                                                        }}
                                                    >
                                                        <Icon className="w-3.5 h-3.5" style={{ color: `rgb(${themeRgb})` }} />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-semibold text-slate-200 block">{meta.label}</label>
                                                        <span className="text-xs text-slate-500">{meta.desc}</span>
                                                    </div>
                                                </div>
                                                <span
                                                    className="text-sm font-black tabular-nums px-2 py-0.5 rounded-md"
                                                    style={{
                                                        color: `rgb(${themeRgb})`,
                                                        background: `rgba(${themeRgb},0.1)`,
                                                    }}
                                                >
                                                    {features[key]}
                                                </span>
                                            </div>

                                            <div className="relative mt-1">
                                                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-200"
                                                        style={{
                                                            width: `${Math.max(0, Math.min(100, pct))}%`,
                                                            background: `linear-gradient(90deg, rgba(${themeRgb},0.6), rgba(${themeRgb},1))`,
                                                            boxShadow: `0 0 8px rgba(${themeRgb},0.5)`
                                                        }}
                                                    />
                                                </div>
                                                <input
                                                    type="range"
                                                    min={meta.min}
                                                    max={meta.max}
                                                    step={meta.step || 1}
                                                    value={features[key]}
                                                    onChange={e => handleSliderChange(key, e.target.value)}
                                                    className="absolute inset-0 w-full opacity-0 cursor-pointer z-10 h-full"
                                                    style={{ WebkitAppearance: 'none' }}
                                                />
                                                {/* Custom thumb overlay */}
                                                <div
                                                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 bg-white shadow-lg pointer-events-none transition-all duration-200"
                                                    style={{
                                                        left: `calc(${Math.max(0, Math.min(100, pct))}% - 8px)`,
                                                        borderColor: `rgb(${themeRgb})`,
                                                        boxShadow: `0 0 10px rgba(${themeRgb},0.6)`
                                                    }}
                                                />
                                            </div>
                                            <div className="flex justify-between mt-2">
                                                <span className="text-xs text-slate-600">{meta.min}</span>
                                                <span className="text-xs text-slate-600">{meta.max}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Predict Button */}
                        <div className="p-7 border-t border-slate-700/40 bg-slate-900/30 relative z-10">
                            <button
                                onClick={handlePredict}
                                disabled={loading || status.state !== 'online'}
                                className="w-full relative overflow-hidden flex items-center justify-center px-8 py-4 rounded-2xl text-white font-bold text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                                style={{
                                    background: `linear-gradient(135deg, rgba(${themeRgb},0.7), rgba(${c.glow},0.8))`,
                                    border: `1px solid rgba(${themeRgb},0.4)`,
                                    boxShadow: loading ? 'none' : `0 0 30px rgba(${themeRgb},0.3)`,
                                }}
                            >
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{ background: `linear-gradient(135deg, rgba(${themeRgb},0.9), rgba(${c.glow},1))` }}
                                />
                                <div className="relative flex items-center gap-3">
                                    {loading ? (
                                        <><Loader2 className="w-5 h-5 animate-spin" /><span>ANALYZING DATA...</span></>
                                    ) : (
                                        <><ShieldAlert className="w-5 h-5" /><span>RUN AI PREDICTION</span></>
                                    )}
                                </div>
                            </button>

                            {error && (
                                <div className="mt-4 flex items-start gap-3 text-sm text-red-400 bg-red-500/10 p-4 rounded-xl border border-red-500/20" style={{ animation: 'fadeInUp 0.3s ease both' }}>
                                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <span>{error}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT: Results Panel */}
                <div className="lg:col-span-5 xl:col-span-4 sticky top-10" style={{ animation: 'fadeInUp 0.6s 0.2s ease both' }}>
                    <div
                        className="rounded-3xl border overflow-hidden relative"
                        style={{
                            background: 'linear-gradient(145deg, rgba(20,30,50,0.9), rgba(10,15,30,0.95))',
                            borderColor: prediction ? riskStyle.border.replace('border-', '').replace('/40', '') : `rgba(${themeRgb},0.15)`,
                            boxShadow: prediction
                                ? `0 0 40px ${riskStyle.glow}22, 0 25px 50px rgba(0,0,0,0.4)`
                                : `0 0 30px rgba(${themeRgb},0.06), 0 25px 50px rgba(0,0,0,0.3)`,
                        }}
                    >
                        {/* Top glow bar */}
                        <div
                            className="h-1 w-full transition-all duration-700"
                            style={{
                                background: prediction
                                    ? `linear-gradient(90deg, transparent, ${riskStyle.glow}, transparent)`
                                    : `linear-gradient(90deg, transparent, rgba(${themeRgb},0.6), transparent)`
                            }}
                        />

                        <div className="p-7 relative">
                            <h2 className="text-xs font-black tracking-widest uppercase text-slate-400 mb-6 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" /> Analysis Output
                            </h2>

                            {/* Backend Offline State */}
                            {status.state === 'offline' && !loading && (
                                <div className="flex flex-col items-center justify-center py-10 text-center" style={{ animation: 'fadeInUp 0.4s ease both' }}>
                                    <div
                                        className="w-24 h-24 rounded-2xl flex items-center justify-center mb-5 border"
                                        style={{
                                            background: 'rgba(239,68,68,0.08)',
                                            borderColor: 'rgba(239,68,68,0.25)',
                                            boxShadow: '0 0 30px rgba(239,68,68,0.12)',
                                            animation: 'softPulse 2s ease-in-out infinite'
                                        }}
                                    >
                                        <ServerCrash className="w-12 h-12 text-red-400" />
                                    </div>
                                    <p className="text-red-400 font-black text-lg tracking-tight">Backend Offline</p>
                                    <p className="text-slate-500 text-xs mt-2 max-w-[180px] leading-relaxed">
                                        Start the server to enable predictions
                                    </p>
                                    <div className="mt-4 bg-slate-900/70 border border-slate-700/50 rounded-xl p-3 text-left">
                                        <p className="text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wider">How to start:</p>
                                        <code className="text-xs text-emerald-400 font-mono">python backend/app.py</code>
                                    </div>
                                    <button
                                        onClick={() => runHealthCheck(true)}
                                        disabled={retrying}
                                        className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-50"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(239,68,68,0.5), rgba(220,38,38,0.7))',
                                            border: '1px solid rgba(239,68,68,0.4)',
                                            boxShadow: '0 0 20px rgba(239,68,68,0.2)'
                                        }}
                                    >
                                        <RefreshCw className={`w-4 h-4 ${retrying ? 'animate-spin' : ''}`} />
                                        {retrying ? 'Checking...' : 'Retry Connection'}
                                    </button>
                                    <p className="text-slate-700 text-xs mt-3">Auto-retrying every 10 seconds</p>
                                </div>
                            )}

                            {/* Backend checking / idle state */}
                            {status.state === 'checking' && !loading && (
                                <div className="flex flex-col items-center justify-center py-14 text-center" style={{ animation: 'fadeInUp 0.4s ease both' }}>
                                    <Loader2 className="w-10 h-10 text-slate-500 animate-spin mb-4" />
                                    <p className="text-slate-400 font-semibold">Connecting to Backend...</p>
                                </div>
                            )}

                            {!prediction && !loading && status.state === 'online' && (
                                <div className="flex flex-col items-center justify-center py-14 text-center" style={{ animation: 'fadeInUp 0.4s ease both' }}>
                                    <div
                                        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 border"
                                        style={{
                                            background: `rgba(${themeRgb},0.06)`,
                                            borderColor: `rgba(${themeRgb},0.15)`,
                                        }}
                                    >
                                        <Info className="w-10 h-10 text-slate-500" />
                                    </div>
                                    <p className="text-slate-300 font-semibold">Awaiting Parameters</p>
                                    <p className="text-slate-600 text-xs mt-2">Set values and run prediction</p>
                                </div>
                            )}

                            {loading && (
                                <div className="flex flex-col items-center justify-center py-14 text-center" style={{ animation: 'fadeInUp 0.3s ease both' }}>
                                    <div
                                        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 border"
                                        style={{
                                            background: `rgba(${themeRgb},0.08)`,
                                            borderColor: `rgba(${themeRgb},0.2)`,
                                            animation: 'softPulse 1.5s ease-in-out infinite'
                                        }}
                                    >
                                        <Loader2 className="w-10 h-10 animate-spin" style={{ color: `rgb(${themeRgb})` }} />
                                    </div>
                                    <p className="font-bold tracking-widest text-sm uppercase" style={{ color: `rgb(${themeRgb})`, animation: 'pulse 1.5s infinite' }}>
                                        Computing Risk...
                                    </p>
                                </div>
                            )}

                            {prediction && !loading && (
                                <div className="space-y-6" style={{ animation: 'fadeInUp 0.5s ease both' }}>
                                    {/* Circular gauge */}
                                    <div className="flex justify-center">
                                        <CircleProgress
                                            probability={prediction.probability}
                                            riskLevel={prediction.risk_level}
                                            themeColor={themeColor}
                                        />
                                    </div>

                                    {/* Risk badge */}
                                    <div
                                        className={`p-5 rounded-2xl flex flex-col items-center text-center border transition-all duration-500 ${riskStyle.bg} ${riskStyle.border}`}
                                        style={{ boxShadow: `0 0 20px ${riskStyle.glow}22` }}
                                    >
                                        <span className="text-xs uppercase tracking-widest font-bold opacity-70 mb-1">Severity Level</span>
                                        <span className={`text-4xl font-black tracking-tight ${riskStyle.text}`}>
                                            {prediction.risk_level}
                                        </span>
                                    </div>

                                    {/* Details card */}
                                    <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-700/40 space-y-3">
                                        <div className="flex justify-between items-center text-sm pb-3 border-b border-slate-800">
                                            <span className="text-slate-400">Classification</span>
                                            <span className="font-bold text-slate-200">{prediction.label}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm pb-3 border-b border-slate-800">
                                            <span className="text-slate-400">Confidence</span>
                                            <span className="font-bold text-slate-200">{(prediction.probability * 100).toFixed(1)}%</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-400">ML Engine</span>
                                            <span
                                                className="font-mono text-xs font-bold px-2 py-1 rounded-md"
                                                style={{ color: `rgb(${themeRgb})`, background: `rgba(${themeRgb},0.1)` }}
                                            >
                                                RandomForest
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Inline keyframe styles */}
            <style>{`
                @keyframes floatParticle {
                    0%   { transform: translateY(0px) translateX(0px); opacity: 0.2; }
                    100% { transform: translateY(-20px) translateX(10px); opacity: 0.5; }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-20px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(20px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes iconPulse {
                    0%, 100% { box-shadow: 0 0 24px rgba(${themeRgb},0.35); }
                    50%       { box-shadow: 0 0 40px rgba(${themeRgb},0.6); }
                }
                @keyframes softPulse {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0.6; }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
}
