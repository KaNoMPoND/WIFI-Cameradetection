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
        <main className="min-h-screen bg-gradient-to-br from-[#141526] via-[#1a1b2e] to-[#141526] text-white relative overflow-hidden scroll-smooth">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            
            <Navbar />
            
            <div className="max-w-6xl mx-auto pt-24 px-4 pb-12 relative z-10">
                <div className="bg-gradient-to-br from-[rgba(35,37,57,0.95)] to-[rgba(35,37,57,0.8)] backdrop-blur-md rounded-3xl p-8 mb-8 border border-white/10 shadow-2xl transition-all duration-700 ease-out">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-300 to-purple-400 bg-clip-text text-transparent animate-in fade-in duration-1000">
                            IoT Security Scanner
                        </h1>
                        <p className="text-gray-300 text-lg md:text-xl mb-6 max-w-2xl mx-auto leading-relaxed animate-in slide-in-from-top duration-1000 delay-200">
                            Scan and analyze security vulnerabilities in your IoT devices
                        </p>
                        <div className="inline-flex items-center px-6 py-3 rounded-full text-sm bg-gradient-to-r from-green-900/30 to-emerald-900/30 text-green-400 border border-green-500/50 backdrop-blur-sm shadow-lg animate-in slide-in-from-top duration-1000 delay-400">
                            <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                            IoT Device Detection Active
                        </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1 w-full md:w-auto flex justify-center animate-in slide-in-from-left duration-1000 delay-600 ease-out">
                            <ScanButton />
                        </div>
                        
                        <div className="flex-1 w-full animate-in slide-in-from-right duration-1000 delay-800 ease-out">
                            <Stats />
                        </div>
                    </div>
                </div>
                
                {scanStats.scanProgress > 0 && (
                    <div className="mb-8 animate-in fade-in duration-1000 ease-out">
                        <div className="flex justify-between text-sm text-[#8d8e98] mb-4 px-2">
                            <span className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                Network: {scanStats.networkName}
                            </span>
                            <span className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                Total Devices: {scanStats.totalDevices}
                            </span>
                        </div>
                        
                        {/* Debug info */}
                        {devices.length > 0 && (
                            <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl backdrop-blur-sm shadow-lg animate-in slide-in-from-top duration-500">
                                <div className="text-blue-300 text-sm font-medium flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Found devices in network: {devices.length} devices
                                </div>
                                <div className="mt-2 space-y-1">
                                    {devices.map(device => (
                                        <div key={device.id} className="text-xs text-blue-200 flex items-center gap-2">
                                            <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                                            {device.name} ({device.ip}) - {device.type}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {scanStats.scanProgress === 100 && devices.length > 0 && (
                                <div className="mb-6 text-center animate-in slide-in-from-top duration-500" data-scan-results>
                                    <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">Scan Results</h2>
                                    <p className="text-[#8d8e98] text-lg">
                                        Found <span className="text-white font-semibold">{scanStats.totalDevices}</span> total devices, 
                                        <span className="text-red-400 font-semibold ml-1">{scanStats.vulnerableDevices}</span> with vulnerabilities
                                    </p>
                                </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {devices.map((device, index) => (
                                <div key={device.id} className="animate-in slide-in-from-bottom duration-700 ease-out" style={{animationDelay: `${index * 150}ms`}}>
                                    <ResultCard 
                                        deviceId={device.id}
                                        title={device.type}
                                    />
                                </div>
                            ))}
                            
                            {devices.length === 0 && scanStats.scanProgress < 100 && (
                                <div className="col-span-full bg-gradient-to-br from-[#1a1b2e] to-[#232539] p-8 rounded-xl text-center border border-white/10 shadow-lg animate-in fade-in duration-700 ease-out">
                                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-blue-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </div>
                                    <p className="text-[#8d8e98] text-lg">Searching for devices...</p>
                                </div>
                            )}
                            
                            {devices.length === 0 && scanStats.scanProgress === 100 && (
                                <div className="col-span-full bg-gradient-to-br from-[#1a1b2e] to-[#232539] p-8 rounded-xl text-center border border-white/10 shadow-lg animate-in fade-in duration-700 ease-out">
                                    <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                                        </svg>
                                    </div>
                                    <p className="text-[#8d8e98] text-lg">No devices found in network</p>
                                    <p className="text-[#8d8e98] text-sm mt-2">
                                        Please check your network connection or try scanning again
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                {scanStats.scanProgress === 0 && (
                    <div className="bg-gradient-to-br from-[#1a1b2e] to-[#232539] p-8 rounded-xl text-center border border-white/10 shadow-lg animate-in fade-in duration-1000 ease-out">
                        <h3 className="mb-6 text-2xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">Getting Started</h3>
                        <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto leading-relaxed">
                            Click "Start Scan" to check IoT devices in your network. 
                            The system will automatically find devices and check for security vulnerabilities.
                        </p>
                        <div className="flex flex-col md:flex-row gap-6 justify-center">
                            <div className="bg-gradient-to-br from-[rgba(35,37,57,0.8)] to-[rgba(35,37,57,0.4)] p-6 rounded-xl flex-1 max-w-xs mx-auto border border-white/10">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-blue-400 text-2xl font-bold">1</span>
                                </div>
                                <h4 className="font-semibold mb-3 text-white">Find Devices</h4>
                                <p className="text-sm text-[#8d8e98] leading-relaxed">
                                    Find all IoT devices connected to your network
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-[rgba(35,37,57,0.8)] to-[rgba(35,37,57,0.4)] p-6 rounded-xl flex-1 max-w-xs mx-auto border border-white/10">
                                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-yellow-400 text-2xl font-bold">2</span>
                                </div>
                                <h4 className="font-semibold mb-3 text-white">Check Vulnerabilities</h4>
                                <p className="text-sm text-[#8d8e98] leading-relaxed">
                                    Analyze security vulnerabilities in each device
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-[rgba(35,37,57,0.8)] to-[rgba(35,37,57,0.4)] p-6 rounded-xl flex-1 max-w-xs mx-auto border border-white/10">
                                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-green-400 text-2xl font-bold">3</span>
                                </div>
                                <h4 className="font-semibold mb-3 text-white">Get Recommendations</h4>
                                <p className="text-sm text-[#8d8e98] leading-relaxed">
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