import { useState, useEffect } from 'react';

// broad cast channel is used so we can listen to theme changes in other tabs
const channel = new BroadcastChannel('appvantage.themeMode');

// listeners is used to listen to theme changes in the same tab
const listeners = new Set<(theme: ThemeMode) => void>();

// initializeThemeMode is used to set the theme mode on the document element
export const initializeThemeMode = () => {
    const themeMode = getThemeMode();
    const isDarkMode = themeMode === 'dark' || (themeMode === 'system' && isSystemDarkMode());
    document.documentElement.classList.toggle('dark', isDarkMode);
};

// turnLightMode, turnDarkMode, and turnSystemMode are used to set the theme mode
export const turnLightMode = () => {
    window.localStorage.setItem('theme', 'light');
    listeners.forEach(listener => listener('light'));
    channel.postMessage('light' as ThemeMode);
    initializeThemeMode();
};

export const turnDarkMode = () => {
    window.localStorage.setItem('theme', 'dark');
    listeners.forEach(listener => listener('dark'));
    channel.postMessage('dark' as ThemeMode);
    initializeThemeMode();
};

export const turnSystemMode = () => {
    window.localStorage.removeItem('theme');
    listeners.forEach(listener => listener('system'));
    channel.postMessage('system' as ThemeMode);
    initializeThemeMode();
};

// isSystemDarkMode is used to check if the system is in dark mode
export const isSystemDarkMode = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

// getSystemThemeMode is used to get the system theme mode
export type ThemeMode = 'light' | 'dark' | 'system';

// getThemeMode is used to get the theme mode from local storage or system preference
export const getThemeMode = (): ThemeMode => {
    const themeFromLocalStorage = window.localStorage.getItem('theme');
    const isCypress = 'Cypress' in window;

    if (themeFromLocalStorage) {
        return themeFromLocalStorage as ThemeMode;
    }

    if (isCypress) {
        // Cypress does not support media queries
        return 'light';
    }

    return 'system';
};

// useThemeMode is a custom hook that returns the current theme mode
export const useThemeMode = () => {
    const [themeMode, setThemeMode] = useState<ThemeMode>(getThemeMode());

    useEffect(() => {
        const handleThemeChangeFromBroadcast = (event: MessageEvent<ThemeMode>) => setThemeMode(event.data);
        const handleThemeChangeFromLocal = (value: ThemeMode) => setThemeMode(value);

        channel.addEventListener('message', handleThemeChangeFromBroadcast);
        listeners.add(handleThemeChangeFromLocal);

        return () => {
            channel.removeEventListener('message', handleThemeChangeFromBroadcast);
            listeners.delete(handleThemeChangeFromLocal);
        };
    }, [setThemeMode]);

    return themeMode;
};

// listen to theme changes from the system or from other tabs
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
mediaQuery.addEventListener('change', initializeThemeMode);
channel.addEventListener('message', initializeThemeMode);
