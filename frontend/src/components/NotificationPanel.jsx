import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { mockAlerts } from '../data/mockData';

const NotificationPanel = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = React.useState(mockAlerts);

    const handleClearAll = () => {
        setNotifications([]);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={onClose} />
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-16 w-80 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 z-50 overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                            <h3 className="font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter text-sm">Notifications</h3>
                            <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-lg transition-colors">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="max-h-96 overflow-y-auto p-2">
                            {notifications.length > 0 ? (
                                notifications.map((alert, i) => (
                                    <div key={i} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all cursor-pointer group">
                                        <div className="flex gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${alert.type === 'Critical' ? 'bg-red-50 text-red-500' :
                                                alert.type === 'Warning' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'
                                                }`}>
                                                {alert.type === 'Critical' ? <AlertTriangle size={18} /> :
                                                    alert.type === 'Warning' ? <Info size={18} /> : <CheckCircle2 size={18} />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm group-hover:text-primary-600 transition-colors">{alert.title}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 font-medium">{alert.message}</p>
                                                <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Just now</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="w-12 h-12 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Bell size={24} />
                                    </div>
                                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Inbox Zero</p>
                                    <p className="text-slate-300 text-xs mt-1">No new alerts found</p>
                                </div>
                            )}
                        </div>
                        {notifications.length > 0 && (
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
                                <button
                                    onClick={handleClearAll}
                                    className="text-xs font-black text-primary-600 uppercase tracking-widest hover:text-primary-700 transition-colors"
                                >
                                    Clear all notifications
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default NotificationPanel;
