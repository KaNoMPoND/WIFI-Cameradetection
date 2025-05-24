'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';

interface ScanRecord {
  id: string;
  date: string;
  time: string;
  deviceCount: number;
  vulnerabilityCount: number;
  riskLevel: 'สูง' | 'กลาง' | 'ต่ำ';
  status: 'เสร็จสิ้น' | 'กำลังดำเนินการ';
}

export default function ScanHistory() {
  const [scanRecords, setScanRecords] = useState<ScanRecord[]>([
    {
      id: 'SC-001',
      date: '15/05/2023',
      time: '14:30',
      deviceCount: 8,
      vulnerabilityCount: 12,
      riskLevel: 'สูง',
      status: 'เสร็จสิ้น'
    },
    {
      id: 'SC-002',
      date: '18/05/2023',
      time: '09:15',
      deviceCount: 5,
      vulnerabilityCount: 3,
      riskLevel: 'กลาง',
      status: 'เสร็จสิ้น'
    },
    {
      id: 'SC-003',
      date: '20/05/2023',
      time: '16:45',
      deviceCount: 10,
      vulnerabilityCount: 0,
      riskLevel: 'ต่ำ',
      status: 'เสร็จสิ้น'
    },
    {
      id: 'SC-004',
      date: '22/05/2023',
      time: '11:30',
      deviceCount: 12,
      vulnerabilityCount: 8,
      riskLevel: 'สูง',
      status: 'เสร็จสิ้น'
    }
  ]);

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

  return (
    <main className="min-h-screen bg-[#141526] text-white">
      <Navbar />
      
      <div className="max-w-6xl mx-auto pt-24 px-4 pb-12">
        <div className="bg-[rgba(35,37,57,0.95)] rounded-3xl p-8 mb-8">
          <h1 className="text-2xl font-bold mb-6">ประวัติการแสกน</h1>
          
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              <button className="bg-[#1c1e30] px-4 py-2 rounded-lg hover:bg-[#2a2d43] transition-colors">
                ทั้งหมด
              </button>
              <button className="bg-[#1c1e30] px-4 py-2 rounded-lg hover:bg-[#2a2d43] transition-colors">
                ความเสี่ยงสูง
              </button>
              <button className="bg-[#1c1e30] px-4 py-2 rounded-lg hover:bg-[#2a2d43] transition-colors">
                7 วันล่าสุด
              </button>
            </div>
            <div>
              <input 
                type="text" 
                placeholder="ค้นหา" 
                className="bg-[#1c1e30] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#2a2d43]">
                  <th className="py-3 px-4 text-left font-medium">รหัส</th>
                  <th className="py-3 px-4 text-left font-medium">วันที่</th>
                  <th className="py-3 px-4 text-left font-medium">เวลา</th>
                  <th className="py-3 px-4 text-left font-medium">อุปกรณ์</th>
                  <th className="py-3 px-4 text-left font-medium">ช่องโหว่</th>
                  <th className="py-3 px-4 text-left font-medium">ความเสี่ยง</th>
                  <th className="py-3 px-4 text-left font-medium">สถานะ</th>
                  <th className="py-3 px-4 text-left font-medium">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {scanRecords.map((record) => (
                  <tr key={record.id} className="border-b border-[#2a2d43] hover:bg-[#1c1e30]">
                    <td className="py-4 px-4">{record.id}</td>
                    <td className="py-4 px-4">{record.date}</td>
                    <td className="py-4 px-4">{record.time}</td>
                    <td className="py-4 px-4">{record.deviceCount}</td>
                    <td className="py-4 px-4">{record.vulnerabilityCount}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs ${getRiskBadgeClass(record.riskLevel)}`}>
                        {record.riskLevel}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400 border border-blue-500">
                        {record.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Link href={`/report?id=${record.id}`} className="text-blue-500 hover:text-blue-400 mr-4">
                        ดูรายงาน
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-400">
              แสดง 1-4 จาก 4 รายการ
            </div>
            <div className="flex space-x-2">
              <button className="bg-[#1c1e30] px-3 py-1 rounded-lg hover:bg-[#2a2d43] transition-colors disabled:opacity-50" disabled>
                ก่อนหน้า
              </button>
              <button className="bg-blue-600 px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors">
                1
              </button>
              <button className="bg-[#1c1e30] px-3 py-1 rounded-lg hover:bg-[#2a2d43] transition-colors disabled:opacity-50" disabled>
                ถัดไป
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 