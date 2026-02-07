import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, AreaChart, Area
} from 'recharts';
import {
    Activity,
    Package,
    AlertCircle,
    Zap,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    RefreshCw,
    CheckCircle2
} from 'lucide-react';
import IndiaMap from '../components/IndiaMap';
import { motion, AnimatePresence } from 'framer-motion';

import { mockDashboard, mockRecommendations } from '../data/mockData';

const AIDashboard = () => {
    const [data, setData] = useState(mockDashboard);
    const [loading, setLoading] = useState(true);
    const [auditRunning, setAuditRunning] = useState(false);
    const [recommendations, setRecommendations] = useState(mockRecommendations);

    const fetchData = async () => {
        try {
            const [dashRes, recRes] = await Promise.all([
                axios.get('http://localhost:5000/api/analytics/dashboard'),
                axios.get('http://localhost:5000/api/ai/recommendations')
            ]);
            setData(dashRes.data);
            setRecommendations(recRes.data);
        } catch (err) {
            console.warn("Using fallback mock data as backend is unreachable.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const runAiAudit = () => {
        setAuditRunning(true);
        // Simulate a multi-node sweep
        const nodes = ['North', 'South', 'East', 'West', 'Central'];
        let nodeIdx = 0;

        const interval = setInterval(() => {
            if (nodeIdx < nodes.length) {
                console.log(`Audit analyzing node: ${nodes[nodeIdx]}`);
                nodeIdx++;
            } else {
                clearInterval(interval);
                fetchData();
                setAuditRunning(false);
                alert('Regional Audit Complete. 5 nodes verified. Optimization recommendations updated.');
            }
        }, 300);
    };

    const applyAllChanges = () => {
        if (recommendations.length === 0) return;
        setRecommendations([]);
        alert('AI Optimization changes applied successfully across the supply chain.');
    };

    if (loading) return (
        <div className="h-[60vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
    );

    const stats = [
        { label: 'Total Inventory', value: data.totalInventory, icon: Package, color: 'text-primary-600', bg: 'bg-primary-50', trend: '+12%', up: true },
        { label: 'Low Stock SKU', value: data.lowStockPaints, icon: AlertCircle, color: 'text-accent', bg: 'bg-amber-50', trend: '-2%', up: false },
        { label: 'Dead Stock SKU', value: data.deadStockCount, icon: Zap, color: 'text-red-500', bg: 'bg-red-50', trend: '+5%', up: true },
        { label: 'Avg Health Score', value: `${data.avgHealthScore}%`, icon: Activity, color: 'text-green-500', bg: 'bg-green-50', trend: '+8%', up: true },
    ];

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Platform Transactions', val: '₹14.2M', icon: Activity, color: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-950/30' },
                    { label: 'Active Inventory', val: '42.5k L', icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
                    { label: 'Low Stock Alerts', val: '12 Items', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-950/30' },
                    { label: 'AI Efficiency', val: '98.2%', icon: Zap, color: 'text-accent', bg: 'bg-yellow-50 dark:bg-yellow-950/30' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm"
                    >
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                            <stat.icon size={24} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 italic tracking-tighter">{stat.val}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Map Section */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/10">
                        <div>
                            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter italic">Supply Chain Intelligence</h3>
                            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Real-time node analysis</p>
                        </div>
                        <button
                            onClick={runAiAudit}
                            disabled={auditRunning}
                            className={`flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-black text-white hover:bg-black dark:hover:bg-slate-800 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg ${auditRunning ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                        >
                            <RefreshCw size={16} className={auditRunning ? 'animate-spin' : ''} />
                            {auditRunning ? 'Analyzing...' : 'Run AI Audit'}
                        </button>
                    </div>
                    <div className="p-8 grid md:grid-cols-2 gap-12">
                        <IndiaMap data={data.regionalDemand} />
                        <div className="space-y-8">
                            <div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Regional Demand Heatmap</h4>
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={data.regionalDemand}>
                                            <XAxis dataKey="region" hide />
                                            <Tooltip
                                                cursor={{ fill: 'transparent' }}
                                                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', background: '#0f172a', color: '#fff', padding: '12px' }}
                                                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                            />
                                            <Bar dataKey="predictedDemand" fill="#0ea5e9" radius={[10, 10, 0, 0]} />
                                            <Bar dataKey="currentDemand" fill="#f59e0b" radius={[10, 10, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="bg-slate-900 dark:bg-slate-950 rounded-[32px] p-6 text-white shadow-xl">
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Zap size={14} className="text-accent" /> Optimization Found
                                </p>
                                <div className="space-y-4">
                                    {recommendations.slice(0, 2).map((rec, i) => (
                                        <div key={i} className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl">
                                            <div className="w-2 h-2 rounded-full bg-accent animate-pulse shrink-0"></div>
                                            <p className="text-xs font-bold text-white/90 truncate">{rec.title}</p>
                                        </div>
                                    ))}
                                    {recommendations.length === 0 && (
                                        <p className="text-xs font-bold text-green-400">All nodes optimized.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Recommendations */}
                <div className="bg-white dark:bg-slate-900 rounded-[48px] p-10 text-slate-800 dark:text-white shadow-2xl overflow-hidden relative border border-slate-100 dark:border-white/5">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <Zap size={200} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black mb-10 tracking-tighter uppercase italic">AI Engine <span className="text-primary-400">v4.0</span></h3>
                        <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {recommendations.length > 0 ? (
                                recommendations.map((rec, i) => (
                                    <motion.div
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5 + i * 0.1 }}
                                        key={i}
                                        className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all cursor-pointer group"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${rec.priority === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/20' : rec.priority === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' : 'bg-green-500/20 text-green-400 border border-green-500/20'
                                                }`}>
                                                {rec.priority}
                                            </span>
                                            <ArrowUpRight size={18} className="text-white/20 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                                        </div>
                                        <h4 className="font-black text-white text-sm mb-2 uppercase tracking-tight">{rec.title}</h4>
                                        <p className="text-slate-400 text-[11px] font-medium leading-relaxed">{rec.description}</p>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="py-20 text-center">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                                        <CheckCircle2 size={32} className="text-green-500" />
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">System Fully Optimized</p>
                                </div>
                            )}
                        </div>
                        {recommendations.length > 0 && (
                            <button
                                onClick={applyAllChanges}
                                className="w-full mt-10 py-5 bg-primary-600 dark:bg-white text-white dark:text-slate-900 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] transition-all shadow-2xl active:scale-95 shadow-primary-500/20 dark:shadow-white/10"
                            >
                                Apply All Changes
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIDashboard;
