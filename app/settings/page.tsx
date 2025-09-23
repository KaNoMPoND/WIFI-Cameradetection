'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';

interface WhitelistDevice {
    id: string;
    name: string;
    ip: string;
    mac: string;
}

export default function Settings() {
    // Scan settings
    const [scanSettings, setScanSettings] = useState({
        autoScan: true,
        scanFrequency: 'daily',
        scanTime: '00:00',
        notifyOnComplete: true,
        scanDeepInspection: false,
        enableWhitelist: false
    });
    
    // Notification settings
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        email: 'user@example.com',
        pushNotifications: false,
        notifyOnHighRisk: true,
        notifyOnMediumRisk: true,
        notifyOnLowRisk: false
    });
    
    // Privacy settings
    const [privacySettings, setPrivacySettings] = useState({
        collectAnonymousData: true,
        shareStatistics: false,
        storeHistory: 30 // Number of days to keep history
    });
    
    // Whitelist devices
    const [whitelistDevices, setWhitelistDevices] = useState<WhitelistDevice[]>([
        { id: '1', name: 'Router Admin', ip: '192.168.1.1', mac: '00:11:22:33:44:55' },
        { id: '2', name: 'Smart TV', ip: '192.168.1.15', mac: 'AA:BB:CC:DD:EE:FF' }
    ]);
    
    // For adding new devices to whitelist
    const [newDevice, setNewDevice] = useState<Omit<WhitelistDevice, 'id'>>({
        name: '',
        ip: '',
        mac: ''
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
    
    const handleNewDeviceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewDevice(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const addDeviceToWhitelist = () => {
        // Check if all fields are filled
        if (!newDevice.name || !newDevice.ip || !newDevice.mac) {
            alert('Please fill in all fields');
            return;
        }
        
        // Create new ID
        const id = (whitelistDevices.length + 1).toString();
        
        // Add new device to whitelist
        setWhitelistDevices(prev => [...prev, { ...newDevice, id }]);
        
        // Reset form
        setNewDevice({ name: '', ip: '', mac: '' });
    };
    
    const removeDeviceFromWhitelist = (id: string) => {
        setWhitelistDevices(prev => prev.filter(device => device.id !== id));
    };
    
    const handleSaveSettings = () => {
        // Simulate saving settings
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
                    <h1 className="text-2xl font-bold mb-6">Settings</h1>
                    
                    {saveSuccess && (
                        <div className="mb-6 bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded">
                            Settings saved successfully
                        </div>
                    )}
                    
                    <div className="flex border-b border-[#2a2d43] mb-6">
                        <button 
                            className={`px-4 py-2 border-b-2 ${activeTab === 'scan' ? 'border-blue-500 text-white' : 'border-transparent text-gray-400'}`}
                            onClick={() => setActiveTab('scan')}
                        >
                            Scanning
                        </button>
                        <button 
                            className={`px-4 py-2 border-b-2 ${activeTab === 'notification' ? 'border-blue-500 text-white' : 'border-transparent text-gray-400'}`}
                            onClick={() => setActiveTab('notification')}
                        >
                            Notifications
                        </button>
                        <button 
                            className={`px-4 py-2 border-b-2 ${activeTab === 'privacy' ? 'border-blue-500 text-white' : 'border-transparent text-gray-400'}`}
                            onClick={() => setActiveTab('privacy')}
                        >
                            Privacy
                        </button>
                    </div>
                    
                    {activeTab === 'scan' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium">Auto Scan</h3>
                                    <p className="text-sm text-gray-400">Automatically scan devices on schedule</p>
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
                                    <label className="block text-sm font-medium mb-2">Scan Frequency</label>
                                    <select 
                                        className="w-full bg-[#1c1e30] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        name="scanFrequency"
                                        value={scanSettings.scanFrequency}
                                        onChange={handleScanSettingChange}
                                        disabled={!scanSettings.autoScan}
                                    >
                                        <option value="hourly">Every Hour</option>
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium mb-2">Scan Time</label>
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
                                    Notify when scan is completed
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
                                    Deep scan (takes longer)
                                </label>
                            </div>
                            
                            {/* Whitelist Section */}
                            <div className="mt-8 pt-6 border-t border-[#2a2d43]">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="font-medium">Device Whitelist</h3>
                                        <p className="text-sm text-gray-400">Define devices to exclude from scanning</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer" 
                                            name="enableWhitelist"
                                            checked={scanSettings.enableWhitelist}
                                            onChange={handleScanSettingChange}
                                        />
                                        <div className="w-11 h-6 bg-[#1c1e30] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                
                                {scanSettings.enableWhitelist && (
                                    <>
                                        {/* Form for adding new device */}
                                        <div className="bg-[#1c1e30] p-4 rounded-lg mb-4">
                                            <h4 className="text-sm font-medium mb-3">Add Device to Whitelist</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                                <div>
                                                    <input 
                                                        type="text" 
                                                        placeholder="Device Name" 
                                                        className="w-full bg-[#232539] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        name="name"
                                                        value={newDevice.name}
                                                        onChange={handleNewDeviceChange}
                                                    />
                                                </div>
                                                <div>
                                                    <input 
                                                        type="text" 
                                                        placeholder="IP Address (e.g. 192.168.1.1)" 
                                                        className="w-full bg-[#232539] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        name="ip"
                                                        value={newDevice.ip}
                                                        onChange={handleNewDeviceChange}
                                                    />
                                                </div>
                                                <div>
                                                    <input 
                                                        type="text" 
                                                        placeholder="MAC Address (e.g. 00:11:22:33:44:55)" 
                                                        className="w-full bg-[#232539] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        name="mac"
                                                        value={newDevice.mac}
                                                        onChange={handleNewDeviceChange}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <button 
                                                    className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                                    onClick={addDeviceToWhitelist}
                                                >
                                                    Add Device
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {/* List of whitelisted devices */}
                                        <div className="bg-[#1c1e30] p-4 rounded-lg">
                                            <h4 className="text-sm font-medium mb-3">Whitelisted Devices</h4>
                                            
                                            {whitelistDevices.length === 0 ? (
                                                <p className="text-sm text-gray-400 text-center py-4">No devices in Whitelist</p>
                                            ) : (
                                                <div className="overflow-x-auto">
                                                    <table className="w-full">
                                                        <thead>
                                                            <tr className="text-left text-sm text-gray-400 border-b border-[#2a2d43]">
                                                                <th className="pb-2">Device Name</th>
                                                                <th className="pb-2">IP Address</th>
                                                                <th className="pb-2">MAC Address</th>
                                                                <th className="pb-2"></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {whitelistDevices.map(device => (
                                                                <tr key={device.id} className="border-b border-[#2a2d43]">
                                                                    <td className="py-3">{device.name}</td>
                                                                    <td className="py-3">{device.ip}</td>
                                                                    <td className="py-3">{device.mac}</td>
                                                                    <td className="py-3 text-right">
                                                                        <button 
                                                                            className="text-red-500 hover:text-red-400"
                                                                            onClick={() => removeDeviceFromWhitelist(device.id)}
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                            
                                            <div className="mt-3 text-xs text-gray-400">
                                                <p>Whitelisted devices will not be scanned and will not appear in security reports</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'notification' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium">Email Notifications</h3>
                                    <p className="text-sm text-gray-400">Send notifications to your email</p>
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
                                <label className="block text-sm font-medium mb-2">Your Email</label>
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
                                    <h3 className="font-medium">Push Notifications</h3>
                                    <p className="text-sm text-gray-400">Receive notifications through browser</p>
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
                                <h3 className="font-medium mb-3">Risk Level Notifications</h3>
                                
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
                                            High Risk
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
                                            Medium Risk
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
                                            Low Risk
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
                                    <h3 className="font-medium">Collect Anonymous Data</h3>
                                    <p className="text-sm text-gray-400">Help improve software with anonymous usage data</p>
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
                                    <h3 className="font-medium">Share Statistics</h3>
                                    <p className="text-sm text-gray-400">Share vulnerability statistics to help improve global security</p>
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
                                <label className="block text-sm font-medium mb-2">How long to keep scan history</label>
                                <select 
                                    className="w-full bg-[#1c1e30] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    name="storeHistory"
                                    value={privacySettings.storeHistory.toString()}
                                    onChange={handlePrivacySettingChange}
                                >
                                    <option value="7">7 days</option>
                                    <option value="14">14 days</option>
                                    <option value="30">30 days</option>
                                    <option value="90">90 days</option>
                                    <option value="365">1 year</option>
                                </select>
                            </div>
                            
                            <div className="pt-4 mt-6 border-t border-[#2a2d43]">
                                <button 
                                    className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Delete All Data
                                </button>
                                <p className="text-xs text-gray-400 mt-2">
                                    Deleting data will remove all scan history and settings, and cannot be recovered
                                </p>
                            </div>
                        </div>
                    )}
                    
                    <div className="flex justify-end mt-8">
                        <button 
                            className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            onClick={handleSaveSettings}
                        >
                            Save Settings
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
} 