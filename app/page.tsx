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
                        <p className="text-gray-400">Scan and analyze security vulnerabilities in your IoT devices</p>
                        <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-900/30 text-green-400 border border-green-500">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                            IoT Device Detection Active
                        </div>
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
                            <span>Network: {scanStats.networkName}</span>
                            <span>Total Devices: {scanStats.totalDevices}</span>
                        </div>
                        
                        {/* Debug info */}
                        {devices.length > 0 && (
                            <div className="mb-4 p-3 bg-blue-900/20 border border-blue-500 rounded-lg">
                                <div className="text-blue-300 text-sm">
                                    ✅ Found devices in network: {devices.length} devices
                                </div>
                                {devices.map(device => (
                                    <div key={device.id} className="text-xs text-blue-200 mt-1">
                                        • {device.name} ({device.ip}) - {device.type}
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {scanStats.scanProgress === 100 && devices.length > 0 && (
                                <div className="mb-4">
                                    <h2 className="text-xl font-semibold mb-2">Devices Found in Network</h2>
                                    <p className="text-[#8d8e98] text-sm">
                                        Found {scanStats.totalDevices} total devices,
                                        {scanStats.vulnerableDevices} with vulnerabilities
                                    </p>
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
                                    <p className="text-[#8d8e98]">Searching for devices...</p>
                                </div>
                            )}
                            
                            {devices.length === 0 && scanStats.scanProgress === 100 && (
                                <div className="col-span-full bg-[#1a1b2e] p-6 rounded-xl text-center">
                                    <p className="text-[#8d8e98]">No devices found in network</p>
                                    <p className="text-[#8d8e98] text-sm mt-2">
                                        Please check your network connection or try scanning again
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                {scanStats.scanProgress === 0 && (
                    <div className="bg-[#1a1b2e] p-6 rounded-xl text-center">
                        <h3 className="mb-4 text-xl">Getting Started</h3>
                        <p className="text-[#8d8e98] mb-4">
                            Click "Start Scan" to check IoT devices in your network. 
                            The system will automatically find devices and check for security vulnerabilities.
                        </p>
                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <div className="bg-[rgba(35,37,57,0.5)] p-4 rounded-lg flex-1 max-w-xs mx-auto">
                                <div className="text-blue-400 text-3xl mb-2">1</div>
                                <h4 className="font-medium mb-1">Find Devices</h4>
                                <p className="text-sm text-[#8d8e98]">
                                    Find all IoT devices connected to your network
                                </p>
                            </div>
                            <div className="bg-[rgba(35,37,57,0.5)] p-4 rounded-lg flex-1 max-w-xs mx-auto">
                                <div className="text-yellow-400 text-3xl mb-2">2</div>
                                <h4 className="font-medium mb-1">Check Vulnerabilities</h4>
                                <p className="text-sm text-[#8d8e98]">
                                    Analyze security vulnerabilities in each device
                                </p>
                            </div>
                            <div className="bg-[rgba(35,37,57,0.5)] p-4 rounded-lg flex-1 max-w-xs mx-auto">
                                <div className="text-green-400 text-3xl mb-2">3</div>
                                <h4 className="font-medium mb-1">Get Recommendations</h4>
                                <p className="text-sm text-[#8d8e98]">
                                    View reports with recommendations for fixing security issues
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