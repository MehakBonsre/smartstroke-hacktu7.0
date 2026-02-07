import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TrendingUp, Target, Zap, Globe, Briefcase } from 'lucide-react';
import {
    ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
    ComposedChart, Line, Area, Bar
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { mockDashboard } from '../data/mockData';

const DemandIntelligence = () => {
    const [demandData, setDemandData] = useState(mockDashboard.regionalDemand);
    const [loading, setLoading] = useState(true);
    const [isModelModalOpen, setIsModelModalOpen] = useState(false);

    useEffect(() => {
        const fetchDemand = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/analytics/demand');
                setDemandData(res.data);
            } catch (err) {
                console.warn("Using fallback mock demand data.");
            } finally {
                setLoading(false);
            }
        };
        fetchDemand();
    }, []);

    if (loading) return <div className="p-8">Synthesizing demand patterns...</div>;

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Demand Prediction Chart */}
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter">Regional Forecast</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">Next 30 days demand prediction vs current</p>
                        </div>
                        <div className="bg-primary-50 text-primary-600 p-3 rounded-2xl">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={demandData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="region" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px', backgroundColor: 'var(--tw-backgroundColor-white)', color: 'black' }} />
                                <Bar dataKey="currentDemand" fill="#e2e8f0" radius={[10, 10, 0, 0]} barSize={40} />
                                <Area type="monotone" dataKey="predictedDemand" fill="#38bdf8" stroke="#0ea5e9" strokeWidth={3} fillOpacity={0.2} />
                                <Line type="monotone" dataKey="predictedDemand" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 6, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Accuracy & Signals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl text-slate-800 dark:text-white flex flex-col justify-between shadow-xl dark:shadow-2xl relative overflow-hidden border border-slate-100 dark:border-slate-800">
                        <div className="absolute -right-4 -top-4 opacity-10 text-primary-500">
                            <Target size={120} />
                        </div>
                        <div>
                            <p className="text-slate-400 dark:text-slate-500 text-xs font-black uppercase tracking-widest mb-2">Prediction Confidence</p>
                            <h4 className="text-4xl font-black text-primary-600 dark:text-white">92.4%</h4>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mt-4 font-medium">
                            Based on historical order consistency and shade-view trends across 5 regions.
                        </p>
                        <button
                            onClick={() => setIsModelModalOpen(true)}
                            className="mt-8 py-3 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 border border-slate-200 dark:border-white/10 rounded-xl font-bold text-sm transition-all text-slate-600 dark:text-slate-100"
                        >
                            View Model Details
                        </button>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between transition-colors">
                        <div>
                            <p className="text-slate-400 dark:text-slate-500 text-xs font-black uppercase tracking-widest mb-2">Lost Sales Units</p>
                            <h4 className="text-4xl font-black text-red-500">840</h4>
                        </div>
                        <div className="mt-4 space-y-3">
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-slate-500 dark:text-slate-400">North</span>
                                <span className="text-slate-800 dark:text-slate-100">320 Units</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-red-500 h-full w-[60%]"></div>
                            </div>
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-slate-500 dark:text-slate-400">West</span>
                                <span className="text-slate-800 dark:text-slate-100">210 Units</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-red-400 h-full w-[40%]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
                {[
                    { title: 'Search Volume', value: '45.2K', icon: Globe, color: 'bg-primary-600', sub: 'Up 12% vs last month' },
                    { title: 'New Stock Checks', value: '8.1K', icon: Zap, color: 'bg-accent', sub: 'Critical in West Region' },
                    { title: 'Corporate Queries', value: '150', icon: Briefcase, color: 'bg-green-600', sub: 'Institutional demand rising' },
                ].map((card, i) => (
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        key={i}
                        className={`${card.color} p-8 rounded-3xl shadow-lg relative overflow-hidden group`}
                    >
                        <card.icon size={60} className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 group-hover:rotate-12 transition-transform" />
                        <p className="text-white/70 text-xs font-black uppercase tracking-widest mb-1">{card.title}</p>
                        <h4 className="text-3xl font-black mb-4 tracking-tighter">{card.value}</h4>
                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                            <TrendingUp size={12} /> {card.sub}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Model Details Modal */}
            <AnimatePresence>
                {isModelModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[40px] max-w-2xl w-full p-10 shadow-3xl border border-white/20 overflow-hidden dark:bg-slate-900 dark:border-slate-700"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic dark:text-slate-100">Neural-Stock X17 Diagnostics</h3>
                                    <p className="text-slate-500 text-sm font-medium mt-1 dark:text-slate-400">Deep learning demand analysis architecture</p>
                                </div>
                                <button
                                    onClick={() => setIsModelModalOpen(false)}
                                    className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-2xl transition-all dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-400"
                                >
                                    <Target size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Architecture</p>
                                    <p className="text-sm font-black text-slate-800 tracking-tight dark:text-slate-100">Transformer-based RNN</p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Retrained</p>
                                    <p className="text-sm font-black text-slate-800 tracking-tight dark:text-slate-100">6 Hours Ago</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10">
                                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl dark:bg-slate-800">
                                    <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Training Precision</span>
                                    <span className="text-sm font-black text-emerald-500">0.9984</span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl dark:bg-slate-800">
                                    <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Inference Latency</span>
                                    <span className="text-sm font-black text-primary-600">42ms</span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl dark:bg-slate-800">
                                    <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active Data Nodes</span>
                                    <span className="text-sm font-black text-slate-800 dark:text-slate-100">1,245 Regional Points</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsModelModalOpen(false)}
                                className="w-full py-5 bg-slate-900 text-white rounded-[20px] font-black text-xs uppercase tracking-[0.2em] hover:bg-primary-600 transition-all shadow-xl shadow-black/20"
                            >
                                Close Diagnostics
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DemandIntelligence;
