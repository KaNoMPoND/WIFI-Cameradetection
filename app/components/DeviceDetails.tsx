'use client';

import { useScan } from "../context/ScanContext";

export default function DeviceDetails() {
  const { selectedDevice, setSelectedDevice, attackDevice } = useScan();

  if (!selectedDevice) return null;

  const handleClose = () => {
    setSelectedDevice(null);
  };

  const handleAttack = () => {
    attackDevice(selectedDevice.ip);
  };

  const getRiskBadgeClass = (risk: string) => {
    switch(risk) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border border-red-500';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500';
      case 'low':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500';
      default:
        return 'bg-green-500/20 text-green-400 border border-green-500';
    }
  };

  const getRiskLabel = (risk: string) => {
    switch(risk) {
      case 'high': return 'เสี่ยงสูง';
      case 'medium': return 'เสี่ยงปานกลาง';
      case 'low': return 'เสี่ยงต่ำ';
      default: return 'ปลอดภัย';
    }
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch(severity) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border border-red-500';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500';
      case 'low':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500';
      default:
        return 'bg-gray-500/20 text-gray-400 border border-gray-500';
    }
  };
  
  const getSeverityLabel = (severity: string) => {
    switch(severity) {
      case 'high': return 'สูง';
      case 'medium': return 'กลาง';
      case 'low': return 'ต่ำ';
      default: return 'ไม่ระบุ';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1b2e] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-[#2a2d43]">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{selectedDevice.name}</h2>
            <button 
              onClick={handleClose} 
              className="text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="overflow-y-auto p-6 flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-[#232539] p-4 rounded-lg">
              <h3 className="text-gray-400 text-sm mb-3">ข้อมูลอุปกรณ์</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">ประเภท</span>
                  <span>{selectedDevice.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">IP Address</span>
                  <span>{selectedDevice.ip}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">MAC Address</span>
                  <span>{selectedDevice.mac}</span>
                </div>
                {selectedDevice.manufacturer && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">ผู้ผลิต</span>
                    <span>{selectedDevice.manufacturer}</span>
                  </div>
                )}
                {selectedDevice.model && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">รุ่น</span>
                    <span>{selectedDevice.model}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">สถานะ</span>
                  <span className={selectedDevice.isOnline ? "text-green-400" : "text-red-400"}>
                    {selectedDevice.isOnline ? "ออนไลน์" : "ออฟไลน์"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ระดับความเสี่ยง</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${getRiskBadgeClass(selectedDevice.risk)}`}>
                    {getRiskLabel(selectedDevice.risk)}
                  </span>
                </div>
                {selectedDevice.lastScan && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">สแกนล่าสุด</span>
                    <span>{selectedDevice.lastScan}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-[#232539] p-4 rounded-lg">
              <h3 className="text-gray-400 text-sm mb-3">สรุปความเสี่ยง</h3>
              
              <div className="flex items-center mb-3">
                <div className={`text-4xl font-bold ${
                  selectedDevice.risk === 'high' ? 'text-red-500' :
                  selectedDevice.risk === 'medium' ? 'text-yellow-500' :
                  selectedDevice.risk === 'low' ? 'text-blue-500' : 'text-green-500'
                }`}>
                  {selectedDevice.vulnerabilities.length}
                </div>
                <div className="ml-3">
                  <div className="font-medium">ช่องโหว่ที่ตรวจพบ</div>
                  <div className="text-sm text-gray-400">
                    {selectedDevice.vulnerabilities.filter(v => v.severity === 'high').length} ความเสี่ยงสูง, {' '}
                    {selectedDevice.vulnerabilities.filter(v => v.severity === 'medium').length} ความเสี่ยงกลาง, {' '}
                    {selectedDevice.vulnerabilities.filter(v => v.severity === 'low').length} ความเสี่ยงต่ำ
                  </div>
                </div>
              </div>
              
              {selectedDevice.risk !== 'safe' && (
                <button 
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors mt-4"
                  onClick={handleAttack}
                >
                  ทดสอบการโจมตี
                </button>
              )}
            </div>
          </div>
          
          <div className="bg-[#232539] p-4 rounded-lg mb-6">
            <h3 className="text-gray-400 text-sm mb-4">ช่องโหว่ที่ตรวจพบ</h3>
            
            {selectedDevice.vulnerabilities.length === 0 ? (
              <div className="text-center py-4 text-gray-400">
                ไม่พบช่องโหว่ในอุปกรณ์นี้
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDevice.vulnerabilities.map(vuln => (
                  <div key={vuln.id} className="bg-[#1a1b2e] p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div className="font-medium">{vuln.name}</div>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getSeverityBadgeClass(vuln.severity)}`}>
                        {getSeverityLabel(vuln.severity)}
                      </span>
                    </div>
                    <div className="text-gray-400 mb-3">
                      {vuln.description}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-green-500 mb-1">วิธีแก้ไข</div>
                      <div className="text-sm">{vuln.solution}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="bg-[#232539] p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm mb-4">คำแนะนำเพิ่มเติม</h3>
            
            <div className="space-y-2 text-sm">
              {selectedDevice.risk === 'high' && (
                <div className="text-red-400">
                  ⚠️ อุปกรณ์นี้มีความเสี่ยงสูง ควรแก้ไขปัญหาโดยเร่งด่วน
                </div>
              )}
              
              <div>
                👉 ตรวจสอบการอัปเดตเฟิร์มแวร์จากผู้ผลิตอยู่เสมอ
              </div>
              
              <div>
                👉 เปลี่ยนรหัสผ่านเริ่มต้นและใช้รหัสผ่านที่ซับซ้อน
              </div>
              
              <div>
                👉 ปิดบริการและพอร์ตที่ไม่จำเป็น
              </div>
              
              <div>
                👉 ตรวจสอบการตั้งค่าความปลอดภัยของอุปกรณ์อยู่เสมอ
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-[#2a2d43] flex justify-between">
          <button 
            className="px-4 py-2 bg-[#1a1b2e] hover:bg-[#232539] text-white rounded-lg transition-colors"
            onClick={handleClose}
          >
            ปิด
          </button>
          
          <button 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            onClick={() => window.open(`/report?device=${selectedDevice.id}`, '_blank')}
          >
            ดูรายงานฉบับเต็ม
          </button>
        </div>
      </div>
    </div>
  );
} 