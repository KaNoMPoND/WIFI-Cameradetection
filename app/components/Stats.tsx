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
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 transition-all duration-500 ease-out">
                <div className="bg-gradient-to-br from-[#1a1b2e] to-[#232539] p-4 rounded-xl border border-white/10 shadow-lg transition-all duration-500 ease-out">
                    <div className="text-2xl text-white mb-2 font-bold transition-all duration-500 ease-out">{scanStats.totalDevices}</div>
                    <div className="text-[#8d8e98] font-medium text-xs leading-tight">Devices Found</div>
                </div>
                <div className="bg-gradient-to-br from-[#1a1b2e] to-[#232539] p-4 rounded-xl border border-white/10 shadow-lg transition-all duration-500 ease-out">
                    <div className="text-2xl text-white mb-2 font-bold transition-all duration-500 ease-out">{scanStats.vulnerableDevices}</div>
                    <div className="text-[#8d8e98] font-medium text-xs leading-tight">Vulnerable Devices</div>
                </div>
                <div className="bg-gradient-to-br from-[#1a1b2e] to-[#232539] p-4 rounded-xl border border-white/10 shadow-lg transition-all duration-500 ease-out">
                    <div className="text-2xl text-white mb-2 font-bold transition-all duration-500 ease-out">{scanStats.totalVulnerabilities}</div>
                    <div className="text-[#8d8e98] font-medium text-xs leading-tight">Vulnerabilities Found</div>
                </div>
                <div className="bg-gradient-to-br from-[#1a1b2e] to-[#232539] p-4 rounded-xl border border-white/10 shadow-lg transition-all duration-500 ease-out">
                    <div className={`text-2xl mb-2 font-bold transition-all duration-500 ease-out ${getRiskColor()} text-center`}>{getRiskLevel()}</div>
                    <div className="text-[#8d8e98] font-medium text-xs leading-tight text-center">Risk Level</div>
                </div>
            </div>
            
            {scanStats.lastScanTime && (
                <div className="text-center pt-6 border-t border-white/10">
                    <div className="text-sm text-[#8d8e98] bg-[#1a1b2e] px-4 py-2 rounded-lg inline-block border border-white/10">
                        Last Scan: {scanStats.lastScanTime}
                    </div>
                </div>
            )}
        </div>
    );
} 