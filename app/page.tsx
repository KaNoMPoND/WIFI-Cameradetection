'use client';

import React from 'react';
import Navbar from './components/Navbar';
import ScanButton from './components/ScanButton';
import Stats from './components/Stats';
import ResultCard from './components/ResultCard';
import DeviceDetails from './components/DeviceDetails';
import { useScan } from './context/ScanContext';

export default function Home() {
    const { devices, selectedDevice, scanStats } = useScan();

    return (
        <main className="min-h-screen bg-[#141526] text-white">
            <Navbar />
            
            <div className="max-w-6xl mx-auto pt-24 px-4 pb-12">
                <div className="bg-[rgba(35,37,57,0.95)] rounded-3xl p-8 mb-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2">IoT Security Scanner</h1>
                        <p className="text-gray-400">ตรวจสอบความปลอดภัยของอุปกรณ์ IoT ในเครือข่ายของคุณ</p>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="flex-1 w-full md:w-auto flex justify-center mb-8 md:mb-0">
                            <ScanButton />
                        </div>
                        
                        <div className="flex-1 w-full">
                            <Stats />
                        </div>
                    </div>
                </div>
                
                {scanStats.scanProgress > 0 && (
                    <div className="mb-6">
                        <div className="flex justify-between text-sm text-[#8d8e98] mb-2">
                            <span>เครือข่าย: {scanStats.networkName}</span>
                            <span>อุปกรณ์ทั้งหมด: {scanStats.totalDevices}</span>
                        </div>
                        
                        {scanStats.scanProgress === 100 && devices.length > 0 && (
                            <div className="bg-[rgba(35,37,57,0.95)] rounded-xl p-6 mb-6">
                                <h2 className="text-xl font-semibold mb-4">อุปกรณ์ที่พบในเครือข่าย</h2>
                                <p className="text-gray-400 mb-6">พบอุปกรณ์ทั้งหมด {scanStats.totalDevices} รายการ, มีความเสี่ยง {scanStats.vulnerableDevices} รายการ</p>
                            </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {devices.map((device) => (
                                <ResultCard 
                                    key={device.id}
                                    deviceId={device.id}
                                    title={device.type}
                                />
                            ))}
                            
                            {devices.length === 0 && scanStats.scanProgress < 100 && (
                                <div className="col-span-full bg-[#1a1b2e] p-6 rounded-xl text-center">
                                    <p className="text-[#8d8e98]">กำลังค้นหาอุปกรณ์...</p>
                                </div>
                            )}
                            
                            {devices.length === 0 && scanStats.scanProgress === 100 && (
                                <div className="col-span-full bg-[#1a1b2e] p-6 rounded-xl text-center">
                                    <p className="text-[#8d8e98]">ไม่พบอุปกรณ์ในเครือข่าย</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                {scanStats.scanProgress === 0 && (
                    <div className="bg-[#1a1b2e] p-6 rounded-xl text-center">
                        <h3 className="mb-4 text-xl">เริ่มต้นใช้งาน</h3>
                        <p className="text-[#8d8e98] mb-4">
                            กดปุ่ม "เริ่มการแสกน" เพื่อตรวจสอบอุปกรณ์ IoT ในเครือข่ายของคุณ 
                            ระบบจะค้นหาอุปกรณ์และตรวจสอบช่องโหว่ด้านความปลอดภัยโดยอัตโนมัติ
                        </p>
                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <div className="bg-[rgba(35,37,57,0.5)] p-4 rounded-lg flex-1 max-w-xs mx-auto">
                                <div className="text-blue-400 text-3xl mb-2">1</div>
                                <h4 className="font-medium mb-1">ค้นหาอุปกรณ์</h4>
                                <p className="text-sm text-[#8d8e98]">
                                    ค้นหาอุปกรณ์ IoT ทั้งหมดที่เชื่อมต่อกับเครือข่ายของคุณ
                                </p>
                            </div>
                            <div className="bg-[rgba(35,37,57,0.5)] p-4 rounded-lg flex-1 max-w-xs mx-auto">
                                <div className="text-yellow-400 text-3xl mb-2">2</div>
                                <h4 className="font-medium mb-1">ตรวจสอบช่องโหว่</h4>
                                <p className="text-sm text-[#8d8e98]">
                                    วิเคราะห์ช่องโหว่ด้านความปลอดภัยในอุปกรณ์แต่ละชิ้น
                                </p>
                            </div>
                            <div className="bg-[rgba(35,37,57,0.5)] p-4 rounded-lg flex-1 max-w-xs mx-auto">
                                <div className="text-green-400 text-3xl mb-2">3</div>
                                <h4 className="font-medium mb-1">รับคำแนะนำ</h4>
                                <p className="text-sm text-[#8d8e98]">
                                    ดูรายงานพร้อมคำแนะนำในการแก้ไขปัญหาความปลอดภัย
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {selectedDevice && <DeviceDetails />}
        </main>
    );
} 