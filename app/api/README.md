# IoT Security Scanner API

FastAPI backend สำหรับการสแกนอุปกรณ์ IoT ด้วย nmap

## วิธีการติดตั้ง

1. ติดตั้ง dependencies:
```bash
pip install -r requirements.txt
```

2. ติดตั้ง nmap (จำเป็น):
   - **Windows**: ดาวน์โหลดจาก https://nmap.org/download.html
   - **Linux**: `sudo apt-get install nmap`
   - **macOS**: `brew install nmap`

## วิธีการรัน API

```bash
cd app/api
python main.py
```

หรือใช้ uvicorn โดยตรง:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API จะทำงานที่: http://localhost:8000

## API Endpoints

### Network Scanning

- `POST /scan/start` - เริ่มการสแกนเครือข่าย
  ```json
  {
    "target": "192.168.1.0/24",
    "scan_type": "port"
  }
  ```

- `GET /scan/{scan_id}` - ดูสถานะการสแกน
- `GET /scan/{scan_id}/devices` - ดูรายการอุปกรณ์ที่พบ
- `DELETE /scan/{scan_id}` - ยกเลิกการสแกน
- `GET /scans` - ดูรายการการสแกนทั้งหมด
- `GET /network/info` - ดูข้อมูลเครือข่ายปัจจุบัน

### Health Check

- `GET /health` - ตรวจสอบสถานะ API

## การทดสอบ

เปิด browser ไปที่:
- API Docs: http://localhost:8000/docs
- Alternative Docs: http://localhost:8000/redoc

## หมายเหตุ

- ต้องรัน API ด้วยสิทธิ์ Administrator/sudo เพื่อให้ nmap สแกนได้เต็มที่
- สำหรับ Windows, อาจต้องปิด Firewall หรืออนุญาตให้ nmap ทำงาน
