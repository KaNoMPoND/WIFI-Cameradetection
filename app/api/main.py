from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime
import nmap
import psutil
import json
import asyncio
import threading
import time
import requests

app = FastAPI(
    title="Simple API Server",
    description="API Server พื้นฐานสำหรับการใช้งานทั่วไป",
    version="1.0.0"
)

# CORS middleware เพื่อให้ Next.js สามารถเรียก API ได้
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class MessageRequest(BaseModel):
    message: str
    user_id: Optional[str] = None

class MessageResponse(BaseModel):
    id: str
    message: str
    timestamp: str
    status: str = "success"

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    version: str

class ScanRequest(BaseModel):
    target: str = "192.168.1.0/24"  # Default network range
    scan_type: str = "ping"  # ping, port, service, vuln

class DeviceInfo(BaseModel):
    ip: str
    mac: str
    hostname: str
    vendor: str
    status: str
    ports: List[Dict[str, Any]] = []
    vulnerabilities: List[str] = []
    risk_level: str = "low"

class ScanResponse(BaseModel):
    scan_id: str
    status: str
    progress: int
    devices: List[DeviceInfo] = []
    total_devices: int = 0
    timestamp: str

@app.get("/")
async def root():
    return {
        "message": "Simple API Server",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """ตรวจสอบสถานะของ API"""
    return HealthResponse(
        status="healthy",
        timestamp=datetime.now().isoformat(),
        version="1.0.0"
    )

# Storage สำหรับข้อมูลง่ายๆ (ในที่นี้ใช้ memory, ในการใช้งานจริงอาจใช้ database)
messages_store = []
scan_results = {}  # Store scan results
active_scans = {}  # Track active scans

def generate_id() -> str:
    """สร้าง ID ง่ายๆ"""
    import uuid
    return str(uuid.uuid4())[:8]

# Nmap scanner instance
try:
    nm = nmap.PortScanner()
    NMAP_AVAILABLE = True
except nmap.PortScannerError:
    print("Warning: nmap not found in PATH. Using fallback mode.")
    nm = None
    NMAP_AVAILABLE = False

def get_network_range():
    """Get local network range automatically"""
    try:
        # Get default gateway and network interface
        import subprocess
        result = subprocess.run(['ip', 'route', 'show', 'default'], 
                              capture_output=True, text=True)
        if result.returncode == 0:
            # Extract network from default route
            lines = result.stdout.strip().split('\n')
            for line in lines:
                if 'default via' in line:
                    parts = line.split()
                    if len(parts) >= 3:
                        # Get the interface and extract network
                        interface = parts[4] if len(parts) > 4 else None
                        if interface:
                            # Get network info for this interface
                            ip_result = subprocess.run(['ip', 'addr', 'show', interface], 
                                                     capture_output=True, text=True)
                            if ip_result.returncode == 0:
                                for ip_line in ip_result.stdout.split('\n'):
                                    if 'inet ' in ip_line and not '127.0.0.1' in ip_line:
                                        ip_part = ip_line.strip().split()[1]
                                        ip = ip_part.split('/')[0]
                                        # Convert to network range
                                        ip_parts = ip.split('.')
                                        return f"{ip_parts[0]}.{ip_parts[1]}.{ip_parts[2]}.0/24"
    except:
        pass
    return "192.168.1.0/24"  # Default fallback

def determine_risk_level(ports, vulnerabilities):
    """Determine risk level based on open ports and vulnerabilities"""
    high_risk_ports = [21, 23, 135, 139, 445, 1433, 3389, 5900, 8080]
    medium_risk_ports = [22, 80, 443, 993, 995]
    
    high_risk_count = sum(1 for port in ports if port in high_risk_ports)
    medium_risk_count = sum(1 for port in ports if port in medium_risk_ports)
    
    if vulnerabilities or high_risk_count > 0:
        return "high"
    elif medium_risk_count > 2:
        return "medium"
    else:
        return "low"

def get_mac_vendor(mac_address):
    """Get vendor information from MAC address using API"""
    try:
        if not mac_address or mac_address == "Unknown":
            return "Unknown Device"
        
        # Clean MAC address
        mac_clean = mac_address.replace(':', '').replace('-', '').upper()[:6]
        
        # Use MAC Vendor Lookup API
        url = f"https://api.macvendors.com/{mac_address}"
        response = requests.get(url, timeout=5)
        
        if response.status_code == 200:
            vendor = response.text.strip()
            
            # Map vendor names to more user-friendly device types
            vendor_lower = vendor.lower()
            if 'apple' in vendor_lower:
                return f"Apple Device ({vendor})"
            elif 'samsung' in vendor_lower:
                return f"Samsung Device ({vendor})"
            elif 'xiaomi' in vendor_lower or 'mi' in vendor_lower:
                return f"Xiaomi Device ({vendor})"
            elif 'tp-link' in vendor_lower or 'tplink' in vendor_lower:
                return f"TP-Link Router ({vendor})"
            elif 'huawei' in vendor_lower:
                return f"Huawei Device ({vendor})"
            elif 'intel' in vendor_lower:
                return f"Computer ({vendor})"
            elif 'realtek' in vendor_lower:
                return f"Computer/Network Device ({vendor})"
            elif 'asus' in vendor_lower:
                return f"ASUS Device ({vendor})"
            elif 'sony' in vendor_lower:
                return f"Sony Device ({vendor})"
            elif 'lg' in vendor_lower or 'lge' in vendor_lower:
                return f"LG Device ({vendor})"
            elif 'camera' in vendor_lower or 'hikvision' in vendor_lower or 'dahua' in vendor_lower:
                return f"Security Camera ({vendor})"
            else:
                return vendor
        else:
            return "Unknown Device"
    except Exception as e:
        print(f"Error looking up MAC {mac_address}: {e}")
        return "Unknown Device"

async def perform_mock_scan(scan_id: str, target: str, scan_type: str):
    """Perform mock scan when nmap is not available"""
    try:
        # Simulate scanning progress
        for progress in [20, 40, 60, 80, 100]:
            scan_results[scan_id]["progress"] = progress
            await asyncio.sleep(1)
            
            if progress == 40:
                # Add some mock devices
                mock_devices = [
                    DeviceInfo(
                        ip="192.168.1.1",
                        mac="00:11:22:33:44:55",
                        hostname="Router",
                        vendor="TP-Link",
                        status="online",
                        ports=[],
                        vulnerabilities=[],
                        risk_level="medium"
                    ),
                    DeviceInfo(
                        ip="192.168.1.10",
                        mac="AA:BB:CC:DD:EE:FF",
                        hostname="Camera",
                        vendor="Xiaomi",
                        status="online",
                        ports=[],
                        vulnerabilities=[],
                        risk_level="high"
                    ),
                    DeviceInfo(
                        ip="192.168.1.15",
                        mac="12:34:56:78:90:AB",
                        hostname="Smart TV",
                        vendor="Samsung",
                        status="online",
                        ports=[],
                        vulnerabilities=[],
                        risk_level="low"
                    )
                ]
                scan_results[scan_id]["devices"] = mock_devices
                scan_results[scan_id]["total_devices"] = len(mock_devices)
        
        scan_results[scan_id]["status"] = "completed"
        
    except Exception as e:
        scan_results[scan_id]["status"] = "error"
        scan_results[scan_id]["error"] = str(e)

async def perform_nmap_scan(scan_id: str, target: str, scan_type: str):
    """Perform nmap scan in background"""
    try:
        scan_results[scan_id] = {
            "status": "running",
            "progress": 0,
            "devices": [],
            "total_devices": 0,
            "timestamp": datetime.now().isoformat()
        }
        
        if not NMAP_AVAILABLE:
            # Fallback to mock scan when nmap is not available
            await perform_mock_scan(scan_id, target, scan_type)
            return
        
        # Step 1: Host discovery (ping scan with MAC addresses)
        scan_results[scan_id]["progress"] = 20
        nm.scan(hosts=target, arguments='-sn')  # Ping scan
        
        hosts = []
        for host in nm.all_hosts():
            if nm[host].state() == 'up':
                hosts.append(host)
        
        scan_results[scan_id]["progress"] = 40
        scan_results[scan_id]["total_devices"] = len(hosts)
        
        devices = []
        for i, host in enumerate(hosts):
            # Get MAC address and hostname
            mac = "Unknown"
            hostname = "Unknown"
            vendor = "Unknown Device"
            
            try:
                # Get MAC address - try multiple methods
                mac = "Unknown"
                if 'addresses' in nm[host]:
                    if 'mac' in nm[host]['addresses']:
                        mac = nm[host]['addresses']['mac']
                    elif 'macaddress' in nm[host]['addresses']:
                        mac = nm[host]['addresses']['macaddress']
                
                # If still no MAC, try ARP scan
                if mac == "Unknown":
                    try:
                        nm.scan(hosts=host, arguments='-PR -sn')  # ARP scan
                        if 'addresses' in nm[host] and 'mac' in nm[host]['addresses']:
                            mac = nm[host]['addresses']['mac']
                    except:
                        pass
                
                # Get vendor from MAC
                if mac != "Unknown":
                    vendor = get_mac_vendor(mac)
                else:
                    vendor = "Unknown Device"
                
                # Get hostname - try multiple methods
                if nm[host].hostname():
                    hostname = nm[host].hostname()
                elif 'hostnames' in nm[host] and len(nm[host]['hostnames']) > 0:
                    hostname = nm[host]['hostnames'][0]['name']
                else:
                    hostname = "Unknown"
                
                # If hostname is still generic, try to infer from vendor
                if hostname == "Unknown" or not hostname:
                    if 'Apple' in vendor:
                        hostname = "Apple Device"
                    elif 'Samsung' in vendor:
                        hostname = "Samsung Device"
                    elif vendor != "Unknown Device":
                        hostname = vendor.split('(')[0].strip()
                
                # Port scan if requested
                ports = []
                if scan_type in ['port', 'service', 'vuln']:
                    nm.scan(hosts=host, arguments='-sS -O --top-ports 1000')
                    if 'tcp' in nm[host]:
                        for port in nm[host]['tcp']:
                            port_info = nm[host]['tcp'][port]
                            ports.append({
                                "port": port,
                                "state": port_info['state'],
                                "service": port_info['name'],
                                "version": port_info.get('version', ''),
                                "product": port_info.get('product', '')
                            })
                
                # Determine risk level
                open_ports = [p['port'] for p in ports if p['state'] == 'open']
                vulnerabilities = []  # In real implementation, check for known vulnerabilities
                risk_level = determine_risk_level(open_ports, vulnerabilities)
                
                device = DeviceInfo(
                    ip=host,
                    mac=mac,
                    hostname=hostname,
                    vendor=vendor,
                    status="online",
                    ports=ports,
                    vulnerabilities=vulnerabilities,
                    risk_level=risk_level
                )
                devices.append(device)
                
            except Exception as e:
                print(f"Error processing host {host}: {e}")
                # Add basic device info even if detailed scan fails
                # Try to get vendor from MAC if available
                fallback_vendor = "Unknown Device"
                fallback_hostname = "Unknown"
                if mac != "Unknown":
                    try:
                        fallback_vendor = get_mac_vendor(mac)
                        if 'Apple' in fallback_vendor:
                            fallback_hostname = "Apple Device"
                        elif 'Samsung' in fallback_vendor:
                            fallback_hostname = "Samsung Device"
                        elif 'Huawei' in fallback_vendor:
                            fallback_hostname = "Huawei Device"
                        elif fallback_vendor != "Unknown Device":
                            fallback_hostname = fallback_vendor.split('(')[0].strip()
                    except:
                        pass
                
                device = DeviceInfo(
                    ip=host,
                    mac=mac,
                    hostname=fallback_hostname,
                    vendor=fallback_vendor,
                    status="online",
                    risk_level="low"
                )
                devices.append(device)
            
            # Update progress
            progress = 40 + int((i + 1) / len(hosts) * 50)
            scan_results[scan_id]["progress"] = progress
            scan_results[scan_id]["devices"] = devices.copy()
            
            # Small delay to simulate real scanning
            await asyncio.sleep(0.1)
        
        # Complete the scan
        scan_results[scan_id]["status"] = "completed"
        scan_results[scan_id]["progress"] = 100
        scan_results[scan_id]["devices"] = devices
        
    except Exception as e:
        scan_results[scan_id]["status"] = "error"
        scan_results[scan_id]["error"] = str(e)
        print(f"Scan error: {e}")
    
    finally:
        # Remove from active scans
        if scan_id in active_scans:
            del active_scans[scan_id]

@app.post("/messages", response_model=MessageResponse)
async def create_message(request: MessageRequest):
    """สร้างข้อความใหม่"""
    message_id = generate_id()
    timestamp = datetime.now().isoformat()
    
    message_data = {
        "id": message_id,
        "message": request.message,
        "user_id": request.user_id,
        "timestamp": timestamp
    }
    
    messages_store.append(message_data)
    
    return MessageResponse(
        id=message_id,
        message=request.message,
        timestamp=timestamp,
        status="success"
    )

@app.get("/messages")
async def get_messages():
    """ดึงข้อความทั้งหมด"""
    return {
        "messages": messages_store,
        "total": len(messages_store),
        "timestamp": datetime.now().isoformat()
    }

@app.get("/messages/{message_id}")
async def get_message(message_id: str):
    """ดึงข้อความตาม ID"""
    for message in messages_store:
        if message["id"] == message_id:
            return message
    
    raise HTTPException(status_code=404, detail="Message not found")

@app.delete("/messages/{message_id}")
async def delete_message(message_id: str):
    """ลบข้อความตาม ID"""
    for i, message in enumerate(messages_store):
        if message["id"] == message_id:
            deleted_message = messages_store.pop(i)
            return {
                "message": "Message deleted successfully",
                "deleted_message": deleted_message,
                "timestamp": datetime.now().isoformat()
            }
    
    raise HTTPException(status_code=404, detail="Message not found")

# Nmap Scan API Endpoints
@app.post("/scan/start", response_model=ScanResponse)
async def start_scan(request: ScanRequest, background_tasks: BackgroundTasks):
    """เริ่มการสแกนเครือข่ายด้วย nmap"""
    scan_id = generate_id()
    
    # Add to active scans
    active_scans[scan_id] = {
        "target": request.target,
        "scan_type": request.scan_type,
        "started_at": datetime.now().isoformat()
    }
    
    # Start background scan
    background_tasks.add_task(perform_nmap_scan, scan_id, request.target, request.scan_type)
    
    return ScanResponse(
        scan_id=scan_id,
        status="started",
        progress=0,
        devices=[],
        total_devices=0,
        timestamp=datetime.now().isoformat()
    )

@app.get("/scan/{scan_id}", response_model=ScanResponse)
async def get_scan_status(scan_id: str):
    """ดูสถานะการสแกน"""
    if scan_id not in scan_results:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    result = scan_results[scan_id]
    return ScanResponse(
        scan_id=scan_id,
        status=result["status"],
        progress=result["progress"],
        devices=result["devices"],
        total_devices=result["total_devices"],
        timestamp=result["timestamp"]
    )

@app.get("/scan/{scan_id}/devices")
async def get_scan_devices(scan_id: str):
    """ดูรายการอุปกรณ์ที่พบจากการสแกน"""
    if scan_id not in scan_results:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    result = scan_results[scan_id]
    return {
        "scan_id": scan_id,
        "devices": result["devices"],
        "total_devices": result["total_devices"],
        "status": result["status"],
        "timestamp": result["timestamp"]
    }

@app.delete("/scan/{scan_id}")
async def cancel_scan(scan_id: str):
    """ยกเลิกการสแกน"""
    if scan_id in active_scans:
        del active_scans[scan_id]
        if scan_id in scan_results:
            scan_results[scan_id]["status"] = "cancelled"
        return {"message": "Scan cancelled successfully"}
    
    if scan_id in scan_results:
        return {"message": "Scan already completed or not found"}
    
    raise HTTPException(status_code=404, detail="Scan not found")

@app.get("/scans")
async def list_scans():
    """ดูรายการการสแกนทั้งหมด"""
    return {
        "active_scans": list(active_scans.keys()),
        "completed_scans": [scan_id for scan_id, result in scan_results.items() 
                           if result["status"] in ["completed", "error", "cancelled"]],
        "total_scans": len(scan_results)
    }

@app.get("/network/info")
async def get_network_info():
    """ดูข้อมูลเครือข่ายปัจจุบัน"""
    try:
        # Get network interfaces
        interfaces = []
        for interface, addrs in psutil.net_if_addrs().items():
            for addr in addrs:
                if addr.family == 2:  # IPv4
                    interfaces.append({
                        "interface": interface,
                        "ip": addr.address,
                        "netmask": addr.netmask,
                        "broadcast": addr.broadcast
                    })
        
        # Get default network range
        network_range = get_network_range()
        
        return {
            "network_range": network_range,
            "interfaces": interfaces,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "network_range": "192.168.1.0/24",
            "interfaces": [],
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

