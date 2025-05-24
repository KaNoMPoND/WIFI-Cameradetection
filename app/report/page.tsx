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
  riskLevel: 'สูง' | 'กลาง' | 'ต่ำ';
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
      riskLevel: 'สูง',
      description: 'อุปกรณ์นี้ใช้รหัสผ่านเริ่มต้นจากโรงงาน ทำให้ผู้ไม่หวังดีสามารถเข้าถึงได้ง่าย',
      solution: 'เปลี่ยนรหัสผ่านเป็นรหัสที่ซับซ้อนและไม่ใช่ค่าเริ่มต้น'
    },
    {
      id: 'VLN-002',
      name: 'Outdated Firmware',
      deviceType: 'IP Camera',
      deviceIP: '192.168.1.10',
      riskLevel: 'สูง',
      description: 'อุปกรณ์ใช้เฟิร์มแวร์เวอร์ชันเก่าที่มีช่องโหว่ด้านความปลอดภัยที่ทราบกันดี',
      solution: 'อัพเดทเฟิร์มแวร์เป็นเวอร์ชันล่าสุดจากผู้ผลิต'
    },
    {
      id: 'VLN-003',
      name: 'Unencrypted Communication',
      deviceType: 'Smart Lock',
      deviceIP: '192.168.1.15',
      riskLevel: 'สูง',
      description: 'อุปกรณ์ส่งข้อมูลโดยไม่มีการเข้ารหัส ทำให้ข้อมูลอาจถูกดักจับได้',
      solution: 'เปิดใช้งานการเข้ารหัสในการตั้งค่าอุปกรณ์ หรือติดต่อผู้ผลิตเพื่อขอการอัพเดท'
    },
    {
      id: 'VLN-004',
      name: 'Open Ports',
      deviceType: 'Smart TV',
      deviceIP: '192.168.1.20',
      riskLevel: 'กลาง',
      description: 'พบพอร์ตที่ไม่จำเป็นเปิดอยู่ ซึ่งอาจถูกใช้เป็นช่องทางโจมตี',
      solution: 'ปิดพอร์ตที่ไม่จำเป็นในการตั้งค่าอุปกรณ์หรือใช้ไฟร์วอลล์เพื่อจำกัดการเข้าถึง'
    }
  ]);
  
  useEffect(() => {
    // จำลองการโหลดข้อมูล
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const getRiskBadgeClass = (risk: string) => {
    switch(risk) {
      case 'สูง':
        return 'bg-red-500/20 text-red-400 border border-red-500';
      case 'กลาง':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500';
      case 'ต่ำ':
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
              <p>กำลังโหลดข้อมูลรายงาน...</p>
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
            <h1 className="text-2xl font-bold">รายงานการแสกน {reportData.id}</h1>
            <Link 
              href="/scan-history" 
              className="bg-[#1c1e30] px-4 py-2 rounded-lg hover:bg-[#2a2d43] transition-colors"
            >
              กลับไปหน้าประวัติการแสกน
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#1c1e30] p-4 rounded-lg">
              <div className="text-gray-400 mb-1 text-sm">วันที่และเวลา</div>
              <div>{reportData.date} - {reportData.time}</div>
              <div className="text-xs text-gray-500">ระยะเวลา {reportData.duration}</div>
            </div>
            
            <div className="bg-[#1c1e30] p-4 rounded-lg">
              <div className="text-gray-400 mb-1 text-sm">อุปกรณ์ที่ตรวจพบ</div>
              <div className="text-2xl font-bold">{reportData.deviceScanned}</div>
              <div className="text-xs text-gray-500">อุปกรณ์ที่มีความเสี่ยง: {reportData.highRiskDevices}</div>
            </div>
            
            <div className="bg-[#1c1e30] p-4 rounded-lg">
              <div className="text-gray-400 mb-1 text-sm">ช่องโหว่ที่ตรวจพบ</div>
              <div className="text-2xl font-bold">{reportData.vulnerabilitiesFound}</div>
              <div className="text-xs text-gray-500">ช่องโหว่ที่วิกฤติ: {reportData.criticalVulnerabilities}</div>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">ช่องโหว่ที่พบ</h2>
          
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
                  <div className="text-sm font-medium mb-1">รายละเอียด</div>
                  <p className="text-sm text-gray-300">{vuln.description}</p>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">วิธีแก้ไข</div>
                  <p className="text-sm text-gray-300">{vuln.solution}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between">
            <button className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              ดาวน์โหลดรายงาน PDF
            </button>
            <button className="bg-[#1c1e30] px-6 py-2 rounded-lg hover:bg-[#2a2d43] transition-colors">
              ส่งรายงานทางอีเมล
            </button>
          </div>
        </div>
      </div>
    </main>
  );
} 