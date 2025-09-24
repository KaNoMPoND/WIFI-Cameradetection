'use client';

import { useScan } from '../context/ScanContext';

export default function Stats() {
    const { scanStats, devices } = useScan();
    
    const getRiskLevel = () => {
        if (scanStats.highRiskVulnerabilities > 0) return 'High';
        
        const mediumRiskDevices = devices.filter(d => d.risk === 'medium').length;
        if (mediumRiskDevices > 0) return 'Medium';
        
        const lowRiskDevices = devices.filter(d => d.risk === 'low').length;
        if (lowRiskDevices > 0) return 'Low';
        
        return 'Safe';
    };
    
    const getRiskColor = () => {
        const risk = getRiskLevel();
        switch (risk) {
            case 'High': return 'text-red-500';
            case 'Medium': return 'text-yellow-500';
            case 'Low': return 'text-blue-500';
            default: return 'text-green-500';
        }
    };
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8 text-[#8d8e98]">
            <div>
                <div className="text-4xl text-white mb-2">{scanStats.totalDevices}</div>
                <div>Devices Found</div>
            </div>
            <div>
                <div className="text-4xl text-white mb-2">{scanStats.vulnerableDevices}</div>
                <div>Vulnerable Devices</div>
            </div>
            <div>
                <div className="text-4xl text-white mb-2">{scanStats.totalVulnerabilities}</div>
                <div>Vulnerabilities Found</div>
            </div>
            <div>
                <div className={`text-4xl mb-2 ${getRiskColor()}`}>{getRiskLevel()}</div>
                <div>Risk Level</div>
            </div>
            
            {scanStats.lastScanTime && (
                <div className="col-span-full text-center mt-2 text-sm">
                    Last Scan: {scanStats.lastScanTime}
                </div>
            )}
        </div>
    );
} 