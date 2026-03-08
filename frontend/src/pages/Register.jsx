import React, { useState } from 'react';
import { ShieldAlert, ArrowRight, Lock, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('http://127.0.0.1:5000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (res.ok) {
                // Auto login or redirect to login
                navigate('/login');
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            setError('Network error. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: '#080f1e' }}>
            <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'rgba(99,102,241,0.07)', filter: 'blur(100px)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'rgba(56,189,248,0.07)', filter: 'blur(100px)', borderRadius: '50%' }} />
            
            <div className="w-full max-w-md relative z-10">
                <div 
                    className="p-8 sm:p-10 rounded-3xl"
                    style={{ 
                        background: 'linear-gradient(180deg, rgba(10,17,35,0.8) 0%, rgba(7,12,27,0.8) 100%)',
                        border: '1px solid rgba(148,163,184,0.1)',
                        backdropFilter: 'blur(24px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                    }}
                >
                    <div className="flex flex-col items-center mb-8">
                        <div className="mb-4" style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(16,185,129,0.4)' }}>
                            <ShieldAlert style={{ width: 24, height: 24, color: 'white' }} />
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight">Create Account</h2>
                        <p className="text-sm text-slate-400 mt-2">Join DisasterAI prediction suite</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-3 rounded-lg text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 text-center font-medium">
                                {error}
                            </div>
                        )}
                        <div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium"
                                    placeholder="Choose Username"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium"
                                    placeholder="Choose Password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 py-3.5 px-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
                            style={{ 
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? 'Creating...' : 'Register'}
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm font-medium text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
