'use client';

import { useScan } from '../context/ScanContext';

export default function ScanButton() {
    const { scanning, startScan } = useScan();

    return (
        <button 
            className="relative w-48 h-48 bg-[#141526] text-white rounded-full 
                     hover:scale-105 transition-transform shadow-lg hover:shadow-xl
                     disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={startScan}
            disabled={scanning}
        >
            {scanning ? 'กำลังแสกน...' : 'เริ่มการแสกน'}
            <div className="absolute inset-[-3px] rounded-full border-2 border-[#3498db] 
                          animate-pulse"></div>
        </button>
    );
} 