import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IndiaMap = ({ onRegionClick, data = [] }) => {
    const regions = [
        { id: 'North', name: 'North India (Delhi Hub)', path: "M 150 20 L 250 20 L 250 150 L 150 150 Z", color: 'fill-red-500' },
        { id: 'South', name: 'South India (Chennai Hub)', path: "M 150 300 L 250 300 L 200 480 L 100 300 Z", color: 'fill-green-500' },
        { id: 'East', name: 'East India (Kolkata Hub)', path: "M 320 180 L 450 180 L 450 280 L 320 280 Z", color: 'fill-yellow-500' },
        { id: 'West', name: 'West India (Mumbai Hub)', path: "M 20 180 L 150 180 L 150 300 L 20 300 Z", color: 'fill-green-500' },
        { id: 'Central', name: 'Central India (Nagpur Hub)', path: "M 150 160 L 320 160 L 320 300 L 150 300 Z", color: 'fill-yellow-500' }
    ];

    const [hovered, setHovered] = useState(null);

    return (
        <div className="relative bg-white dark:bg-slate-900 rounded-[40px] p-10 flex flex-col items-center shadow-xl dark:shadow-2xl overflow-hidden group border border-slate-100 dark:border-slate-800">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-500/10 to-transparent pointer-events-none"></div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-8 self-start uppercase tracking-tighter flex items-center gap-3">
                <div className="w-2 h-8 bg-primary-500 rounded-full shadow-[0_0_15px_rgba(14,165,233,0.4)]"></div>
                Regional Demand Hubs
            </h3>

            <svg viewBox="0 0 500 500" className="w-full max-w-sm drop-shadow-[0_20px_50px_rgba(14,165,233,0.3)] filter contrast-125 brightness-110">
                {regions.map((reg) => {
                    const status = data.find(d => d.region === reg.id);
                    let shadowColor = "drop-shadow(0 0 10px rgba(255,255,255,0.2))";
                    let fillColor = reg.color;

                    if (status) {
                        if (status.predictedDemand > 500) fillColor = 'fill-red-500';
                        else if (status.predictedDemand > 300) fillColor = 'fill-amber-500';
                        else fillColor = 'fill-emerald-500';
                    }

                    return (
                        <g key={reg.id} className="relative">
                            {/* Heatmap Glow Layer */}
                            {status?.predictedDemand > 300 && (
                                <motion.path
                                    d={reg.path}
                                    className={`${status.predictedDemand > 500 ? 'fill-red-500' : 'fill-amber-500'} opacity-20 blur-xl`}
                                    animate={{
                                        opacity: [0.1, 0.4, 0.1],
                                        scale: [1, 1.05, 1]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                />
                            )}
                            <motion.path
                                d={reg.path}
                                className={`${fillColor} cursor-pointer stroke-white dark:stroke-slate-900/50 stroke-[6] hover:stroke-primary-500 transition-all duration-300`}
                                initial={{ opacity: 0.6, scale: 0.9 }}
                                animate={{ opacity: 0.9, scale: 1 }}
                                whileHover={{
                                    scale: 1.05,
                                    opacity: 1,
                                    zIndex: 10,
                                    transition: { type: "spring", stiffness: 300 }
                                }}
                                onClick={() => onRegionClick && onRegionClick(reg.id)}
                                onMouseEnter={() => setHovered({ ...reg, status })}
                                onMouseLeave={() => setHovered(null)}
                                style={{ filter: shadowColor }}
                            />
                        </g>
                    );
                })}
            </svg>

            <AnimatePresence>
                {hovered && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute bottom-8 right-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 rounded-[24px] shadow-2xl border border-white/20 dark:border-slate-800 min-w-[220px] z-50 transition-colors"
                    >
                        <p className="font-black text-slate-900 dark:text-slate-100 text-lg uppercase tracking-tight mb-1">{hovered.name}</p>
                        <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest mb-4">Live Insights</p>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">Predicted</span>
                                <span className={`text-sm font-black ${hovered.status?.predictedDemand > 500 ? 'text-red-500' : 'text-emerald-500'}`}>
                                    {hovered.status?.predictedDemand || 0} L
                                </span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (hovered.status?.predictedDemand || 0) / 8)}%` }}
                                    className={`h-full ${hovered.status?.predictedDemand > 500 ? 'bg-red-500' : 'bg-emerald-500'}`}
                                ></motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-12 flex justify-between w-full opacity-60">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                    <span className="text-[10px] font-black text-slate-600 dark:text-white uppercase tracking-widest">Critical</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                    <span className="text-[10px] font-black text-slate-600 dark:text-white uppercase tracking-widest">Steady</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-[10px] font-black text-slate-600 dark:text-white uppercase tracking-widest">Surplus</span>
                </div>
            </div>
        </div>
    );
};

export default IndiaMap;
