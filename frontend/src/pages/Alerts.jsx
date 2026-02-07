import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AlertCircle, Bell, Clock, ShieldAlert, CheckCircle2, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockAlerts } from '../data/mockData';

const Alerts = () => {
    const [alerts, setAlerts] = useState(mockAlerts);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/alerts');
                setAlerts(res.data);
            } catch (err) {
                console.warn("Using fallback mock alerts.");
            } finally {
                setLoading(false);
            }
        };
        fetchAlerts();
    }, []);

    const handleDismiss = (index) => {
        setAlerts(prev => prev.filter((_, i) => i !== index));
    };

    const handleMarkAllRead = () => {
        setAlerts([]);
        alert('All notifications marked as read.');
    };

    if (loading) return <div className="p-8">Syncing alerts...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight uppercase">System Alerts</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Real-time supply chain notifications</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleMarkAllRead}
                        className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                        Mark all as read
                    </button>
                    <button className="p-2 bg-slate-900 dark:bg-black text-white rounded-xl hover:bg-black transition-all">
                        <Bell size={20} />
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {alerts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-900 p-12 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800 text-center"
                    >
                        <div className="w-20 h-20 bg-green-50 dark:bg-emerald-950/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={40} />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter italic">All Systems Nominal</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">No critical alerts detected at this moment.</p>
                    </motion.div>
                ) : (
                    alerts.map((alert, i) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: i * 0.1 }}
                            key={i}
                            className={`p-6 rounded-3xl border-2 transition-all hover:shadow-lg flex gap-6 items-start ${alert.type === 'Critical'
                                ? 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/40 hover:border-red-200 dark:hover:border-red-800'
                                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                                }`}
                        >
                            <div className={`p-4 rounded-2xl shrink-0 ${alert.type === 'Critical' ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400' : 'bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400'
                                }`}>
                                {alert.type === 'Critical' ? <ShieldAlert size={28} /> : <AlertCircle size={28} />}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-black text-slate-800 dark:text-slate-100 text-lg uppercase tracking-tight">{alert.title}</h4>
                                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                        <Clock size={12} /> {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{alert.message}</p>
                                <div className="mt-4 flex gap-3">
                                    <button
                                        onClick={() => {
                                            alert(`Action initiated for: ${alert.title}`);
                                            handleDismiss(i);
                                        }}
                                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${alert.type === 'Critical'
                                            ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/20'
                                            : 'bg-slate-900 dark:bg-black text-white hover:bg-black'
                                            }`}
                                    >
                                        Address Now
                                    </button>
                                    <button
                                        onClick={() => handleDismiss(i)}
                                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </div>
                            <button className="text-slate-300 hover:text-slate-600 p-1">
                                <MoreVertical size={18} />
                            </button>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Alerts;
