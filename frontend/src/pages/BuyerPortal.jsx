import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingBag, Star, ChevronRight, Check, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockInventory } from '../data/mockData';

const BuyerPortal = () => {
    const [paints, setPaints] = useState(mockInventory);
    const [loading, setLoading] = useState(true);
    const [selectedPaint, setSelectedPaint] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [orderDone, setOrderDone] = useState(false);

    useEffect(() => {
        const fetchPaints = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/paints');
                setPaints(res.data);
            } catch (err) {
                console.warn("Using fallback mock catalog.");
            } finally {
                setLoading(false);
            }
        };
        fetchPaints();
    }, []);

    const handlePlaceOrder = async () => {
        try {
            await axios.post('http://localhost:5000/api/orders/create', {
                dealerId: 'd1', // Mock dealer
                productId: selectedPaint.id,
                quantity: Number(quantity),
                buyerName: 'Sandbox User'
            });
            setOrderDone(true);
            setTimeout(() => {
                setOrderDone(false);
                setSelectedPaint(null);
                setQuantity(1);
            }, 2000);
        } catch (err) {
            alert('Order failed');
        }
    };

    const getColorForPaint = (name) => {
        const colors = {
            'Royal Silk Gloss': 'bg-rose-500',
            'WeatherShield Max': 'bg-sky-500',
            'Matte Finish Pro': 'bg-slate-700',
            'EcoPure Washable': 'bg-emerald-500',
            'MetalArmor Chrome': 'bg-zinc-400'
        };
        return colors[name] || 'bg-primary-500';
    };

    if (loading) return <div className="p-8">Opening catalog...</div>;

    return (
        <div className="space-y-8 pb-20">
            <div className="bg-white dark:bg-slate-900 rounded-[32px] p-12 text-slate-800 dark:text-white relative overflow-hidden shadow-xl dark:shadow-2xl border border-slate-100 dark:border-slate-800">
                <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-primary-500/20 to-transparent"></div>
                <div className="relative z-10 max-w-2xl">
                    <span className="text-primary-600 dark:text-primary-400 text-xs font-black uppercase tracking-widest bg-primary-50 dark:bg-primary-950/50 px-3 py-1 rounded-full border border-primary-100 dark:border-primary-900">Season Refresh 2026</span>
                    <h2 className="text-5xl font-black mt-4 leading-tight">Revitalize Your Spaces with Premium Finishes</h2>
                    <p className="text-slate-400 mt-6 text-lg font-medium leading-relaxed">
                        Explore Asia's most advanced architectural coatings. Available for immediate delivery from regional fulfillment centers.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {paints.map((paint, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={paint.id}
                        className="group bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500"
                    >
                        <div className="aspect-[4/3] bg-slate-50 dark:bg-slate-800 relative overflow-hidden flex items-center justify-center p-10">
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div
                                className="w-32 h-40 rounded-t-3xl rounded-b-xl shadow-2xl transform group-hover:scale-110 transition-transform duration-700 relative z-10"
                                style={{
                                    backgroundColor: '#CBD5E1', // Default paint can gray
                                    boxShadow: `0 20px 40px -10px ${paint.color || '#CBD5E1'}44`
                                }}
                            >
                                {/* Color preview swatch on the "can" */}
                                <div
                                    className="absolute top-8 left-0 right-0 h-16 opacity-90 transition-all"
                                    style={{ backgroundColor: paint.color }}
                                />
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/30 rounded-full" />
                            </div>
                            <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center z-20">
                                <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm dark:text-slate-200">
                                    {paint.category}
                                </span>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter italic">{paint.name}</h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm" style={{ backgroundColor: paint.color }} />
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
                                Premium quality architectural coating designed for durability and brilliant finish.
                            </p>

                            <div className="flex items-center justify-between mt-auto">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Price</p>
                                    <p className="text-2xl font-black text-primary-600">₹{paint.price}<span className="text-[10px] text-slate-400 uppercase font-bold">/L</span></p>
                                </div>
                                <button
                                    onClick={() => setSelectedPaint(paint)}
                                    className="w-14 h-14 bg-slate-900 dark:bg-black text-white rounded-2xl flex items-center justify-center hover:bg-primary-600 hover:scale-105 transition-all shadow-xl shadow-black/10 hover:shadow-primary-500/20"
                                >
                                    <Plus size={24} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedPaint && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-end">
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            className="w-full max-w-xl h-full bg-white dark:bg-slate-950 p-12 shadow-2xl relative flex flex-col"
                        >
                            <button
                                onClick={() => setSelectedPaint(null)}
                                className="absolute top-8 left-8 p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                            >
                                <ChevronRight className="rotate-180" size={24} />
                            </button>

                            <div className="mt-16 flex-1">
                                <span className="text-primary-600 text-xs font-black uppercase tracking-widest mb-2 block">{selectedPaint.category}</span>
                                <h2 className="text-4xl font-black text-slate-900 dark:text-slate-100 leading-tight mb-4 uppercase">{selectedPaint.name}</h2>
                                <p className="text-slate-500 font-medium text-lg leading-relaxed mb-8">
                                    Premium quality coating designed for high-traffic environments. Exceptional color retention and easy-clean technology.
                                </p>

                                <div className="grid grid-cols-2 gap-6 mb-12">
                                    <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Availability</p>
                                        <p className="text-xl font-black text-slate-800 dark:text-slate-200">{selectedPaint.dealerStock} Liters Left</p>
                                    </div>
                                    <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Region</p>
                                        <p className="text-xl font-black text-slate-800 dark:text-slate-200">{selectedPaint.region} Hub</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Select Quantity (Liters)</label>
                                    <div className="flex gap-4">
                                        {[1, 5, 10, 20, 50].map(q => (
                                            <button
                                                key={q}
                                                onClick={() => setQuantity(q)}
                                                className={`flex-1 py-4 rounded-2xl font-black transition-all border-2 ${quantity === q
                                                    ? 'bg-primary-600 border-primary-600 text-white shadow-xl shadow-primary-500/20 scale-105'
                                                    : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                                                    }`}
                                            >
                                                {q}L
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-100">
                                <div className="flex justify-between items-end mb-8">
                                    <div>
                                        <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Total Amount</p>
                                        <p className="text-4xl font-black text-slate-900 dark:text-slate-100">₹{selectedPaint.price * quantity}</p>
                                    </div>
                                    <div className="text-right text-[10px] font-bold text-slate-400 uppercase">
                                        Inc. Taxes & Regional Delivery
                                    </div>
                                </div>
                                <button
                                    disabled={orderDone}
                                    onClick={handlePlaceOrder}
                                    className={`w-full py-6 rounded-3xl font-black text-lg transition-all flex items-center justify-center gap-3 ${orderDone
                                        ? 'bg-green-500 text-white'
                                        : 'bg-slate-900 dark:bg-black text-white hover:bg-black dark:hover:bg-slate-800 shadow-2xl hover:scale-[1.02]'
                                        }`}
                                >
                                    {orderDone ? (
                                        <><Check size={24} /> Order Confirmed!</>
                                    ) : (
                                        <><ShoppingBag size={24} /> Place Immediate Order</>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BuyerPortal;
