import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Shield, Camera, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProfileModal = ({ isOpen, onClose }) => {
    const { user, updateUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || 'bg-slate-900');
    const [isSaving, setIsSaving] = useState(false);

    const avatars = [
        'bg-slate-900',
        'bg-primary-600',
        'bg-accent',
        'bg-emerald-600',
        'bg-rose-600',
        'bg-indigo-600'
    ];

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            updateUser({ name, avatar: selectedAvatar });
            setIsSaving(false);
            alert('Profile updated successfully!');
            onClose();
        }, 800);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-white rounded-[48px] max-w-lg w-full p-12 shadow-3xl border border-white/20 overflow-hidden relative"
                    >
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-tr from-primary-600 to-accent opacity-10"></div>

                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">My Account</h3>
                            <button onClick={onClose} className="p-3 bg-white/80 backdrop-blur hover:bg-slate-100 text-slate-500 rounded-2xl transition-all shadow-sm">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex flex-col items-center mb-10 relative z-10">
                            <div className="relative group">
                                <div className={`w-32 h-32 rounded-[40px] ${selectedAvatar} flex items-center justify-center text-white text-4xl font-black shadow-2xl transition-colors duration-500`}>
                                    {name[0]}
                                </div>
                                <div className="absolute -bottom-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full shadow-lg border border-slate-100 flex gap-2">
                                    {avatars.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedAvatar(color)}
                                            className={`w-4 h-4 rounded-full ${color} ${selectedAvatar === color ? 'ring-2 ring-primary-500 ring-offset-2' : ''}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="mt-8 text-center">
                                <h4 className="text-xl font-black text-slate-800">{name}</h4>
                                <div className="flex items-center gap-2 justify-center mt-1">
                                    <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                        <Shield size={10} /> {user?.role}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Display Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all font-bold text-slate-800 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-4">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input
                                        type="email"
                                        readOnly
                                        value={user?.role?.toLowerCase() + '@smartstroke.ai'}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-100 border border-transparent rounded-3xl font-bold text-slate-400 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 flex gap-4 relative z-10">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className={`flex-1 py-5 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 ${isSaving ? 'opacity-50' : ''}`}
                            >
                                {isSaving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <Save size={18} />}
                                {isSaving ? 'Updating...' : 'Save Profile'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProfileModal;
