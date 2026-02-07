import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { mockInventory } from '../data/mockData';
import { Search, Filter, Plus, Package, Edit, MoreVertical, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Inventory = () => {
    const [paints, setPaints] = useState(mockInventory);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        category: 'Premium Interior',
        warehouseStock: 0,
        dealerStock: 0,
        price: 0,
        region: 'North'
    });

    const fetchPaints = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/paints');
            setPaints(res.data);
        } catch (err) {
            console.warn("Using fallback mock inventory.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPaints();
    }, []);

    const [filterCategory, setFilterCategory] = useState('All');
    const [filterRegion, setFilterRegion] = useState('All');

    const handleOpenModal = (mode, paint = null) => {
        setModalMode(mode);
        if (mode === 'edit' && paint) {
            setFormData(paint);
        } else {
            setFormData({
                id: 'p' + (paints.length + 1),
                name: '',
                category: 'Premium Interior',
                warehouseStock: 0,
                dealerStock: 0,
                price: 0,
                region: 'North'
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (modalMode === 'add') {
            const newPaints = [...paints, formData];
            setPaints(newPaints);
            alert(`Product "${formData.name}" added to inventory.`);
        } else {
            const updatedPaints = paints.map(p => p.id === formData.id ? formData : p);
            setPaints(updatedPaints);
            alert(`Inventory for "${formData.name}" updated.`);
        }
        setIsModalOpen(false);
    };

    const filteredPaints = paints.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
        const matchesRegion = filterRegion === 'All' || p.region === filterRegion;
        return matchesSearch && matchesCategory && matchesRegion;
    });

    if (loading) return <div className="p-8">Loading Inventory...</div>;

    const categories = ['All', 'Premium Interior', 'Standard Interior', 'Exterior', 'Enamel'];
    const regions = ['All', 'North', 'South', 'East', 'West', 'Central'];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium text-slate-800 dark:text-slate-100"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-sm font-bold text-slate-700 dark:text-slate-300 pointer-events-auto focus:ring-2 focus:ring-primary-500/20"
                    >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select
                        value={filterRegion}
                        onChange={(e) => setFilterRegion(e.target.value)}
                        className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-sm font-bold text-slate-700 dark:text-slate-300 pointer-events-auto focus:ring-2 focus:ring-primary-500/20"
                    >
                        {regions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <button
                        onClick={() => handleOpenModal('add')}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20"
                    >
                        <Plus size={18} />
                        Add Paint
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <th className="px-8 py-5 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Product Details</th>
                            <th className="px-8 py-5 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Warehouse Stock</th>
                            <th className="px-8 py-5 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Dealer Stock</th>
                            <th className="px-8 py-5 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-5 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Price</th>
                            <th className="px-8 py-5 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                        {filteredPaints.map((paint) => (
                            <tr key={paint.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-600 group-hover:bg-white dark:group-hover:bg-slate-750 group-hover:shadow-sm transition-all">
                                            <Package size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-slate-100">{paint.name}</p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{paint.category} • {paint.region}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="font-black text-slate-700 dark:text-slate-300">{paint.warehouseStock}</span>
                                    <span className="text-[10px] ml-1 text-slate-400 dark:text-slate-500">units</span>
                                </td>
                                <td className="px-8 py-6">
                                    <span className={`font-black ${paint.dealerStock < 50 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
                                        {paint.dealerStock}
                                    </span>
                                    <span className="text-[10px] ml-1 text-slate-400 dark:text-slate-500">units</span>
                                </td>
                                <td className="px-8 py-6">
                                    {paint.dealerStock < 50 ? (
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-rose-950/30 text-red-600 dark:text-rose-400 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                            <AlertTriangle size={12} /> Low Stock
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-emerald-950/30 text-green-600 dark:text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                            Healthy
                                        </div>
                                    )}
                                </td>
                                <td className="px-8 py-6 font-bold text-slate-800 dark:text-slate-100">
                                    ₹{paint.price}
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button
                                        onClick={() => handleOpenModal('edit', paint)}
                                        className="p-2 text-slate-400 dark:text-slate-600 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/20 rounded-lg transition-all"
                                    >
                                        <Edit size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paint Modal (Add/Edit) */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-100 dark:border-slate-800"
                        >
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                                {modalMode === 'add' ? 'Add New Product' : 'Update Inventory'}
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Enter paint details below</p>

                            <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
                                {modalMode === 'add' && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Product Name</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-slate-800 dark:text-slate-100"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Category</label>
                                            <select
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-slate-800 dark:text-slate-100"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            >
                                                <option>Premium Interior</option>
                                                <option>Standard Interior</option>
                                                <option>Exterior</option>
                                                <option>Enamel</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Region</label>
                                            <select
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-slate-800 dark:text-slate-100"
                                                value={formData.region}
                                                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                            >
                                                <option>North</option>
                                                <option>South</option>
                                                <option>East</option>
                                                <option>West</option>
                                                <option>Central</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Price (₹)</label>
                                            <input
                                                type="number"
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-slate-800 dark:text-slate-100"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            />
                                        </div>
                                    </>
                                )}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Warehouse Stock</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-slate-800 dark:text-slate-100"
                                            value={formData.warehouseStock}
                                            onChange={(e) => setFormData({ ...formData, warehouseStock: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Dealer Stock</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-bold text-slate-800 dark:text-slate-100"
                                            value={formData.dealerStock}
                                            onChange={(e) => setFormData({ ...formData, dealerStock: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex-1 py-4 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20"
                                >
                                    {modalMode === 'add' ? 'Confirm Add' : 'Save Changes'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Inventory;
