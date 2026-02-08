import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings as SettingsIcon, Shield, Database, Globe, Sliders, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Settings = ({ isOpen, onClose }) => {
    const { theme, toggleTheme } = useTheme();
    const [selectedSection, setSelectedSection] = React.useState(null);
    const [config, setConfig] = React.useState({
        twoFactor: true,
        erpSync: true,
        autoRegionalTransfer: false,
        aiThreshold: 75
    });

    const sections = [
        { id: 'Appearance', icon: Moon, label: 'Appearance', desc: 'Dark mode & theme' },
        { id: 'Security', icon: Shield, label: 'Security', desc: 'Two-factor auth & roles' },
        { id: 'Data Hub', icon: Database, label: 'Data Hub', desc: 'ERP & Inventory sync' },
        { id: 'Regions', icon: Globe, label: 'Regions', desc: 'Regional hub logic' },
        { id: 'AI Model', icon: Sliders, label: 'AI Model', desc: 'Sensitivity & logic' },
    ];

    const renderSubSection = () => {
        switch (selectedSection) {
            case 'Appearance':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                                    {theme === 'dark' ? <Moon size={18} className="text-primary-400" /> : <Sun size={18} className="text-amber-500" />}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">Dark Mode</p>
                                    <p className="text-xs text-slate-400 font-medium">Reduce eye strain at night</p>
                                </div>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className={`w-12 h-6 rounded-full transition-all relative ${theme === 'dark' ? 'bg-primary-600' : 'bg-slate-300'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all ${theme === 'dark' ? 'right-1' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                );
            case 'Security':
                // ... existing cases
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                            <div>
                                <p className="font-bold text-slate-800">Two-Factor Authentication</p>
                                <p className="text-xs text-slate-400">Secure your account with 2FA</p>
                            </div>
                            <button
                                onClick={() => setConfig({ ...config, twoFactor: !config.twoFactor })}
                                className={`w-12 h-6 rounded-full transition-colors relative ${config.twoFactor ? 'bg-primary-600' : 'bg-slate-300'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.twoFactor ? 'right-1' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                );
            case 'Data Hub':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                            <div>
                                <p className="font-bold text-slate-800">ERP Real-Time Sync</p>
                                <p className="text-xs text-slate-400">Automatic inventory updates</p>
                            </div>
                            <button
                                onClick={() => setConfig({ ...config, erpSync: !config.erpSync })}
                                className={`w-12 h-6 rounded-full transition-colors relative ${config.erpSync ? 'bg-primary-600' : 'bg-slate-300'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.erpSync ? 'right-1' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                );
            case 'Regions':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                            <div>
                                <p className="font-bold text-slate-800">Auto Regional Transfer</p>
                                <p className="text-xs text-slate-400">AI-driven stock balancing</p>
                            </div>
                            <button
                                onClick={() => setConfig({ ...config, autoRegionalTransfer: !config.autoRegionalTransfer })}
                                className={`w-12 h-6 rounded-full transition-colors relative ${config.autoRegionalTransfer ? 'bg-primary-600' : 'bg-slate-300'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.autoRegionalTransfer ? 'right-1' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                );
            case 'AI Model':
                return (
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between mb-2">
                                <p className="font-bold text-slate-800">Prediction Sensitivity</p>
                                <span className="font-black text-primary-600">{config.aiThreshold}%</span>
                            </div>
                            <input
                                type="range"
                                min="50" max="95"
                                value={config.aiThreshold}
                                onChange={(e) => setConfig({ ...config, aiThreshold: e.target.value })}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                            />
                        </div>
                    </div>
                );
            default: return null;
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white dark:bg-slate-900 rounded-[40px] max-w-2xl w-full p-10 shadow-3xl border border-slate-100 dark:border-slate-800"
                    >
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter italic">
                                    {selectedSection ? `${selectedSection} Settings` : 'System Configuration'}
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
                                    {selectedSection ? `Customize your ${selectedSection.toLowerCase()} preferences` : 'Global platform settings and preferences'}
                                </p>
                            </div>
                            <button
                                onClick={selectedSection ? () => setSelectedSection(null) : onClose}
                                className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-2xl transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {!selectedSection ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {sections.map((sec, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setSelectedSection(sec.id)}
                                        className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-transparent hover:border-primary-500/20 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer group"
                                    >
                                        <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 shadow-sm transition-all mb-4">
                                            <sec.icon size={24} />
                                        </div>
                                        <h4 className="font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight mb-1">{sec.label}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{sec.desc}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="min-h-[200px] py-4">
                                {renderSubSection()}
                            </div>
                        )}

                        <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-4">
                            <button
                                onClick={selectedSection ? () => setSelectedSection(null) : onClose}
                                className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                            >
                                {selectedSection ? 'Go Back' : 'Cancel'}
                            </button>
                            <button
                                onClick={() => {
                                    alert('Settings saved successfully!');
                                    onClose();
                                }}
                                className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all"
                            >
                                Save Changes
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Settings;
