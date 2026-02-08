import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, AlertCircle, Calendar, ArrowRight, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockInventory } from '../data/mockData';

const DeadStock = () => {
    const [deadStock, setDeadStock] = useState(mockInventory.slice(0, 3)); // Mock deadstock
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDeadStock = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/deadstock');
                setDeadStock(res.data);
            } catch (err) {
                console.warn("Using fallback mock dead stock.");
            } finally {
                setLoading(false);
            }
        };
        fetchDeadStock();
    }, []);

    const handleBulkLiquidate = () => {
        if (deadStock.length === 0) return;
        const totalValue = deadStock.reduce((acc, p) => acc + (p.dealerStock * p.price), 0);
        setDeadStock([]);
        alert(`Bulk Liquidation successful! Recovery of ₹${totalValue.toLocaleString()} initiated.`);
    };

    const handleApplyDiscount = (id, paintName) => {
        setDeadStock(prev => prev.filter(p => p.id !== id));
        alert(`15% Discount applied to ${paintName}. Item moved to active promotions.`);
    };

    const handleTransfer = (id, paintName) => {
        setDeadStock(prev => prev.filter(p => p.id !== id));
        alert(`${paintName} transfer to South Hub initiated.`);
    };

    if (loading) return <div className="p-8">Analyzing aging inventory...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 p-8 rounded-3xl flex flex-col md:flex-row gap-6 items-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center shrink-0">
                    <AlertCircle size={32} />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-xl font-bold text-red-900 dark:text-red-400">Aging Inventory Identified</h2>
                    {deadStock.length > 0 ? (
                        <p className="text-red-700 dark:text-red-500/80 mt-1 font-medium">
                            Found {deadStock.length} items that haven't been sold in over 60 days. These items are tying up roughly
                            <span className="font-black ml-1 text-red-900 dark:text-red-300">₹{(deadStock.reduce((acc, p) => acc + (p.dealerStock * p.price), 0)).toLocaleString()}</span> in capital.
                        </p>
                    ) : (
                        <p className="text-emerald-700 dark:text-emerald-400 mt-1 font-medium">All aging inventory cleared. Capital efficiency is optimal.</p>
                    )}
                </div>
                {deadStock.length > 0 && (
                    <button
                        onClick={handleBulkLiquidate}
                        className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20"
                    >
                        Bulk Liquidate
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {deadStock.map((paint, i) => (
                    <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay: i * 0.1 }}
                        key={paint.id}
                        className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow relative overflow-hidden group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl text-slate-400 dark:text-slate-500 group-hover:text-red-500 transition-colors">
                                <Trash2 size={24} />
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Days Idle</p>
                                <p className="text-xl font-black text-red-500">
                                    {paint.lastSoldDate ? Math.ceil((new Date() - new Date(paint.lastSoldDate)) / (1000 * 60 * 60 * 24)) : 45}
                                </p>
                            </div>
                        </div>

                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-1">{paint.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-1.5 font-medium">
                            <Calendar size={14} /> Last Sold: {paint.lastSoldDate || '2025-12-15'}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Stock</p>
                                <p className="text-lg font-black text-slate-700 dark:text-slate-300">{paint.dealerStock}L</p>
                            </div>
                            <div className="bg-slate-900 dark:bg-black p-4 rounded-2xl text-white shadow-xl shadow-black/10">
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Capital Lock</p>
                                <p className="text-lg font-black text-accent">₹{(paint.dealerStock * paint.price).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Prediction: 94% Aging Prob.</p>
                            <button
                                onClick={() => handleApplyDiscount(paint.id, paint.name)}
                                className="w-full flex justify-between items-center px-4 py-3 bg-primary-50 text-primary-600 rounded-xl font-bold text-sm hover:bg-primary-100 transition-colors group/btn"
                            >
                                <div className="flex items-center gap-2">
                                    <Tag size={16} /> Flash Liquidation (20%)
                                </div>
                                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => handleTransfer(paint.id, paint.name)}
                                className="w-full flex justify-between items-center px-4 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors group/btn"
                            >
                                <div className="flex items-center gap-2">
                                    <ArrowRight size={16} className="rotate-180" /> Inter-Hub Transfer
                                </div>
                                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
            {deadStock.length === 0 && (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">No Aging Stock Found</h3>
                    <p className="text-slate-500 font-medium">Your inventory health is at peak performance.</p>
                </div>
            )}
        </div>
    );
};

const CheckCircle2 = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" />
    </svg>
);

export default DeadStock;
