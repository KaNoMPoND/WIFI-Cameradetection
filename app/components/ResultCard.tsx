'use client';

import { useState } from 'react';
import { useScan } from '../context/ScanContext';

interface ResultCardProps {
    deviceId: string;
    title?: string;
    showDetails?: boolean;
}

export default function ResultCard({ 
    deviceId, 
    title,
    showDetails = false
}: ResultCardProps) {
    const { devices, attackDevice, setSelectedDevice } = useScan();
    const [expanded, setExpanded] = useState(false);
    
    // Find device by ID
    const device = devices.find(d => d.id === deviceId);
    
    if (!device) return null;
    
    const { name, ip, type, risk, vulnerabilities, manufacturer, model, mac } = device;
    
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
            case 'high': return 'High Risk';
            case 'medium': return 'Medium Risk';
            case 'low': return 'Low Risk';
            default: return 'Safe';
        }
    };
    
    return (
        <div className="bg-[#1a1b2e] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20">
            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <div className="font-semibold text-lg">{name}</div>
                        <div className="text-sm text-[#8d8e98]">{type}</div>
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs ${getRiskBadgeClass()}`}>
                        {getRiskLabel()}
                    </span>
                </div>
                
                <div className="space-y-1 mb-4 text-sm text-[#8d8e98]">
                    <div className="flex justify-between">
                        <span>IP:</span>
                        <span className="text-white">{ip}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>MAC:</span>
                        <span className="text-white">{mac}</span>
                    </div>
                    {manufacturer && (
                        <div className="flex justify-between">
                            <span>Manufacturer:</span>
                            <span className="text-white">{manufacturer}</span>
                        </div>
                    )}
                    {model && (
                        <div className="flex justify-between">
                            <span>Model:</span>
                            <span className="text-white">{model}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span>Vulnerabilities:</span>
                        <span className="text-white">{vulnerabilities.length} items</span>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                    <button 
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        onClick={handleViewDetails}
                    >
                        View Details
                    </button>
                    
                    {risk !== 'safe' && (
                        <button 
                            className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                            onClick={handleAttack}
                        >
                            Scan Vulnerabilities
                        </button>
                    )}
                    
                    {showDetails && (
                        <button 
                            className="flex-1 bg-[#232539] text-white px-3 py-2 rounded-lg hover:bg-[#2a2d43] transition-colors text-sm"
                            onClick={() => setExpanded(!expanded)}
                        >
                            {expanded ? 'Hide Details' : 'Show Vulnerabilities'}
                        </button>
                    )}
                </div>
                
                {showDetails && (
                    <div className="mt-3">
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
                                                {vuln.severity === 'high' ? 'High' : 
                                                 vuln.severity === 'medium' ? 'Medium' : 'Low'}
                                            </span>
                                        </div>
                                        <div className="text-sm text-[#8d8e98] mt-1">
                                            {vuln.description}
                                        </div>
                                        <div className="text-sm mt-2">
                                            <span className="text-green-400 font-medium">Solution:</span> {vuln.solution}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            <div className="w-full h-1">
                <div className={`h-full ${
                    risk === 'high' ? 'bg-gradient-to-r from-red-500 to-red-700' :
                    risk === 'medium' ? 'bg-gradient-to-r from-yellow-500 to-yellow-700' :
                    risk === 'low' ? 'bg-gradient-to-r from-blue-500 to-blue-700' :
                    'bg-gradient-to-r from-green-500 to-green-700'
                }`}></div>
            </div>
        </div>
    );
} 