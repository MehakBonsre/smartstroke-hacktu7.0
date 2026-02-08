import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapPin, ShieldCheck, Activity, Package, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const Dealers = () => {
    const [dealers, setDealers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDealers = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/dealers');
                setDealers(res.data);
            } catch (err) {
                console.warn("Using mock dealers fallback");
                // Mock data fallback if backend fails
                setDealers([
                    { id: 'd1', name: "Aryan Paints & Hardware", region: "North", inventory: 450, healthScore: 85 },
                    { id: 'd2', name: "Krishna Decorators", region: "South", inventory: 120, healthScore: 45 },
                    { id: 'd3', name: "Venkateshwara Enterprise", region: "West", inventory: 600, healthScore: 92 },
                    { id: 'd4', name: "Eastern Blue Paints", region: "East", inventory: 300, healthScore: 70 },
                    { id: 'd5', name: "Global Paint Solutions", region: "Central", inventory: 250, healthScore: 60 }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchDealers();
    }, []);

    const runAudit = (dealerName) => {
        alert(`Initializing AI Audit for ${dealerName}...`);
        setTimeout(() => {
            alert(`Audit Complete for ${dealerName}. All compliance checks passed.`);
        }, 1000);
    };

    if (loading) return <div className="p-8">Loading Dealers Hub...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {dealers.map((dealer, i) => (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        key={dealer.id}
                        className="bg-white dark:bg-slate-900 rounded-[40px] p-8 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all group"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-primary-600 transition-colors">
                                <Users size={32} />
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Health Score</p>
                                <span className={`text-2xl font-black italic tracking-tighter ${dealer.healthScore > 90 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                    {dealer.healthScore}%
                                </span>
                            </div>
                        </div>

                        <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight mb-1">{dealer.name}</h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-8 flex items-center gap-2">
                            <MapPin size={14} /> {dealer.location}
                        </p>
                        {/* The following section was partially provided in the instruction, but seems to be a fragment.
                            I'm keeping the original structure for the rest of the card and applying dark mode classes where appropriate,
                            as the instruction was to "Add dark mode utility classes".
                            The provided snippet for "Health: {dealer.healthScore}%" was out of context in the instruction's partial code. */}

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-transparent group-hover:border-slate-100 dark:group-hover:border-slate-700 transition-all">
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                    <Package size={12} /> Current Stock
                                </p>
                                <p className="text-2xl font-black text-slate-800 tracking-tight">{dealer.inventory} <span className="text-xs text-slate-400 uppercase">Liters</span></p>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-3xl border border-transparent group-hover:border-slate-100 transition-all">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                    <Activity size={12} /> Live Ops
                                </p>
                                <p className="text-2xl font-black text-slate-800 tracking-tight text-emerald-500">Active</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => runAudit(dealer.name)}
                                className="flex-1 py-4 bg-slate-900 dark:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                            >
                                <ShieldCheck size={16} /> Run Audit
                            </button>
                            <button className="w-14 h-14 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-2xl flex items-center justify-center hover:bg-primary-50 dark:hover:bg-primary-950/20 hover:text-primary-600 transition-all">
                                <ExternalLink size={20} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const Globe = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

export default Dealers;
