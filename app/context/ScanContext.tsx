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

// ข้อมูลอุปกรณ์จำลอง
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
        description: 'อุปกรณ์นี้ใช้รหัสผ่านเริ่มต้นจากโรงงาน ทำให้ผู้ไม่หวังดีสามารถเข้าถึงได้ง่าย',
        severity: 'high',
        solution: 'เปลี่ยนรหัสผ่านเริ่มต้นเป็นรหัสผ่านที่ซับซ้อน'
      },
      {
        id: 'v2',
        name: 'Outdated Firmware',
        description: 'เฟิร์มแวร์ปัจจุบันมีช่องโหว่ด้านความปลอดภัยที่รู้จักกัน',
        severity: 'medium',
        solution: 'อัปเดตเฟิร์มแวร์เป็นเวอร์ชันล่าสุด'
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
        description: 'กล้องส่งวิดีโอสตรีมโดยไม่มีการเข้ารหัส',
        severity: 'medium',
        solution: 'เปิดใช้งานการเข้ารหัส HTTPS/TLS ในการตั้งค่ากล้อง'
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
        description: 'พบพอร์ตที่ไม่จำเป็นเปิดอยู่ซึ่งอาจถูกใช้เป็นช่องทางโจมตี',
        severity: 'low',
        solution: 'ปิดพอร์ตที่ไม่จำเป็นในการตั้งค่าอุปกรณ์'
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
        description: 'อุปกรณ์ส่งข้อมูลโดยไม่มีการเข้ารหัส ทำให้ข้อมูลอาจถูกดักจับได้',
        severity: 'high',
        solution: 'เปิดใช้งานการเข้ารหัสในการตั้งค่าอุปกรณ์ หรือติดต่อผู้ผลิตเพื่อขอการอัพเดท'
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
    // รีเซ็ตค่าเริ่มต้น
    setScanning(true);
    setScanProgress(0);
    setDevices([]);
    setScanStats(prev => ({...prev, scanProgress: 0}));
    
    let isCancelled = false;
    
    // จำลองการแสกนอุปกรณ์ทีละชิ้น
    for (let i = 10; i <= 100; i += 10) {
      if (isCancelled) break;
      
      // จำลองการแสกน
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // อัพเดทความคืบหน้า
      setScanProgress(i);
      setScanStats(prev => ({...prev, scanProgress: i}));
      
      // เพิ่มอุปกรณ์ตามความคืบหน้า
      if (i === 20) {
        setDevices([mockDevices[0]]);
      } else if (i === 40) {
        setDevices([mockDevices[0], mockDevices[1]]);
      } else if (i === 60) {
        setDevices([mockDevices[0], mockDevices[1], mockDevices[2]]);
      } else if (i === 80) {
        setDevices([mockDevices[0], mockDevices[1], mockDevices[2], mockDevices[3]]);
      } else if (i === 100) {
        // เมื่อสแกนเสร็จสิ้น แสดงอุปกรณ์ทั้งหมด
        setDevices(mockDevices);
        // อัพเดทสถิติการสแกน
        updateScanStats(mockDevices);
      }
    }
    
    // เมื่อสแกนเสร็จสิ้น
    setScanning(false);
  };

  const cancelScan = () => {
    setScanning(false);
    setScanProgress(0);
    setDevices([]);
    setScanStats(prev => ({...prev, scanProgress: 0}));
  };

  const attackDevice = async (deviceIP: string) => {
    try {
      // จำลองการโจมตี
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`Simulated attack on device with IP: ${deviceIP}`);
      
      // อัปเดทข้อมูลอุปกรณ์ (สมมติว่าการโจมตีสำเร็จ)
      alert(`การทดสอบการโจมตีอุปกรณ์ ${deviceIP} สำเร็จ อุปกรณ์นี้มีความเสี่ยงสูง`);
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