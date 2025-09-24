'use client';

import { useScan } from '../context/ScanContext';
import { useState, useEffect } from 'react';

export default function ScanButton() {
    const { scanning, startScan, cancelScan, scanStats } = useScan();
    const progress = scanStats.scanProgress;
    const [maxProgress, setMaxProgress] = useState(0);

    // Update max progress to prevent going backwards
    useEffect(() => {
        if (progress > maxProgress) {
            setMaxProgress(progress);
        }
        if (!scanning) {
            setMaxProgress(0); // Reset when scan stops
        }
    }, [progress, maxProgress, scanning]);


    const getProgressColor = () => {
        // Always use blue color during scanning for consistency
        return 'border-blue-500';
    };

    const progressStyle = {
        clipPath: `polygon(0 0, 100% 0, 100% ${progress}%, 0 ${progress}%)`,
    };

    return (
        <div className="flex flex-col items-center">
            <div className="relative">
                {/* Circular progress indicator around the button */}
                {scanning && (
                    <svg className="absolute inset-[-8px] w-[208px] h-[208px] transform -rotate-90 pointer-events-none z-20" viewBox="0 0 100 100">
                        {/* Background circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            stroke="rgba(59, 130, 246, 0.2)"
                            strokeWidth="8"
                            fill="none"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            stroke="#3b82f6"
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 45}`}
                            strokeDashoffset={`${2 * Math.PI * 45 * (1 - maxProgress / 100)}`}
                            className="transition-all duration-500 ease-in-out"
                            style={{
                                transition: 'stroke-dashoffset 500ms cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        />
                    </svg>
                )}
                
                <button 
                    className={`relative w-48 h-48 rounded-full z-10
                             transition-all duration-700 ease-out shadow-lg border border-white/10
                             cursor-pointer hover:scale-105 hover:shadow-2xl group
                             ${scanning ? 'bg-gradient-to-br from-[#141526] to-[#1a1b2e] border-[#3498db]' :
                               progress === 100 ? 'bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-400 shadow-green-500/50' : 
                               'bg-gradient-to-br from-[#141526] to-[#1a1b2e]'}`}
                    onClick={scanning ? cancelScan : startScan}
                    style={{ touchAction: 'manipulation' }}
                    onMouseEnter={() => console.log('Hovering over button')}
                    onMouseLeave={() => console.log('Left button hover')}
                >
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <span className={`font-bold text-center leading-tight transition-all duration-500 ease-out
                            ${scanning ? 'text-white text-lg font-semibold' : 
                              progress === 100 ? 'text-green-300 text-xl group-hover:opacity-0' : 'text-lg font-semibold'}`}>
                            {scanning ? 'Cancel Scan' : 
                             progress === 100 ? 'Scan Complete' : 'Start Scan'}
                        </span>
                    </div>
                    
                    {/* Hover effect for Scan Complete */}
                    {progress === 100 && (
                        <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out">
                            <span className="text-green-200 text-xl font-bold">Scan Again</span>
                        </div>
                    )}
                    
                    <div className={`absolute inset-[-3px] rounded-full border-2 
                                ${scanning ? getProgressColor() : 
                                  progress === 100 ? 'border-green-400' : 'border-[#3498db]'}`}>
                    </div>
                </button>
            </div>
            
            
        </div>
    );
} 