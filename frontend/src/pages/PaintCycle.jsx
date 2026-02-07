import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, ShoppingCart, Plus, Tag, MapPin, Package, CheckCircle2, AlertCircle, Edit2, Trash2, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PaintCycle = () => {
    const { user } = useAuth();
    const [myListings, setMyListings] = useState([]);
    const [marketplace, setMarketplace] = useState([]);
    const [paints, setPaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPaint, setSelectedPaint] = useState('');
    const [formData, setFormData] = useState({
        quantity: '',
        condition: 'sealed',
        price: '',
        location: user?.region || 'Mumbai'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [paintsRes, marketplaceRes, myResRes] = await Promise.all([
                axios.get('http://localhost:5000/api/paints'),
                axios.get('http://localhost:5000/api/resale/list'),
                axios.get(`http://localhost:5000/api/resale/my-listings?sellerId=${user?.id}`)
            ]);
            setPaints(paintsRes.data);
            setMarketplace(marketplaceRes.data);
            setMyListings(myResRes.data);
        } catch (err) {
            console.error("Error fetching resale data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/resale/create', {
                sellerId: user.id,
                paintName: selectedPaint,
                ...formData
            });
            setSelectedPaint('');
            setFormData({ quantity: '', condition: 'sealed', price: '', location: user?.region || 'Mumbai' });
            fetchData();
        } catch (err) {
            console.error("Error creating listing", err);
        }
    };

    const handleBuy = async (listingId, qty) => {
        try {
            await axios.post('http://localhost:5000/api/resale/buy', {
                id: listingId,
                quantity: qty
            });
            fetchData();
        } catch (err) {
            console.error("Error purchasing item", err);
        }
    };

    if (loading) return <div className="p-8">Syncing resale node...</div>;

    return (
        <div className="space-y-10 pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-accent p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 blur-[80px] -rotate-45"></div>
                <div className="relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-black/20 px-4 py-1.5 rounded-full border border-white/10">PaintCycle v1.0</span>
                    <h2 className="text-5xl font-black mt-4 italic tracking-tighter uppercase">Leftover Resale</h2>
                    <p className="text-white/80 mt-4 max-w-xl font-medium text-lg leading-relaxed">
                        Sustainable stock rotation. Resell unused units from your projects or source regional leftovers at competitive rates.
                    </p>
                </div>
                <ShoppingBag size={180} className="absolute right-10 bottom-[-40px] text-white/10 rotate-12" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Section 1: Sell Form */}
                <div className="lg:col-span-1 border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[40px] p-8 shadow-xl">
                    <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-8 uppercase tracking-tighter flex items-center gap-3">
                        <div className="w-2 h-8 bg-primary-500 rounded-full"></div>
                        Sell Leftover
                    </h3>
                    <form onSubmit={handleCreate} className="space-y-6">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Select Paint</label>
                            <select
                                value={selectedPaint}
                                onChange={(e) => setSelectedPaint(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-4 font-bold text-slate-800 dark:text-white transition-all focus:ring-4 focus:ring-primary-500/10"
                                required
                            >
                                <option value="">Choose item...</option>
                                {paints.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Liters</label>
                                <input
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-4 font-bold text-slate-800 dark:text-white"
                                    placeholder="Qty"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Price/L</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-4 font-bold text-slate-800 dark:text-white"
                                    placeholder="₹"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Condition</label>
                                <select
                                    value={formData.condition}
                                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-4 font-bold text-slate-800 dark:text-white"
                                >
                                    <option value="Sealed">Sealed</option>
                                    <option value="Opened">Opened</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-4 font-bold text-slate-800 dark:text-white"
                                    placeholder="City"
                                    required
                                />
                            </div>
                        </div>
                        <div className="p-10 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl flex flex-col items-center gap-3 text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-800/30">
                            <Camera size={24} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Upload Proof</span>
                        </div>
                        <button type="submit" className="w-full py-5 bg-slate-900 dark:bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black dark:hover:bg-slate-800 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2">
                            <Plus size={18} /> Create Listing
                        </button>
                    </form>
                </div>

                {/* Section 2: My Listings */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
                        <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-8 uppercase tracking-tighter flex items-center gap-3">
                            <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                            My Resale Inventory
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="border-b border-slate-50 dark:border-slate-800">
                                    <tr className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pb-4">
                                        <th className="pb-4">Paint Item</th>
                                        <th className="pb-4">Qty</th>
                                        <th className="pb-4">Price</th>
                                        <th className="pb-4">Status</th>
                                        <th className="pb-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {myListings.length > 0 ? myListings.map((item) => (
                                        <tr key={item.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="py-5">
                                                <p className="font-bold text-slate-800 dark:text-white">{item.paintName}</p>
                                                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">{item.condition}</p>
                                            </td>
                                            <td className="py-5 font-black text-slate-600 dark:text-slate-300">{item.quantity}L</td>
                                            <td className="py-5 font-black text-primary-600">₹{item.price}/L</td>
                                            <td className="py-5">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.status === 'Active' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="py-5 text-right space-x-2">
                                                <button className="p-2 text-slate-400 hover:text-primary-600 transition-colors"><Edit2 size={16} /></button>
                                                <button className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="py-10 text-center text-slate-400 font-medium">No active listings created.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 3: Marketplace */}
            <div className="space-y-8">
                <div className="flex justify-between items-end">
                    <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter italic">Regional Resale Marketplace</h3>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase text-slate-500">
                            <MapPin size={12} /> Regional Nodes Only
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <AnimatePresence>
                        {marketplace.map((listing) => (
                            <motion.div
                                layout
                                key={listing.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`bg-white dark:bg-slate-900 p-8 rounded-[40px] border relative overflow-hidden group transition-all hover:scale-[1.02] shadow-sm hover:shadow-2xl ${listing.status === 'Sold' ? 'opacity-50 grayscale border-slate-100 dark:border-slate-800' : 'border-slate-100 dark:border-slate-800 hover:border-primary-500/20'}`}
                            >
                                {listing.tag && (
                                    <div className="absolute top-0 right-0 p-2">
                                        <span className="bg-red-500 text-white text-[8px] font-black px-3 py-1 rounded-bl-2xl uppercase tracking-[0.1em] shadow-lg animate-pulse">
                                            {listing.tag}
                                        </span>
                                    </div>
                                )}

                                <div className="mb-6 flex justify-between items-start">
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl text-slate-400 dark:text-slate-500 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                        <Package size={24} />
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{listing.condition}</p>
                                        <h4 className="text-xl font-black text-slate-800 dark:text-white leading-tight uppercase group-hover:text-primary-600 transition-colors">{listing.paintName}</h4>
                                    </div>
                                    <div className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                                        <div className="flex-1">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Available</p>
                                            <p className="text-sm font-black text-slate-800 dark:text-slate-200">{listing.quantity} L</p>
                                        </div>
                                        <div className="w-px h-full bg-slate-200 dark:bg-slate-700"></div>
                                        <div className="flex-1">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Price</p>
                                            <p className="text-sm font-black text-primary-600">₹{listing.price}/L</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                        <MapPin size={14} />
                                        <span className="text-[10px] font-bold truncate">{listing.location}</span>
                                    </div>
                                </div>

                                {listing.suggestion && (
                                    <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/20 flex items-start gap-3">
                                        <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                                        <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400">{listing.suggestion}</p>
                                    </div>
                                )}

                                {listing.status === 'Active' ? (
                                    <button
                                        onClick={() => handleBuy(listing.id, 1)}
                                        disabled={listing.sellerId === user.id}
                                        className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg ${listing.sellerId === user.id
                                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                            : 'bg-slate-900 dark:bg-black text-white hover:bg-black  dark:hover:bg-slate-800 hover:scale-105 active:scale-95 shadow-black/10'
                                            }`}
                                    >
                                        <ShoppingCart size={14} /> {listing.sellerId === user.id ? 'Your Listing' : 'Instant Buy 1L'}
                                    </button>
                                ) : (
                                    <div className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest text-center flex items-center justify-center gap-2">
                                        <CheckCircle2 size={14} /> Sourced
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default PaintCycle;
