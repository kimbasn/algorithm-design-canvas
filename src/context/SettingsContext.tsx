import React, { createContext, useContext, useEffect, useState } from 'react'
import { StorageType } from '@/types/storage'

interface Settings {
    // UI Settings
    sidebarOpen: boolean
    sidebarWidth: string
    // Editor Settings
    fontSize: number
    lineHeight: number
    // Canvas Settings
    defaultCanvasName: string
    autoSave: boolean
    // System Settings (developer controlled)
    storageType: StorageType
}

interface SettingsContextProps {
    settings: Settings
    updateSettings: (newSettings: Partial<Omit<Settings, 'storageType'>>) => void
    resetSettings: () => void
}

const defaultSettings: Settings = {
    sidebarOpen: true,
    sidebarWidth: '16rem',
    fontSize: 14,
    lineHeight: 1.5,
    defaultCanvasName: 'New Canvas',
    autoSave: true,
    // Default to LOCAL storage, can be overridden by environment variable
    storageType: (import.meta.env.VITE_STORAGE_TYPE as StorageType) || StorageType.LOCAL,
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined)

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>(() => {
        // Try to load settings from localStorage on initialization
        const savedSettings = localStorage.getItem('app-settings')
        const parsedSettings = savedSettings ? JSON.parse(savedSettings) : {}

        // Merge saved settings with defaults, but preserve storageType from defaults
        return {
            ...defaultSettings,
            ...parsedSettings,
            storageType: defaultSettings.storageType, // Always use the default storage type
        }
    })

    // Save settings to localStorage whenever they change
    useEffect(() => {
        // Don't save storageType to localStorage
        const { storageType, ...settingsToSave } = settings
        localStorage.setItem('app-settings', JSON.stringify(settingsToSave))
    }, [settings])

    const updateSettings = (newSettings: Partial<Omit<Settings, 'storageType'>>) => {
        setSettings(prev => ({ ...prev, ...newSettings }))
    }

    const resetSettings = () => {
        setSettings(defaultSettings)
    }

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
            {children}
        </SettingsContext.Provider>
    )
}

export const useSettings = () => {
    const context = useContext(SettingsContext)
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider')
    }
    return context
} 