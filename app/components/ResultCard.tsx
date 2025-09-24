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
        <div className="bg-gradient-to-br from-[#1a1b2e] to-[#232539] rounded-xl overflow-hidden transition-all duration-500 ease-out hover:shadow-xl hover:shadow-blue-900/20 border border-white/10 hover:border-white/20 group">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="font-semibold text-lg group-hover:text-blue-300 transition-colors duration-500 ease-out">{name}</div>
                        <div className="text-sm text-[#8d8e98]">{type}</div>
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRiskBadgeClass()}`}>
                        {getRiskLabel()}
                    </span>
                </div>
                
                <div className="space-y-2 mb-6 text-sm text-[#8d8e98]">
                    <div className="flex justify-between items-center">
                        <span className="font-medium">IP:</span>
                        <span className="text-white font-mono text-xs">{ip}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-medium">MAC:</span>
                        <span className="text-white font-mono text-xs">{mac}</span>
                    </div>
                    {manufacturer && (
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Manufacturer:</span>
                            <span className="text-white text-xs truncate ml-2">{manufacturer}</span>
                        </div>
                    )}
                    {model && (
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Model:</span>
                            <span className="text-white text-xs truncate ml-2">{model}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center">
                        <span className="font-medium">Vulnerabilities:</span>
                        <span className="text-white text-xs">{vulnerabilities.length} items</span>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                        className="flex-1 bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl border border-blue-500/30 h-12 flex items-center justify-center"
                        onClick={handleViewDetails}
                    >
                        View Details
                    </button>
                    
                    {risk !== 'safe' && (
                        <button 
                            className="flex-1 bg-red-600 text-white px-4 rounded-lg hover:bg-red-700 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl border border-red-500/30 h-12 flex items-center justify-center"
                            onClick={handleAttack}
                        >
                            Scan Vulnerabilities
                        </button>
                    )}
                    
                    {showDetails && (
                        <button 
                            className="flex-1 bg-[#232539] text-white px-4 rounded-lg hover:bg-[#2a2d43] transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl border border-white/10 h-12 flex items-center justify-center"
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
        </div>
    );
} 