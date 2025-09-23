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
      case 'high': return 'High Risk';
      case 'medium': return 'Medium Risk';
      case 'low': return 'Low Risk';
      default: return 'Safe';
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
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return 'Unknown';
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
              <h3 className="text-gray-400 text-sm mb-3">Device Information</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Type</span>
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
                    <span className="text-gray-400">Manufacturer</span>
                    <span>{selectedDevice.manufacturer}</span>
                  </div>
                )}
                {selectedDevice.model && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Model</span>
                    <span>{selectedDevice.model}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className={selectedDevice.isOnline ? "text-green-400" : "text-red-400"}>
                    {selectedDevice.isOnline ? "Online" : "Offline"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Risk Level</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${getRiskBadgeClass(selectedDevice.risk)}`}>
                    {getRiskLabel(selectedDevice.risk)}
                  </span>
                </div>
                {selectedDevice.lastScan && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Scan</span>
                    <span>{selectedDevice.lastScan}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-[#232539] p-4 rounded-lg">
              <h3 className="text-gray-400 text-sm mb-3">Risk Summary</h3>
              
              <div className="flex items-center mb-3">
                <div className={`text-4xl font-bold ${
                  selectedDevice.risk === 'high' ? 'text-red-500' :
                  selectedDevice.risk === 'medium' ? 'text-yellow-500' :
                  selectedDevice.risk === 'low' ? 'text-blue-500' : 'text-green-500'
                }`}>
                  {selectedDevice.vulnerabilities.length}
                </div>
                <div className="ml-3">
                  <div className="font-medium">Vulnerabilities Found</div>
                  <div className="text-sm text-gray-400">
                    {selectedDevice.vulnerabilities.filter(v => v.severity === 'high').length} High Risk, {' '}
                    {selectedDevice.vulnerabilities.filter(v => v.severity === 'medium').length} Medium Risk, {' '}
                    {selectedDevice.vulnerabilities.filter(v => v.severity === 'low').length} Low Risk
                  </div>
                </div>
              </div>
              
              {selectedDevice.risk !== 'safe' && (
                <button 
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors mt-4"
                  onClick={handleAttack}
                >
                  Scan Vulnerabilities
                </button>
              )}
            </div>
          </div>
          
          <div className="bg-[#232539] p-4 rounded-lg mb-6">
            <h3 className="text-gray-400 text-sm mb-4">Detected Vulnerabilities</h3>
            
            {selectedDevice.vulnerabilities.length === 0 ? (
              <div className="text-center py-4 text-gray-400">
                No vulnerabilities found in this device
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
                      <div className="text-sm font-medium text-green-500 mb-1">Solution</div>
                      <div className="text-sm">{vuln.solution}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="bg-[#232539] p-4 rounded-lg">
            <h3 className="text-gray-400 text-sm mb-4">Additional Recommendations</h3>
            
            <div className="space-y-2 text-sm">
              {selectedDevice.risk === 'high' && (
                <div className="text-red-400">
                  ⚠️ This device has high risk and should be fixed urgently
                </div>
              )}
              
              <div>
                👉 Check for firmware updates from manufacturer regularly
              </div>
              
              <div>
                👉 Change default passwords and use complex passwords
              </div>
              
              <div>
                👉 Disable unnecessary services and ports
              </div>
              
              <div>
                👉 Regularly check device security settings
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-[#2a2d43] flex justify-between">
          <button 
            className="px-4 py-2 bg-[#1a1b2e] hover:bg-[#232539] text-white rounded-lg transition-colors"
            onClick={handleClose}
          >
            Close
          </button>
          
          <button 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            onClick={() => window.open(`/report?device=${selectedDevice.id}`, '_blank')}
          >
            View Full Report
          </button>
        </div>
      </div>
    </div>
  );
} 