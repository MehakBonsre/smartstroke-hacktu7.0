import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem('stroke_theme') || 'light');

    useEffect(() => {
        const root = window.document.documentElement;
        console.log('Current theme state:', theme);
        if (theme === 'dark') {
            root.classList.add('dark');
            console.log('Added .dark class to documentElement');
        } else {
            root.classList.remove('dark');
            console.log('Removed .dark class from documentElement');
        }
        localStorage.setItem('stroke_theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
