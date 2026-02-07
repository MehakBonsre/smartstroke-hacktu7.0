import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    Activity, ArrowUpRight, ArrowDownRight, Package, ShoppingCart,
    BarChart3, ShieldCheck, MapPin, Search, Users, Globe
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const DealerDashboard = () => {
    const { user } = useAuth();
    const [dealer, setDealer] = useState({
        name: "Aryan Paints & Hardware",
        region: "North",
        inventory: 2450,
        healthScore: 88,
        location: "Chandni Chowk, Delhi"
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDealer = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/dealers');
                if (res.data && res.data.length > 0) {
                    setDealer(res.data[0]);
                }
            } catch (err) {
                console.warn("Using fallback mock dealer data.");
            } finally {
                setLoading(false);
            }
        };
        fetchDealer();
    }, []);

    if (loading) return (
        <div className="p-8 text-slate-500 dark:text-slate-400 font-bold animate-pulse">
            Loading your metrics...
        </div>
    );

    const chartData = [
        { name: 'Mon', sales: 400 },
        { name: 'Tue', sales: 300 },
        { name: 'Wed', sales: 600 },
        { name: 'Thu', sales: 800 },
        { name: 'Fri', sales: 500 },
        { name: 'Sat', sales: 900 },
        { name: 'Sun', sales: 700 },
    ];

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between gap-8 items-center transition-colors">
                <div className="flex gap-6 items-center">
                    <div className="w-20 h-20 bg-primary-100 dark:bg-primary-950/30 text-primary-600 rounded-3xl flex items-center justify-center shrink-0">
                        <MapPin size={40} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight uppercase italic leadin-none">{dealer.name}</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Verified Dealer • {dealer.region} Region
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="text-right px-6 py-2 border-r border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Local Health</p>
                        <p className={`text-2xl font-black ${dealer.healthScore > 80 ? 'text-green-500' : 'text-accent'}`}>{dealer.healthScore}%</p>
                    </div>
                    <div className="text-right px-6 py-2">
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Current Stock</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{dealer.inventory} L</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Weekly Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Today\'s Sales', val: '₹4.2k', icon: ShoppingCart, color: 'text-primary-600', bg: 'bg-primary-50 dark:bg-primary-950/30' },
                            { label: 'Stock Health', val: '92%', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
                            { label: 'Pending Orders', val: '5', icon: Package, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30' },
                            { label: 'Security Status', val: 'Active', icon: ShieldCheck, color: 'text-accent', bg: 'bg-yellow-50 dark:bg-yellow-950/30' }
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

                    {/* Sales Performance Chart */}
                    <div className="bg-white dark:bg-black p-8 rounded-[40px] text-slate-800 dark:text-white shadow-xl dark:shadow-2xl overflow-hidden relative border border-slate-100 dark:border-slate-800">
                        <div className="absolute right-0 top-0 w-64 h-64 bg-primary-500/10 blur-[100px]"></div>
                        <div className="flex justify-between items-start mb-12 relative z-10">
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tight italic">Weekly Performance</h3>
                                <p className="text-slate-400 text-sm font-medium mt-1">Liters sold across all categories</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest">Last 7 Days</span>
                            </div>
                        </div>
                        <div className="h-[300px] w-full relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <Tooltip contentStyle={{ borderRadius: '16px', backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#fff' }} />
                                    <Area type="monotone" dataKey="sales" stroke="#38bdf8" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
                        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-6 uppercase tracking-tight">AI Local Insights</h3>
                        <div className="space-y-6">
                            {[
                                { title: 'Trending Shade', desc: 'Terracotta Emulsion is seeing a 20% spike in your locality.', color: 'bg-primary-500' },
                                { title: 'Stock Optimization', desc: 'Consider ordering 50L of White Enamel to avoid weekend stockout.', color: 'bg-accent' },
                                { title: 'Lost Revenue', desc: 'Missed ₹12k potential yesterday due to "Zero Distemper" status.', color: 'bg-rose-500' }
                            ].map((insight, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className={`w-1.5 h-auto ${insight.color} rounded-full transition-transform group-hover:scale-y-110`}></div>
                                    <div>
                                        <p className="text-sm font-black text-slate-800 dark:text-slate-100 mb-1">{insight.title}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{insight.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-10 py-4 bg-slate-900 dark:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl shadow-black/10">
                            Run Full Local Audit
                        </button>
                    </div>

                    <div className="bg-primary-600 p-8 rounded-[40px] text-white shadow-xl shadow-primary-500/20 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        <Activity size={32} className="mb-4 relative z-10" />
                        <h4 className="text-xl font-black mb-2 uppercase tracking-tight relative z-10">Incentive Tier 2</h4>
                        <p className="text-primary-100 text-xs font-medium leading-relaxed mb-6 italic relative z-10">
                            "You are only 400L away from reaching Exclusive Platinum Dealer status for Q1 2026."
                        </p>
                        <div className="w-full bg-primary-800 h-2 rounded-full overflow-hidden mb-2 relative z-10">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '85%' }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="bg-white h-full"
                            ></motion.div>
                        </div>
                        <p className="text-right text-[10px] font-black uppercase tracking-widest relative z-10">85% Progress</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DealerDashboard;
