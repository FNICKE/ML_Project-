import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CloudRain, Zap, Waves, Mountain, Flame, ShieldAlert, Activity, ArrowRight, LogOut } from 'lucide-react';
import Flood from './pages/Flood';
import Earthquake from './pages/Earthquake';
import Tsunami from './pages/Tsunami';
import Landslide from './pages/Landslide';
import ForestFire from './pages/ForestFire';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

const DISASTERS = [
    { path: '/flood',      label: 'Flood Risk',      icon: CloudRain, color: 'indigo', rgb: '96,165,250'  },
    { path: '/earthquake', label: 'Earthquake',       icon: Zap,       color: 'amber',  rgb: '251,191,36'  },
    { path: '/tsunami',    label: 'Tsunami',          icon: Waves,     color: 'cyan',   rgb: '34,211,238'  },
    { path: '/landslide',  label: 'Landslides',       icon: Mountain,  color: 'orange', rgb: '251,146,60'  },
    { path: '/forestfire', label: 'Forest Fire',      icon: Flame,     color: 'rose',   rgb: '251,113,133' },
];

function AnimatedBackground() {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
            {/* Ambient orbs */}
            <div style={{
                position: 'absolute', top: '-15%', left: '-5%', width: '45%', height: '45%',
                background: 'rgba(99,102,241,0.08)', filter: 'blur(120px)', borderRadius: '50%',
                animation: 'orbFloat1 12s ease-in-out infinite alternate'
            }} />
            <div style={{
                position: 'absolute', bottom: '-10%', right: '-5%', width: '40%', height: '40%',
                background: 'rgba(6,182,212,0.07)', filter: 'blur(120px)', borderRadius: '50%',
                animation: 'orbFloat2 14s ease-in-out infinite alternate'
            }} />
            <div style={{
                position: 'absolute', top: '40%', right: '20%', width: '20%', height: '20%',
                background: 'rgba(249,115,22,0.05)', filter: 'blur(80px)', borderRadius: '50%',
                animation: 'orbFloat1 10s 2s ease-in-out infinite alternate'
            }} />
            {/* Grid pattern */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'linear-gradient(rgba(148,163,184,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.04) 1px, transparent 1px)',
                backgroundSize: '48px 48px'
            }} />
            <style>{`
                @keyframes orbFloat1 { from { transform: translate(0,0) scale(1); } to { transform: translate(30px,-30px) scale(1.1); } }
                @keyframes orbFloat2 { from { transform: translate(0,0) scale(1); } to { transform: translate(-25px,25px) scale(1.05); } }
            `}</style>
        </div>
    );
}

