# FastAPI Backend for IoT Security Scanner

## การติดตั้งและรัน

### ข้อกำหนดเบื้องต้น
- Python 3.8+
- nmap ติดตั้งในระบบ

### การติดตั้ง

1. ติดตั้ง Python dependencies:
```bash
cd app/api
pip install -r requirements.txt
```

2. ติดตั้ง nmap:
   - **Windows**: ดาวน์โหลดจาก https://nmap.org/download.html
   - **Ubuntu/Debian**: `sudo apt-get install nmap`
   - **macOS**: `brew install nmap`

### การรัน FastAPI Server

```bash
cd app/api
python main.py
```

หรือใช้ uvicorn โดยตรง:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## API Endpoints

### GET /
- **คำอธิบาย**: ข้อมูลพื้นฐานของ API
- **Response**: ข้อมูล API และสถานะ

### GET /health
- **คำอธิบาย**: ตรวจสอบสถานะของ API และ nmap
- **Response**: สถานะ API และเวอร์ชัน nmap

### POST /scan
- **คำอธิบาย**: แสกนเครือข่ายเพื่อค้นหาอุปกรณ์ IoT
- **Request Body**:
  ```json
  {
    "target": "192.168.1.0/24",
    "scan_type": "quick",
    "ports": "80,443,22"
  }
  ```
- **Response**: รายการอุปกรณ์ที่พบพร้อมข้อมูลความปลอดภัย

### POST /attack
- **คำอธิบาย**: ทดสอบการโจมตีอุปกรณ์เป้าหมาย
- **Request Body**:
  ```json
  {
    "target_ip": "192.168.1.100",
    "attack_type": "default_password",
    "port": 80,
    "service": "http"
  }
  ```
- **Response**: ผลการทดสอบและคำแนะนำ

## ประเภทการแสกน

- **quick**: แสกนเร็ว, ports ที่พบบ่อย
- **full**: แสกนครบทุก ports (ช้า)
- **stealth**: แสกนแบบหลบเลี่ยงการตรวจจับ

## ประเภทการโจมตี

- **default_password**: ทดสอบรหัสผ่านเริ่มต้น
- **brute_force**: ทดสอบ brute force password
- **vulnerability_exploit**: ทดสอบช่องโหว่ที่ทราบ

## ความปลอดภัย

⚠️ **คำเตือน**: ใช้เครื่องมือนี้เฉพาะกับเครือข่ายและอุปกรณ์ที่คุณเป็นเจ้าของหรือได้รับอนุญาตเท่านั้น

## การใช้งานร่วมกับ Next.js

FastAPI จะรันบนพอร์ต 8000 และ Next.js บนพอร์ต 3001
CORS ได้ถูกตั้งค่าให้รองรับการเรียกจาก localhost:3000 และ localhost:3001 แล้ว

