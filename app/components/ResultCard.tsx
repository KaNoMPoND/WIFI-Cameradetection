'use client';

import { useScan } from '../context/ScanContext';

interface ResultCardProps {
    title: string;
    deviceName?: string;
    deviceIP?: string;
    status: string;
    showAttackButton?: boolean;
}

export default function ResultCard({ 
    title, 
    deviceName, 
    deviceIP, 
    status, 
    showAttackButton 
}: ResultCardProps) {
    const { attackDevice } = useScan();

    const handleAttack = () => {
        if (deviceIP) {
            attackDevice(deviceIP);
        }
    };

    return (
        <div className="bg-[#1a1b2e] p-6 rounded-xl">
            <h3 className="text-[#8d8e98] text-sm uppercase mb-4">{title}</h3>
            <div className="bg-[#232539] p-3 rounded-lg flex justify-between items-center mb-2">
                <div>
                    <strong>{deviceName}</strong>
                    <p>{deviceIP}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-sm bg-[#e74c3c]">
                    {status}
                </span>
            </div>
            {showAttackButton && (
                <button 
                    onClick={handleAttack}
                    className="bg-[#3498db] text-white px-4 py-2 rounded 
                             hover:bg-[#2980b9] transition-colors"
                >
                    ทดสอบการโจมตี
                </button>
            )}
        </div>
    );
} 