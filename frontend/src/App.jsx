import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CloudRain, Zap, Waves, Mountain, Flame, Menu, ShieldAlert } from 'lucide-react';
import Flood from './pages/Flood';
import Earthquake from './pages/Earthquake';
import Tsunami from './pages/Tsunami';
import Landslide from './pages/Landslide';
import ForestFire from './pages/ForestFire';

function Home() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-500/20 mb-8 border border-white/10 text-white">
                <ShieldAlert className="w-12 h-12" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-4">
                Global Threat Intelligence
            </h1>
            <p className="text-lg text-slate-400 font-medium leading-relaxed mb-12">
                Select a predictive engine from the sidebar to analyze real-time environmental hazards and structural vulnerabilities.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                {[
                    { n: 'Flood', c: 'indigo' },
                    { n: 'Earthquake', c: 'amber' },
                    { n: 'Tsunami', c: 'cyan' },
                    { n: 'Landslide', c: 'orange' },
                    { n: 'Forest Fire', c: 'rose' },
                ].map(x => (
                    <div key={x.n} className={`p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-${x.c}-400 font-bold tracking-wide text-sm`}>
                        {x.n} AI ACTIVE
                    </div>
                ))}
            </div>
        </div>
    );
}

function DashboardLayout() {
    const location = useLocation();
    const navItems = [
        { path: '/', label: 'Overview', icon: LayoutDashboard, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
        { path: '/flood', label: 'Flood Risk', icon: CloudRain, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { path: '/earthquake', label: 'Earthquake', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        { path: '/tsunami', label: 'Tsunami', icon: Waves, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
        { path: '/landslide', label: 'Landslides', icon: Mountain, color: 'text-orange-400', bg: 'bg-orange-500/10' },
        { path: '/forestfire', label: 'Forest Fire', icon: Flame, color: 'text-rose-400', bg: 'bg-rose-500/10' }
    ];

    return (
        <div className="min-h-screen bg-[#0f172a] font-sans selection:bg-indigo-500/30 text-slate-200 flex overflow-hidden">
            {/* Background ambient fx */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
            </div>

            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-800 bg-[#0f172a]/80 backdrop-blur-xl flex flex-col z-40 relative">
                <div className="h-20 flex items-center px-6 border-b border-slate-800">
                    <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                        <ShieldAlert className="w-6 h-6 text-indigo-500" />
                        DisasterTracker
                    </h1>
                </div>
                <nav className="flex-1 px-4 py-8 space-y-2">
                    {navItems.map(item => {
                        const active = location.pathname === item.path;
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200
                                ${active ? `bg-slate-800 text-white shadow-lg ${item.bg} border border-slate-700` : `text-slate-400 hover:bg-slate-800/50 hover:text-slate-200`}`}
                            >
                                <item.icon className={`w-5 h-5 ${active ? item.color : ''}`} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-6 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-xs font-bold text-slate-300">SYSTEM SECURE</span>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative h-screen overflow-y-auto w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/flood" element={<Flood />} />
                    <Route path="/earthquake" element={<Earthquake />} />
                    <Route path="/tsunami" element={<Tsunami />} />
                    <Route path="/landslide" element={<Landslide />} />
                    <Route path="/forestfire" element={<ForestFire />} />
                </Routes>
            </main>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <DashboardLayout />
        </BrowserRouter>
    );
}
