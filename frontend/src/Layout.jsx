import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import { Navigate, Link } from 'react-router-dom';
import { Bell, Settings as SettingsIcon, Search, Package, Moon, Sun } from 'lucide-react';
import NotificationPanel from './components/NotificationPanel';
import Settings from './components/Settings';
import { useTheme } from './context/ThemeContext';

const Layout = ({ children }) => {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    if (!user) return <Navigate to="/login" />;

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 relative">
                <header className="flex justify-between items-center mb-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-6 -mx-8 -mt-8 border-b border-slate-100 dark:border-slate-800 z-30 sticky top-0 transition-colors">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-accent rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
                                S
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tighter uppercase italic leading-none">
                                    Smart<span className="text-primary-600">Stroke</span>
                                </h2>
                                <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Intelligent Supply Chain</p>
                            </div>
                        </Link>
                        <div className="hidden lg:flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest uppercase">Nodes Online</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search inventory..."
                                className="bg-slate-100 dark:bg-slate-800 pl-12 pr-4 py-2.5 rounded-2xl border-none focus:ring-4 focus:ring-primary-500/10 text-sm font-medium w-64 transition-all text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            />
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setIsNotifOpen(!isNotifOpen)}
                                className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-slate-800 rounded-2xl transition-all shadow-sm group"
                            >
                                <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                            </button>
                            <NotificationPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
                        </div>

                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-slate-800 rounded-2xl transition-all shadow-sm group"
                        >
                            <SettingsIcon size={20} className="group-hover:rotate-45 transition-transform" />
                        </button>

                        <button
                            onClick={toggleTheme}
                            className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-slate-800 rounded-2xl transition-all shadow-sm group"
                        >
                            {theme === 'dark' ? (
                                <Sun size={20} className="group-hover:rotate-90 transition-transform text-amber-500" />
                            ) : (
                                <Moon size={20} className="group-hover:-rotate-12 transition-transform text-primary-600" />
                            )}
                        </button>

                        <div className="h-10 w-[1px] bg-slate-200 mx-2"></div>

                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{user?.role}</p>
                                <p className="text-sm font-black text-slate-800 leading-none truncate max-w-[120px]">{user?.name}</p>
                            </div>
                            <div className={`w-10 h-10 rounded-2xl ${user?.avatar || 'bg-gradient-to-tr from-primary-600 to-accent'} flex items-center justify-center text-white font-black text-sm shadow-lg shadow-primary-500/20`}>
                                {user?.name?.[0]}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="pt-4">
                    {children}
                </div>

                <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
            </main>
        </div>
    );
};

export default Layout;
