'use client';

import { useScan } from '../context/ScanContext';

export default function Stats() {
    const { scanStats, devices } = useScan();
    
    const getRiskLevel = () => {
        if (scanStats.highRiskVulnerabilities > 0) return 'สูง';
        
        const mediumRiskDevices = devices.filter(d => d.risk === 'medium').length;
        if (mediumRiskDevices > 0) return 'ปานกลาง';
        
        const lowRiskDevices = devices.filter(d => d.risk === 'low').length;
        if (lowRiskDevices > 0) return 'ต่ำ';
        
        return 'ปลอดภัย';
    };
    
    const getRiskColor = () => {
        const risk = getRiskLevel();
        switch (risk) {
            case 'สูง': return 'text-red-500';
            case 'ปานกลาง': return 'text-yellow-500';
            case 'ต่ำ': return 'text-blue-500';
            default: return 'text-green-500';
        }
    };
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8 text-[#8d8e98]">
            <div>
                <div className="text-4xl text-white mb-2">{scanStats.totalDevices}</div>
                <div>อุปกรณ์ที่พบ</div>
            </div>
            <div>
                <div className="text-4xl text-white mb-2">{scanStats.vulnerableDevices}</div>
                <div>อุปกรณ์ที่มีความเสี่ยง</div>
            </div>
            <div>
                <div className="text-4xl text-white mb-2">{scanStats.totalVulnerabilities}</div>
                <div>ช่องโหว่ที่ตรวจพบ</div>
            </div>
            <div>
                <div className={`text-4xl mb-2 ${getRiskColor()}`}>{getRiskLevel()}</div>
                <div>ระดับความเสี่ยง</div>
            </div>
            
            {scanStats.lastScanTime && (
                <div className="col-span-full text-center mt-2 text-sm">
                    แสกนครั้งล่าสุด: {scanStats.lastScanTime}
                </div>
            )}
        </div>
    );
} 