function Home() {
    const [visible, setVisible] = useState(false);
    useEffect(() => { setTimeout(() => setVisible(true), 50); }, []);

    return (
        <div
            className="flex flex-col items-center justify-center h-full text-center max-w-3xl mx-auto"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(16px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
        >
            {/* Hero Icon with pulsing ring */}
            <div className="relative mb-8">
                <div style={{
                    position: 'absolute', inset: '-12px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
                    animation: 'heroRing 3s ease-in-out infinite'
                }} />
                <div style={{
                    width: 96, height: 96,
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    borderRadius: 28,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 48px rgba(99,102,241,0.4)',
                    border: '1px solid rgba(129,140,248,0.3)',
                    animation: 'heroIcon 4s ease-in-out infinite'
                }}>
                    <ShieldAlert style={{ width: 48, height: 48, color: 'white' }} />
                </div>
            </div>

            <h1 className="text-5xl font-black text-white tracking-tight mb-4 leading-tight">
                Global Disaster
                <span style={{ background: 'linear-gradient(90deg, #818cf8, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> Intelligence</span>
            </h1>
            <p className="text-lg text-slate-400 font-medium leading-relaxed mb-12 max-w-xl">
                AI-powered multi-hazard prediction platform. Select an engine below to analyze real-time environmental threats and assess disaster risk with precision.
            </p>

            {/* Disaster cards grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                {DISASTERS.map((d, i) => {
                    const Icon = d.icon;
                    return (
                        <Link
                            key={d.path}
                            to={d.path}
                            className="group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 hover:-translate-y-1"
                            style={{
                                background: `linear-gradient(135deg, rgba(${d.rgb},0.06), rgba(${d.rgb},0.02))`,
                                borderColor: `rgba(${d.rgb},0.2)`,
                                boxShadow: `0 4px 20px rgba(0,0,0,0.2)`,
                                animation: `fadeInUp 0.5s ${i * 0.08}s ease both`
                            }}
                        >
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                                style={{ background: `linear-gradient(135deg, rgba(${d.rgb},0.12), rgba(${d.rgb},0.04))` }}
                            />
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 relative"
                                style={{ background: `rgba(${d.rgb},0.12)`, border: `1px solid rgba(${d.rgb},0.25)` }}
                            >
                                <Icon className="w-5 h-5" style={{ color: `rgb(${d.rgb})` }} />
                            </div>
                            <div className="flex items-center justify-between relative">
                                <span className="text-sm font-bold text-white">{d.label}</span>
                                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-1 transition-all duration-200" />
                            </div>
                            <span className="text-xs text-slate-500 relative">AI Active</span>
                        </Link>
                    );
                })}
            </div>

            <style>{`
                @keyframes fadeInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
                @keyframes heroRing { 0%,100% { transform: scale(1); opacity:0.7; } 50% { transform: scale(1.15); opacity:1; } }
                @keyframes heroIcon { 0%,100% { box-shadow: 0 0 48px rgba(99,102,241,0.4); } 50% { box-shadow: 0 0 70px rgba(99,102,241,0.6); } }
            `}</style>
        </div>
    );
}

function DashboardLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const navItems = [
        { path: '/dashboard', label: 'Overview', icon: LayoutDashboard, rgb: '99,102,241' },
        ...DISASTERS
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    };

    return (
        <div className="min-h-screen font-sans text-slate-200 flex overflow-hidden" style={{ background: '#080f1e' }}>
            <AnimatedBackground />

            {/* Sidebar */}
            <aside
                className="w-64 flex flex-col relative"
                style={{
                    zIndex: 40,
                    background: 'linear-gradient(180deg, rgba(10,17,35,0.97) 0%, rgba(7,12,27,0.97) 100%)',
                    borderRight: '1px solid rgba(148,163,184,0.08)',
                    backdropFilter: 'blur(24px)',
                }}
            >
                {/* Logo */}
                <div className="h-20 flex items-center px-6" style={{ borderBottom: '1px solid rgba(148,163,184,0.06)' }}>
                    <div className="flex items-center gap-3">
                        <div style={{
                            width: 36, height: 36,
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            borderRadius: 10,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 20px rgba(99,102,241,0.35)'
                        }}>
                            <ShieldAlert style={{ width: 18, height: 18, color: 'white' }} />
                        </div>
                        <div>
                            <div className="text-base font-black text-white tracking-tight">DisasterAI</div>
                            <div className="text-xs text-slate-500 tracking-wide">Prediction Suite</div>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-3 py-6 space-y-1">
                    <div className="px-3 pb-3">
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Navigation</span>
                    </div>
                    {navItems.map(item => {
                        const active = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 group"
                                style={active ? {
                                    background: `linear-gradient(135deg, rgba(${item.rgb},0.18), rgba(${item.rgb},0.08))`,
                                    color: 'white',
                                    border: `1px solid rgba(${item.rgb},0.25)`,
                                    boxShadow: `0 0 16px rgba(${item.rgb},0.1)`
                                } : {
                                    color: '#64748b',
                                    border: '1px solid transparent',
                                }}
                            >
                                <div
                                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                                    style={active ? {
                                        background: `rgba(${item.rgb},0.2)`,
                                    } : {
                                        background: 'rgba(148,163,184,0.06)',
                                    }}
                                >
                                    <item.icon className="w-4 h-4" style={{ color: active ? `rgb(${item.rgb})` : undefined }} />
                                </div>
                                {item.label}
                                {active && (
                                    <div
                                        className="ml-auto w-1.5 h-1.5 rounded-full"
                                        style={{ background: `rgb(${item.rgb})`, boxShadow: `0 0 6px rgb(${item.rgb})` }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4" style={{ borderTop: '1px solid rgba(148,163,184,0.06)' }}>
                    <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-3" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                        <Activity className="w-3.5 h-3.5 text-emerald-500" />
                        <div>
                            <div className="text-xs font-bold text-emerald-400">All Systems Active</div>
                            <div className="text-xs text-slate-600">5 engines running</div>
                        </div>
                        <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 6px #10b981', animation: 'pulse 2s infinite' }} />
                    </div>

                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
                        style={{ border: '1px solid rgba(148,163,184,0.1)' }}
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main
                className="flex-1 h-screen overflow-y-auto relative"
                style={{ zIndex: 1 }}
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
                    <Routes>
                        <Route path="/dashboard" element={<Home />} />
                        <Route path="/flood"     element={<Flood />} />
                        <Route path="/earthquake" element={<Earthquake />} />
                        <Route path="/tsunami"   element={<Tsunami />} />
                        <Route path="/landslide" element={<Landslide />} />
                        <Route path="/forestfire" element={<ForestFire />} />
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </div>
                <style>{`
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50%       { opacity: 0.4; }
                    }
                `}</style>
            </main>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/*" element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}
