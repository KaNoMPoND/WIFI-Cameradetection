'use client';

import { createContext, useContext, useState } from 'react';

interface Device {
  id: string;
  name: string;
  ip: string;
  mac: string;
  type: string;
  risk: 'high' | 'medium' | 'low' | 'safe';
  vulnerabilities: Vulnerability[];
  lastScan?: string;
  isOnline: boolean;
}

interface Vulnerability {
  id: string;
  name: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  solution: string;
}

interface ScanStats {
  totalDevices: number;
  vulnerableDevices: number;
  totalVulnerabilities: number;
  highRiskVulnerabilities: number;
  scanProgress: number;
  lastScanTime: string | null;
  networkName: string;
}

interface ScanContextType {
  devices: Device[];
  scanning: boolean;
  scanStats: ScanStats;
  selectedDevice: Device | null;
  setSelectedDevice: (device: Device | null) => void;
  startScan: () => Promise<void>;
  attackDevice: (deviceIP: string) => Promise<void>;
  cancelScan: () => void;
}

// Mock device data
const mockDevices: Device[] = [
  {
    id: '1',
    name: 'Router TP-Link',
    ip: '192.168.1.1',
    mac: '00:11:22:33:44:55',
    type: 'Router',
    risk: 'high',
    isOnline: true,
    vulnerabilities: [
      {
        id: 'v1',
        name: 'Default Password',
        description: 'This device uses default factory password, making it easy for attackers to access',
        severity: 'high',
        solution: 'Change default password to a complex one'
      },
      {
        id: 'v2',
        name: 'Outdated Firmware',
        description: 'Current firmware has known security vulnerabilities',
        severity: 'medium',
        solution: 'Update firmware to the latest version'
      }
    ]
  },
  {
    id: '2',
    name: 'IP Camera Xiaomi',
    ip: '192.168.1.10',
    mac: 'AA:BB:CC:DD:EE:FF',
    type: 'Camera',
    risk: 'medium',
    isOnline: true,
    vulnerabilities: [
      {
        id: 'v3',
        name: 'Unencrypted Stream',
        description: 'Camera sends video stream without encryption',
        severity: 'medium',
        solution: 'Enable HTTPS/TLS encryption in camera settings'
      }
    ]
  },
  {
    id: '3',
    name: 'Smart TV Samsung',
    ip: '192.168.1.15',
    mac: '12:34:56:78:90:AB',
    type: 'Smart TV',
    risk: 'low',
    isOnline: true,
    vulnerabilities: [
      {
        id: 'v4',
        name: 'Unnecessary Open Ports',
        description: 'Found unnecessary open ports that could be used as attack vectors',
        severity: 'low',
        solution: 'Close unnecessary ports in device settings'
      }
    ]
  },
  {
    id: '4',
    name: 'Smart Bulb Philips Hue',
    ip: '192.168.1.20',
    mac: 'FF:EE:DD:CC:BB:AA',
    type: 'Smart Light',
    risk: 'safe',
    isOnline: true,
    vulnerabilities: []
  },
  {
    id: '5',
    name: 'Smart Lock Yale',
    ip: '192.168.1.25',
    mac: 'AA:BB:CC:11:22:33',
    type: 'Smart Lock',
    risk: 'high',
    isOnline: true,
    vulnerabilities: [
      {
        id: 'v5',
        name: 'Unencrypted Communication',
        description: 'Device sends data without encryption, making it possible for data to be intercepted',
        severity: 'high',
        solution: 'Enable encryption in device settings or contact manufacturer for updates'
      }
    ]
  }
];

const initialScanStats: ScanStats = {
  totalDevices: 0,
  vulnerableDevices: 0,
  totalVulnerabilities: 0,
  highRiskVulnerabilities: 0,
  scanProgress: 0,
  lastScanTime: null,
  networkName: 'Home Network'
};

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export function ScanProvider({ children }: { children: React.ReactNode }) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStats, setScanStats] = useState<ScanStats>(initialScanStats);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const updateScanStats = (currentDevices: Device[]) => {
    const vulnerableDevices = currentDevices.filter(d => d.vulnerabilities.length > 0);
    const totalVulnerabilities = currentDevices.reduce((sum, device) => sum + device.vulnerabilities.length, 0);
    const highRiskVulnerabilities = currentDevices.reduce((sum, device) => {
      return sum + device.vulnerabilities.filter(v => v.severity === 'high').length;
    }, 0);

    setScanStats(prev => ({
      ...prev,
      totalDevices: currentDevices.length,
      vulnerableDevices: vulnerableDevices.length,
      totalVulnerabilities,
      highRiskVulnerabilities,
      lastScanTime: new Date().toLocaleString('th-TH'),
    }));
  };

  const startScan = async () => {
    // Reset initial values
    setScanning(true);
    setScanProgress(0);
    setDevices([]);
    setScanStats(prev => ({...prev, scanProgress: 0}));
    
    try {
      // Start mock scan
      console.log('Starting mock scan...');
      
      // Simulate progress while scanning
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev < 90) return prev + 10;
          return prev;
        });
      }, 1000);
      
      // Use mock data instead of real WiFi scan
      throw new Error('Using mock data');
      
      clearInterval(progressInterval);
      
    } catch (error) {
      console.log('Using mock data for demonstration...');
      
      // Use mock data as fallback
      for (let i = 10; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setScanProgress(i);
        
        if (i === 20) {
          setDevices([mockDevices[0]]);
        } else if (i === 40) {
          setDevices([mockDevices[0], mockDevices[1]]);
        } else if (i === 60) {
          setDevices([mockDevices[0], mockDevices[1], mockDevices[2]]);
        } else if (i === 80) {
          setDevices([mockDevices[0], mockDevices[1], mockDevices[2], mockDevices[3]]);
        } else if (i === 100) {
          setDevices(mockDevices);
          updateScanStats(mockDevices);
        }
      }
    } finally {
      setScanning(false);
    }
  };

  const cancelScan = () => {
    setScanning(false);
    setScanProgress(0);
    setDevices([]);
    setScanStats(prev => ({...prev, scanProgress: 0}));
  };

  const attackDevice = async (deviceIP: string) => {
    try {
      // Simulate attack
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`Simulated attack on device with IP: ${deviceIP}`);
      
      // Update device data (assuming attack was successful)
      alert(`Vulnerability scan of device ${deviceIP} completed. This device has high risk.`);
    } catch (error) {
      console.error('Attack failed:', error);
    }
  };

  return (
    <ScanContext.Provider 
      value={{ 
        devices, 
        scanning, 
        scanStats: { ...scanStats, scanProgress }, 
        selectedDevice,
        setSelectedDevice,
        startScan, 
        attackDevice,
        cancelScan
      }}
    >
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