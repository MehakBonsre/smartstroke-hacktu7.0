import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, Clock, CheckCircle2, ChevronRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/orders');
                setOrders(res.data);
            } catch (err) {
                console.warn("Using mock orders fallback");
                setOrders([
                    { id: "o1", buyerName: "Rahul Sharma", productId: "p1", quantity: 10, status: "Delivered", deliveryDate: "2026-02-04" },
                    { id: "o2", buyerName: "Sanjay Gupta", productId: "p3", quantity: 50, status: "Pending", deliveryDate: "2026-02-10" },
                    { id: "o3", buyerName: "Priya Singh", productId: "p2", quantity: 5, status: "Shipped", deliveryDate: "2026-02-08" }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(o =>
        filterStatus === 'All' || o.status === filterStatus
    );

    if (loading) return (
        <div className="p-8 text-slate-500 dark:text-slate-400 font-bold animate-pulse">
            Syncing Orders History...
        </div>
    );

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 border-emerald-100 dark:border-emerald-800/50';
            case 'Shipped': return 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 border-blue-100 dark:border-blue-800/50';
            case 'Pending': return 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 border-amber-100 dark:border-amber-800/50';
            default: return 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-800/50';
        }
    };

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-500">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
                <div>
                    <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Order Management</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Tracking {filteredOrders.length} shipments</p>
                </div>
                <div className="flex gap-2">
                    {['All', 'Delivered', 'Shipped', 'Pending'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${filterStatus === status
                                ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-500/20'
                                : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredOrders.map((order, i) => (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={order.id}
                        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[32px] shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-primary-600 transition-colors">
                                <Package size={32} />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h4 className="font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Order #{order.id.toUpperCase()}</h4>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Customer: {order.buyerName} • <span className="inline-flex items-center gap-1"><Clock size={12} /> {order.deliveryDate}</span></p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Quantity</p>
                                <p className="text-sm font-black text-slate-700 dark:text-slate-300">{order.quantity} L</p>
                            </div>
                            <button className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/20 rounded-2xl transition-all">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
