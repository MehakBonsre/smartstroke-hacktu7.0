import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Paintbrush, ShieldCheck, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState(null);

    useEffect(() => {
        if (user) {
            navigate(user.role === 'Dealer' ? '/dealer-dashboard' : user.role === 'Buyer' ? '/portal' : '/');
        }
    }, [user, navigate]);

    const handleLogin = () => {
        login(selectedRole);
    };

    const roles = [
        { id: 'Admin', icon: ShieldCheck, desc: 'Full System Access & AI Insights', color: 'bg-primary-500' },
        { id: 'Dealer', icon: Paintbrush, desc: 'Inventory Management & Local Demand', color: 'bg-accent' },
        { id: 'Buyer', icon: Truck, desc: 'Stock Availability & Direct Ordering', color: 'bg-green-500' },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 p-6 transition-colors">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl w-full grid md:grid-cols-2 bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
            >
                <div className="bg-slate-900 p-12 text-white flex flex-col justify-between">
                    <div>
                        <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center font-bold text-2xl mb-8 shadow-lg shadow-primary-500/20">
                            S
                        </div>
                        <h1 className="text-4xl font-bold mb-4">SMARTSTROKE</h1>
                        <p className="text-slate-400 text-lg">
                            The intelligent supply chain companion for the modern paint industry.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex gap-4 items-center">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-primary-400">
                                <ShieldCheck size={20} />
                            </div>
                            <span className="text-slate-300 text-sm">AI-Driven Demand Forecasting</span>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-accent">
                                <Paintbrush size={20} />
                            </div>
                            <span className="text-slate-300 text-sm">Real-time Inventory Sync</span>
                        </div>
                    </div>
                </div>

                <div className="p-12">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Welcome Back</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Please select your portal role to continue</p>

                    <div className="space-y-4 mb-8">
                        {roles.map((role) => (
                            <button
                                key={role.id}
                                onClick={() => setSelectedRole(role.id)}
                                className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-4 ${selectedRole === role.id
                                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-4 ring-primary-500/10'
                                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/50'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-lg ${role.color} bg-opacity-10 flex items-center justify-center ${selectedRole === role.id ? 'text-primary-600' : 'text-slate-600'}`}>
                                    <role.icon size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 dark:text-slate-100">{role.id}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{role.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    <button
                        disabled={!selectedRole}
                        onClick={handleLogin}
                        className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${selectedRole
                            ? 'bg-primary-600 hover:bg-primary-700 shadow-primary-500/30'
                            : 'bg-slate-300 cursor-not-allowed'
                            }`}
                    >
                        Enter Platform
                    </button>

                    <p className="mt-8 text-center text-xs text-slate-400 font-medium">
                        Secure Sandbox Access • v1.0.0-HACKATHON
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
