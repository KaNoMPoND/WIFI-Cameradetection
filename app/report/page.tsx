'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';

interface Vulnerability {
  id: string;
  name: string;
  deviceType: string;
  deviceIP: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  description: string;
  solution: string;
}

export default function Report() {
  const searchParams = useSearchParams();
  const scanId = searchParams.get('id') || 'SC-001';
  
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    id: scanId,
    date: '15/05/2023',
    time: '14:30',
    duration: '00:05:32',
    deviceScanned: 8,
    vulnerabilitiesFound: 12,
    criticalVulnerabilities: 4,
    highRiskDevices: 3,
    networkCoverage: 95
  });
  
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([
    {
      id: 'VLN-001',
      name: 'Default Password',
      deviceType: 'Router',
      deviceIP: '192.168.1.1',
      riskLevel: 'High',
      description: 'This device uses default factory password, making it easy for attackers to access',
      solution: 'Change password to a complex one that is not the default'
    },
    {
      id: 'VLN-002',
      name: 'Outdated Firmware',
      deviceType: 'IP Camera',
      deviceIP: '192.168.1.10',
      riskLevel: 'High',
      description: 'Device uses outdated firmware with known security vulnerabilities',
      solution: 'Update firmware to the latest version from manufacturer'
    },
    {
      id: 'VLN-003',
      name: 'Unencrypted Communication',
      deviceType: 'Smart Lock',
      deviceIP: '192.168.1.15',
      riskLevel: 'High',
      description: 'Device sends data without encryption, making it possible for data to be intercepted',
      solution: 'Enable encryption in device settings or contact manufacturer for updates'
    },
    {
      id: 'VLN-004',
      name: 'Open Ports',
      deviceType: 'Smart TV',
      deviceIP: '192.168.1.20',
      riskLevel: 'Medium',
      description: 'Found unnecessary open ports that could be used as attack vectors',
      solution: 'Close unnecessary ports in device settings or use firewall to limit access'
    }
  ]);
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const getRiskBadgeClass = (risk: string) => {
    switch(risk) {
      case 'High':
        return 'bg-red-500/20 text-red-400 border border-red-500';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500';
      case 'Low':
        return 'bg-green-500/20 text-green-400 border border-green-500';
      default:
        return 'bg-gray-500/20 text-gray-400 border border-gray-500';
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#141526] text-white">
        <Navbar />
        
        <div className="max-w-6xl mx-auto pt-24 px-4 pb-12">
          <div className="bg-[rgba(35,37,57,0.95)] rounded-3xl p-8 mb-8 flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p>Loading report data...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#141526] text-white">
      <Navbar />
      
      <div className="max-w-6xl mx-auto pt-24 px-4 pb-12">
        <div className="bg-[rgba(35,37,57,0.95)] rounded-3xl p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Scan Report {reportData.id}</h1>
            <Link 
              href="/scan-history" 
              className="bg-[#1c1e30] px-4 py-2 rounded-lg hover:bg-[#2a2d43] transition-colors"
            >
              Back to Scan History
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#1c1e30] p-4 rounded-lg">
              <div className="text-gray-400 mb-1 text-sm">Date and Time</div>
              <div>{reportData.date} - {reportData.time}</div>
              <div className="text-xs text-gray-500">Duration {reportData.duration}</div>
            </div>
            
            <div className="bg-[#1c1e30] p-4 rounded-lg">
              <div className="text-gray-400 mb-1 text-sm">Devices Scanned</div>
              <div className="text-2xl font-bold">{reportData.deviceScanned}</div>
              <div className="text-xs text-gray-500">High Risk Devices: {reportData.highRiskDevices}</div>
            </div>
            
            <div className="bg-[#1c1e30] p-4 rounded-lg">
              <div className="text-gray-400 mb-1 text-sm">Vulnerabilities Found</div>
              <div className="text-2xl font-bold">{reportData.vulnerabilitiesFound}</div>
              <div className="text-xs text-gray-500">Critical Vulnerabilities: {reportData.criticalVulnerabilities}</div>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Found Vulnerabilities</h2>
          
          <div className="space-y-4 mb-8">
            {vulnerabilities.map((vuln) => (
              <div key={vuln.id} className="bg-[#1c1e30] p-4 rounded-lg">
                <div className="flex flex-wrap justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-medium">{vuln.name}</h3>
                    <div className="text-sm text-gray-400">
                      {vuln.deviceType} - {vuln.deviceIP}
                    </div>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs ${getRiskBadgeClass(vuln.riskLevel)}`}>
                    {vuln.riskLevel}
                  </span>
                </div>
                
                <div className="mb-2">
                  <div className="text-sm font-medium mb-1">Details</div>
                  <p className="text-sm text-gray-300">{vuln.description}</p>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">Solution</div>
                  <p className="text-sm text-gray-300">{vuln.solution}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between">
            <button className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Download PDF Report
            </button>
            <button className="bg-[#1c1e30] px-6 py-2 rounded-lg hover:bg-[#2a2d43] transition-colors">
              Send Report via Email
            </button>
          </div>
        </div>
      </div>
    </main>
  );
} 