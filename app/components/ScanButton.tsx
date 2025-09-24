'use client';

import { useScan } from '../context/ScanContext';

export default function ScanButton() {
    const { scanning, startScan, cancelScan, scanStats } = useScan();
    const progress = scanStats.scanProgress;

    const getProgressColor = () => {
        if (progress < 30) return 'border-blue-500';
        if (progress < 60) return 'border-yellow-500';
        return 'border-green-500';
    };

    const progressStyle = {
        clipPath: `polygon(0 0, 100% 0, 100% ${progress}%, 0 ${progress}%)`,
    };

    return (
        <div className="flex flex-col items-center">
            <button 
                className={`relative w-48 h-48 bg-[#141526] text-white rounded-full 
                         hover:scale-105 transition-transform shadow-lg hover:shadow-xl
                         disabled:opacity-50 ${scanning ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={scanning ? undefined : startScan}
                disabled={scanning}
            >
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    {scanning ? `${progress}%` : 'Start Scan'}
                </div>
                
                {scanning && (
                    <div 
                        className={`absolute inset-0 rounded-full border-4 ${getProgressColor()}`}
                        style={progressStyle}
                    ></div>
                )}
                
                <div className={`absolute inset-[-3px] rounded-full border-2 
                            ${scanning ? getProgressColor() : 'border-[#3498db]'} 
                            ${scanning ? '' : 'animate-pulse'}`}>
                </div>
            </button>
            
            {scanning && (
                <button
                    onClick={cancelScan}
                    className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                    Cancel Scan
                </button>
            )}
            
            {!scanning && progress === 100 && (
                <button
                    onClick={startScan}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                    Scan Again
                </button>
            )}
        </div>
    );
} 