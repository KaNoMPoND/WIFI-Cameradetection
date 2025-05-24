'use client';

import { useScan } from '../context/ScanContext';
import { useState } from 'react';

interface ResultCardProps {
    deviceId: string;
    title: string;
    showDetails?: boolean;
}

export default function ResultCard({ 
    deviceId, 
    title,
    showDetails = false
}: ResultCardProps) {
    const { devices, attackDevice, setSelectedDevice } = useScan();
    const [expanded, setExpanded] = useState(false);
    
    // หาอุปกรณ์จาก ID
    const device = devices.find(d => d.id === deviceId);
    
    if (!device) return null;
    
    const { name, ip, type, risk, vulnerabilities } = device;
    
    const handleAttack = () => {
        attackDevice(ip);
    };
    
    const handleViewDetails = () => {
        setSelectedDevice(device);
    };
    
    const getRiskBadgeClass = () => {
        switch(risk) {
            case 'high':
                return 'bg-red-500/20 text-red-400 border border-red-500';
            case 'medium':
                return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500';
            case 'low':
                return 'bg-blue-500/20 text-blue-400 border border-blue-500';
            default:
                return 'bg-green-500/20 text-green-400 border border-green-500';
        }
    };
    
    const getRiskLabel = () => {
        switch(risk) {
            case 'high': return 'เสี่ยงสูง';
            case 'medium': return 'เสี่ยงปานกลาง';
            case 'low': return 'เสี่ยงต่ำ';
            default: return 'ปลอดภัย';
        }
    };

    return (
        <div className="bg-[#1a1b2e] p-6 rounded-xl">
            <h3 className="text-[#8d8e98] text-sm uppercase mb-4">{title}</h3>
            <div className="bg-[#232539] p-4 rounded-lg mb-3">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <div className="font-bold text-lg">{name}</div>
                        <div className="text-[#8d8e98] text-sm">
                            <span className="inline-block mr-3">{ip}</span>
                            <span className="inline-block">{type}</span>
                        </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${getRiskBadgeClass()}`}>
                        {getRiskLabel()}
                    </span>
                </div>
                
                {(vulnerabilities.length > 0 || expanded) && (
                    <div className={`mt-3 pt-3 border-t border-[#2a2d43] ${expanded ? 'block' : ''}`}>
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-sm font-semibold">
                                ช่องโหว่ที่พบ: {vulnerabilities.length}
                            </div>
                            <button 
                                onClick={() => setExpanded(!expanded)}
                                className="text-sm text-blue-400 hover:text-blue-300"
                            >
                                {expanded ? 'ซ่อน' : 'แสดงเพิ่มเติม'}
                            </button>
                        </div>
                        
                        {expanded && (
                            <div className="space-y-3 mt-2">
                                {vulnerabilities.map(vuln => (
                                    <div key={vuln.id} className="bg-[#1a1b2e] p-3 rounded">
                                        <div className="flex justify-between items-start">
                                            <div className="font-medium">{vuln.name}</div>
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                                                vuln.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                                                vuln.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-blue-500/20 text-blue-400'
                                            }`}>
                                                {vuln.severity === 'high' ? 'สูง' : 
                                                 vuln.severity === 'medium' ? 'กลาง' : 'ต่ำ'}
                                            </span>
                                        </div>
                                        <div className="text-sm text-[#8d8e98] mt-1">
                                            {vuln.description}
                                        </div>
                                        <div className="text-sm mt-2">
                                            <span className="text-green-400 font-medium">วิธีแก้ไข:</span> {vuln.solution}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            <div className="flex space-x-2">
                {risk !== 'safe' && (
                    <button 
                        onClick={handleAttack}
                        className="bg-red-600 text-white px-4 py-2 rounded 
                                 hover:bg-red-700 transition-colors flex-1"
                    >
                        ทดสอบการโจมตี
                    </button>
                )}
                
                <button 
                    onClick={handleViewDetails}
                    className="bg-[#3498db] text-white px-4 py-2 rounded 
                             hover:bg-[#2980b9] transition-colors flex-1"
                >
                    ดูรายละเอียด
                </button>
            </div>
        </div>
    );
} 