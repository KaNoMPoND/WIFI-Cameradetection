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
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1b2e] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#1a1b2e] p-6 border-b border-[#2a2d43] flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{selectedDevice.name}</h2>
            <div className="text-[#8d8e98] mt-1">
              <div>IP: {selectedDevice.ip}</div>
              <div>MAC: {selectedDevice.mac}</div>
              <div>ประเภท: {selectedDevice.type}</div>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${getRiskBadgeClass(selectedDevice.risk)}`}>
            {getRiskLabel(selectedDevice.risk)}
          </span>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">ช่องโหว่ที่ตรวจพบ</h3>
          
          {selectedDevice.vulnerabilities.length === 0 ? (
            <div className="bg-green-500/10 text-green-400 p-4 rounded-lg border border-green-500/30">
              ไม่พบช่องโหว่ในอุปกรณ์นี้
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDevice.vulnerabilities.map(vuln => (
                <div key={vuln.id} className="bg-[#232539] p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold">{vuln.name}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs ${getSeverityBadgeClass(vuln.severity)}`}>
                      {getSeverityLabel(vuln.severity)}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <h5 className="text-sm font-medium text-[#8d8e98] mb-1">รายละเอียด</h5>
                    <p>{vuln.description}</p>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-[#8d8e98] mb-1">วิธีแก้ไข</h5>
                    <p className="text-green-400">{vuln.solution}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">การแก้ไขปัญหา</h3>
            
            <div className="bg-[#232539] p-4 rounded-lg">
              <h4 className="font-medium mb-2">คำแนะนำทั่วไป</h4>
              <ul className="list-disc list-inside space-y-2 text-[#8d8e98]">
                <li>อัปเดตเฟิร์มแวร์หรือซอฟต์แวร์ของอุปกรณ์ให้เป็นเวอร์ชันล่าสุดเสมอ</li>
                <li>เปลี่ยนรหัสผ่านเริ่มต้นและใช้รหัสผ่านที่ซับซ้อน</li>
                <li>ปิดพอร์ตหรือบริการที่ไม่จำเป็นต่อการใช้งาน</li>
                <li>เปิดใช้งานการเข้ารหัสข้อมูลในการสื่อสาร</li>
                <li>ติดตั้งอุปกรณ์ให้อยู่ในเครือข่ายที่แยกออกมาหากเป็นไปได้</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="sticky bottom-0 bg-[#1a1b2e] p-6 border-t border-[#2a2d43] flex justify-between">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-[#232539] text-white rounded-lg hover:bg-[#2a2d43] transition-colors"
          >
            ปิด
          </button>
          
          {selectedDevice.risk !== 'safe' && (
            <button
              onClick={handleAttack}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              ทดสอบการโจมตี
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 