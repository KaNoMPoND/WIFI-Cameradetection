'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';

export default function Settings() {
    // ตั้งค่าการแสกน
    const [scanSettings, setScanSettings] = useState({
        autoScan: true,
        scanFrequency: 'daily',
        scanTime: '00:00',
        notifyOnComplete: true,
        scanDeepInspection: false
    });
    
    // ตั้งค่าการแจ้งเตือน
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        email: 'user@example.com',
        pushNotifications: false,
        notifyOnHighRisk: true,
        notifyOnMediumRisk: true,
        notifyOnLowRisk: false
    });
    
    // ตั้งค่าความเป็นส่วนตัว
    const [privacySettings, setPrivacySettings] = useState({
        collectAnonymousData: true,
        shareStatistics: false,
        storeHistory: 30 // จำนวนวันที่จะเก็บประวัติ
    });
    
    const [activeTab, setActiveTab] = useState<'scan' | 'notification' | 'privacy'>('scan');
    const [saveSuccess, setSaveSuccess] = useState(false);
    
    const handleScanSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        
        setScanSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    
    const handleNotificationSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        
        setNotificationSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    
    const handlePrivacySettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        
        setPrivacySettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value === 'true' ? true : value === 'false' ? false : value
        }));
    };
    
    const handleSaveSettings = () => {
        // จำลองการบันทึกการตั้งค่า
        setSaveSuccess(true);
        
        setTimeout(() => {
            setSaveSuccess(false);
        }, 3000);
    };
    
    return (
        <main className="min-h-screen bg-[#141526] text-white">
            <Navbar />
            
            <div className="max-w-4xl mx-auto pt-24 px-4 pb-12">
                <div className="bg-[rgba(35,37,57,0.95)] rounded-3xl p-8 mb-8">
                    <h1 className="text-2xl font-bold mb-6">การตั้งค่า</h1>
                    
                    {saveSuccess && (
                        <div className="mb-6 bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded">
                            บันทึกการตั้งค่าเรียบร้อยแล้ว
                        </div>
                    )}
                    
                    <div className="flex border-b border-[#2a2d43] mb-6">
                        <button 
                            className={`px-4 py-2 border-b-2 ${activeTab === 'scan' ? 'border-blue-500 text-white' : 'border-transparent text-gray-400'}`}
                            onClick={() => setActiveTab('scan')}
                        >
                            การแสกน
                        </button>
                        <button 
                            className={`px-4 py-2 border-b-2 ${activeTab === 'notification' ? 'border-blue-500 text-white' : 'border-transparent text-gray-400'}`}
                            onClick={() => setActiveTab('notification')}
                        >
                            การแจ้งเตือน
                        </button>
                        <button 
                            className={`px-4 py-2 border-b-2 ${activeTab === 'privacy' ? 'border-blue-500 text-white' : 'border-transparent text-gray-400'}`}
                            onClick={() => setActiveTab('privacy')}
                        >
                            ความเป็นส่วนตัว
                        </button>
                    </div>
                    
                    {activeTab === 'scan' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium">แสกนอัตโนมัติ</h3>
                                    <p className="text-sm text-gray-400">ทำการแสกนอุปกรณ์ตามกำหนดเวลา</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        name="autoScan"
                                        checked={scanSettings.autoScan}
                                        onChange={handleScanSettingChange}
                                    />
                                    <div className="w-11 h-6 bg-[#1c1e30] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">ความถี่ในการแสกน</label>
                                    <select 
                                        className="w-full bg-[#1c1e30] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        name="scanFrequency"
                                        value={scanSettings.scanFrequency}
                                        onChange={handleScanSettingChange}
                                        disabled={!scanSettings.autoScan}
                                    >
                                        <option value="hourly">ทุกชั่วโมง</option>
                                        <option value="daily">ทุกวัน</option>
                                        <option value="weekly">ทุกสัปดาห์</option>
                                        <option value="monthly">ทุกเดือน</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-2">เวลาที่ทำการแสกน</label>
                                    <input 
                                        type="time" 
                                        className="w-full bg-[#1c1e30] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        name="scanTime"
                                        value={scanSettings.scanTime}
                                        onChange={handleScanSettingChange}
                                        disabled={!scanSettings.autoScan || scanSettings.scanFrequency === 'hourly'}
                                    />
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <input 
                                    id="notifyOnComplete" 
                                    type="checkbox" 
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    name="notifyOnComplete"
                                    checked={scanSettings.notifyOnComplete}
                                    onChange={handleScanSettingChange}
                                />
                                <label htmlFor="notifyOnComplete" className="text-sm font-medium">
                                    แจ้งเตือนเมื่อการแสกนเสร็จสิ้น
                                </label>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <input 
                                    id="scanDeepInspection" 
                                    type="checkbox" 
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    name="scanDeepInspection"
                                    checked={scanSettings.scanDeepInspection}
                                    onChange={handleScanSettingChange}
                                />
                                <label htmlFor="scanDeepInspection" className="text-sm font-medium">
                                    แสกนแบบละเอียด (ใช้เวลานานขึ้น)
                                </label>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'notification' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium">การแจ้งเตือนทางอีเมล</h3>
                                    <p className="text-sm text-gray-400">ส่งการแจ้งเตือนไปยังอีเมลของคุณ</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        name="emailNotifications"
                                        checked={notificationSettings.emailNotifications}
                                        onChange={handleNotificationSettingChange}
                                    />
                                    <div className="w-11 h-6 bg-[#1c1e30] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-2">อีเมลของคุณ</label>
                                <input 
                                    type="email" 
                                    className="w-full bg-[#1c1e30] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    name="email"
                                    value={notificationSettings.email}
                                    onChange={handleNotificationSettingChange}
                                    disabled={!notificationSettings.emailNotifications}
                                />
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium">การแจ้งเตือนแบบ Push</h3>
                                    <p className="text-sm text-gray-400">รับการแจ้งเตือนผ่านทางเบราว์เซอร์</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        name="pushNotifications"
                                        checked={notificationSettings.pushNotifications}
                                        onChange={handleNotificationSettingChange}
                                    />
                                    <div className="w-11 h-6 bg-[#1c1e30] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            
                            <div className="pt-4 border-t border-[#2a2d43]">
                                <h3 className="font-medium mb-3">ระดับความเสี่ยงที่ต้องการรับการแจ้งเตือน</h3>
                                
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <input 
                                            id="notifyOnHighRisk" 
                                            type="checkbox" 
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            name="notifyOnHighRisk"
                                            checked={notificationSettings.notifyOnHighRisk}
                                            onChange={handleNotificationSettingChange}
                                        />
                                        <label htmlFor="notifyOnHighRisk" className="text-sm font-medium">
                                            ความเสี่ยงสูง
                                        </label>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                        <input 
                                            id="notifyOnMediumRisk" 
                                            type="checkbox" 
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            name="notifyOnMediumRisk"
                                            checked={notificationSettings.notifyOnMediumRisk}
                                            onChange={handleNotificationSettingChange}
                                        />
                                        <label htmlFor="notifyOnMediumRisk" className="text-sm font-medium">
                                            ความเสี่ยงปานกลาง
                                        </label>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                        <input 
                                            id="notifyOnLowRisk" 
                                            type="checkbox" 
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            name="notifyOnLowRisk"
                                            checked={notificationSettings.notifyOnLowRisk}
                                            onChange={handleNotificationSettingChange}
                                        />
                                        <label htmlFor="notifyOnLowRisk" className="text-sm font-medium">
                                            ความเสี่ยงต่ำ
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'privacy' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium">เก็บข้อมูลแบบไม่ระบุตัวตน</h3>
                                    <p className="text-sm text-gray-400">ช่วยปรับปรุงซอฟต์แวร์ด้วยข้อมูลการใช้งานแบบไม่ระบุตัวตน</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        name="collectAnonymousData"
                                        checked={privacySettings.collectAnonymousData}
                                        onChange={handlePrivacySettingChange}
                                    />
                                    <div className="w-11 h-6 bg-[#1c1e30] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium">แบ่งปันสถิติ</h3>
                                    <p className="text-sm text-gray-400">แบ่งปันสถิติช่องโหว่เพื่อช่วยปรับปรุงความปลอดภัยทั่วโลก</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        name="shareStatistics"
                                        checked={privacySettings.shareStatistics}
                                        onChange={handlePrivacySettingChange}
                                    />
                                    <div className="w-11 h-6 bg-[#1c1e30] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-2">เก็บประวัติการแสกนไว้นานเท่าไร</label>
                                <select 
                                    className="w-full bg-[#1c1e30] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    name="storeHistory"
                                    value={privacySettings.storeHistory.toString()}
                                    onChange={handlePrivacySettingChange}
                                >
                                    <option value="7">7 วัน</option>
                                    <option value="14">14 วัน</option>
                                    <option value="30">30 วัน</option>
                                    <option value="90">90 วัน</option>
                                    <option value="365">1 ปี</option>
                                </select>
                            </div>
                            
                            <div className="pt-4 mt-6 border-t border-[#2a2d43]">
                                <button 
                                    className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    ลบข้อมูลทั้งหมด
                                </button>
                                <p className="text-xs text-gray-400 mt-2">
                                    การลบข้อมูลจะลบประวัติการแสกนและการตั้งค่าทั้งหมด และไม่สามารถกู้คืนได้
                                </p>
                            </div>
                        </div>
                    )}
                    
                    <div className="flex justify-end mt-8">
                        <button 
                            className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            onClick={handleSaveSettings}
                        >
                            บันทึกการตั้งค่า
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
} 