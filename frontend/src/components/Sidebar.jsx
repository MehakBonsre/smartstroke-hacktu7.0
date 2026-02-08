import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Package, TrendingUp, AlertTriangle, Users, ShoppingCart, LogOut, User, Moon, Sun, Tag } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import ProfileModal from './ProfileModal';
import { useTheme } from '../context/ThemeContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const menuItems = {
        Admin: [
            { icon: LayoutDashboard, label: 'AI Dashboard', path: '/' },
            { icon: Package, label: 'Inventory', path: '/inventory' },
            { icon: TrendingUp, label: 'Demand Intelligence', path: '/demand' },
            { icon: AlertTriangle, label: 'Dead Stock', path: '/deadstock' },
            { icon: Users, label: 'Dealer Insights', path: '/dealers' },
        ],
        Dealer: [
            { icon: LayoutDashboard, label: 'My Dashboard', path: '/dealer-dashboard' },
            { icon: Package, label: 'Stock Management', path: '/inventory' },
            { icon: AlertTriangle, label: 'Alerts', path: '/alerts' },
        ],
        Buyer: [
            { icon: ShoppingCart, label: 'Browse Paints', path: '/portal' },
            { icon: Package, label: 'My Orders', path: '/orders' },
            { icon: Tag, label: 'Resell Paint', path: '/resell-paint' },
        ]
    };

    const items = menuItems[user?.role] || [];

    return (
        <div className="w-64 h-screen bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 flex flex-col fixed left-0 top-0 shadow-xl dark:shadow-2xl z-40 transition-colors duration-500 border-r border-slate-100 dark:border-slate-800">
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-accent rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/20">
                    S
                </div>
                <h1 className="text-xl font-black text-slate-800 dark:text-white italic tracking-tighter">
                    SMARTSTROKE
                </h1>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                {items.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-bold text-sm
                            ${isActive ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-primary-600 dark:hover:text-white'}
                        `}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="px-4 py-4 border-t border-slate-100 dark:border-slate-800/50">
                <button
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all group border border-slate-200 dark:border-slate-700/50 shadow-sm"
                >
                    <div className="flex items-center gap-3">
                        {theme === 'dark' ? (
                            <Sun size={18} className="text-amber-500" />
                        ) : (
                            <Moon size={18} className="text-primary-600" />
                        )}
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white transition-colors">
                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </span>
                    </div>
                    <div className={`w-8 h-4 rounded-full transition-all relative ${theme === 'dark' ? 'bg-primary-600' : 'bg-slate-300'}`}>
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-md transition-all ${theme === 'dark' ? 'right-0.5' : 'left-0.5'}`} />
                    </div>
                </button>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur">
                <div
                    onClick={() => setIsProfileOpen(true)}
                    className="flex items-center gap-3 mb-4 px-3 py-3 rounded-2xl hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer group border border-transparent hover:border-slate-200 dark:hover:border-slate-700 shadow-sm hover:shadow-md"
                >
                    <div className={`w-10 h-10 rounded-xl ${user?.avatar || 'bg-primary-100 dark:bg-slate-700 text-primary-600 dark:text-white'} flex items-center justify-center text-xs font-black shadow-inner transition-all`}>
                        {user?.name?.[0]}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-black truncate text-slate-800 dark:text-white">{user?.name}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black flex items-center gap-1.5">
                            <User size={10} /> Profile Info
                        </p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-400 rounded-xl transition-all text-xs font-black uppercase tracking-widest border border-red-200 dark:border-red-900/20 shadow-sm hover:shadow-md"
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>

            <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </div>
    );
};

export default Sidebar;
