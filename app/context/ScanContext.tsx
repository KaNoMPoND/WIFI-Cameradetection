'use client';

import { createContext, useContext, useState } from 'react';

interface ScanContextType {
    devices: any[];
    scanning: boolean;
    startScan: () => Promise<void>;
    attackDevice: (deviceIP: string) => Promise<void>;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export function ScanProvider({ children }: { children: React.ReactNode }) {
    const [devices, setDevices] = useState([]);
    const [scanning, setScanning] = useState(false);

    const startScan = async () => {
        setScanning(true);
        try {
            const response = await fetch('/api/scan', {
                method: 'POST'
            });
            const data = await response.json();
            setDevices(data.devices);
        } catch (error) {
            console.error('Scan failed:', error);
        }
        setScanning(false);
    };

    const attackDevice = async (deviceIP: string) => {
        try {
            const response = await fetch('/api/attack', {
                method: 'POST',
                body: JSON.stringify({ deviceIP })
            });
            const data = await response.json();
            console.log('Attack result:', data);
        } catch (error) {
            console.error('Attack failed:', error);
        }
    };

    return (
        <ScanContext.Provider value={{ devices, scanning, startScan, attackDevice }}>
            {children}
        </ScanContext.Provider>
    );
}

export function useScan() {
    const context = useContext(ScanContext);
    if (context === undefined) {
        throw new Error('useScan must be used within a ScanProvider');
    }
    return context;
} 