'use client';

import React from 'react';
import Navbar from './components/Navbar';
import ScanButton from './components/ScanButton';
import Stats from './components/Stats';
import ResultCard from './components/ResultCard';
import { useScan } from './context/ScanContext';

export default function Home() {
    const { devices } = useScan();  // เพิ่มการใช้ devices จาก context

    return (
        <main className="min-h-screen bg-[#141526] text-white">
            <Navbar />
            
            <div className="max-w-5xl mx-auto pt-24 px-4">
                <div className="bg-[rgba(35,37,57,0.95)] rounded-3xl p-12 mb-8 text-center">
                    <h2 className="text-2xl mb-8">แสกนอุปกรณ์ IoT ในเครือข่าย</h2>
                    <ScanButton />
                    <Stats />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {devices.map((device, index) => (
                        <ResultCard 
                            key={index}
                            title="อุปกรณ์ที่ตรวจพบ"
                            deviceName={device.name}
                            deviceIP={device.ip}
                            status={device.risk === 'high' ? 'เสี่ยง' : 'ปลอดภัย'}
                            showAttackButton={true}
                        />
                    ))}
                    <ResultCard 
                        title="รายละเอียดช่องโหว่"
                        deviceName="Default Password"
                        deviceIP="ความรุนแรง: สูง"
                        status="อันตราย"
                    />
                </div>
            </div>
        </main>
    );
} 