# IoT Security Scanner

Web application for checking the security of IoT devices in networks to find vulnerabilities and recommend solutions

## 📑 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Application Screens](#application-screens)
- [Future Development](#future-development)
- [Developer](#developer)

## 🚀 Features

- **IoT Device Scanning** - Automatically find IoT devices in local networks
- **Vulnerability Detection** - Analyze security vulnerabilities in each device
- **Vulnerability Scanning** - Simulate attacks to test real risks
- **Detailed Reports** - Display comprehensive reports with remediation recommendations
- **Scan History Tracking** - View and compare past scan results
- **Personal Settings** - Customize scanning, notifications, and privacy settings
- **Device Whitelist** - Define devices to exclude from scanning

## 🛠 Technologies Used

- **Frontend**
  - [Next.js](https://nextjs.org/) (Version 15.1.7) - React framework for building web applications
  - [React](https://reactjs.org/) (Version 19.0.0) - JavaScript library for building UI
  - [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
  - [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

- **Development Tools**
  - [ESLint](https://eslint.org/) - Tool for checking JavaScript code
  - [PostCSS](https://postcss.org/) - Tool for transforming CSS with JavaScript

## 🔧 การติดตั้ง

### ความต้องการของระบบ

- Node.js 18.x หรือใหม่กว่า
- npm 9.x หรือใหม่กว่า

### ขั้นตอนการติดตั้ง

1. โคลนโปรเจกต์:

```bash
git clone https://github.com/DiiwzZ/iot-security-scanner.git
cd iot-security-scanner
```

2. ติดตั้ง dependencies:

```bash
npm install
```

3. รันเซิร์ฟเวอร์สำหรับการพัฒนา:

```bash
npm run dev
```

4. เปิดเว็บเบราว์เซอร์และไปที่ [http://localhost:3000](http://localhost:3000)

## 📋 วิธีการใช้งาน

1. **การแสกนอุปกรณ์**
   - ไปที่หน้าหลักและกดปุ่ม "เริ่มการแสกน" เพื่อค้นหาอุปกรณ์ IoT ในเครือข่าย
   - ระบบจะแสดงความคืบหน้าการแสกนและแสดงอุปกรณ์ที่พบพร้อมระดับความเสี่ยง

2. **ดูรายละเอียดอุปกรณ์**
   - คลิกที่ปุ่ม "ดูรายละเอียด" ของอุปกรณ์ที่ต้องการเพื่อดูข้อมูลเชิงลึก
   - ดูช่องโหว่ที่ตรวจพบและวิธีการแก้ไข

3. **แสกนช่องโหว่**
   - คลิกที่ปุ่ม "แสกนช่องโหว่" เพื่อจำลองการโจมตีอุปกรณ์
   - ดูผลลัพธ์และประเมินความเสี่ยงที่แท้จริง

4. **ดูประวัติการแสกน**
   - ไปที่หน้า "ประวัติการแสกน" เพื่อดูการแสกนที่ผ่านมา
   - คลิกที่ "ดูรายงาน" เพื่อดูรายละเอียดเพิ่มเติมของการแสกนแต่ละครั้ง

5. **การตั้งค่า**
   - ไปที่หน้า "ตั้งค่า" เพื่อปรับแต่งการทำงานของแอปพลิเคชัน
   - ตั้งค่าการแสกนอัตโนมัติ การแจ้งเตือน และความเป็นส่วนตัว
   - กำหนด Whitelist อุปกรณ์ที่ต้องการยกเว้นจากการสแกน

6. **จัดการ Whitelist**
   - ในหน้าตั้งค่า เลือกแท็บ "การแสกน" และเปิดใช้งาน Whitelist อุปกรณ์
   - เพิ่มอุปกรณ์ใน Whitelist โดยระบุชื่อ, IP Address และ MAC Address
   - ลบอุปกรณ์ออกจาก Whitelist เมื่อต้องการให้ถูกสแกนอีกครั้ง

## 📁 โครงสร้างโปรเจกต์

```
iot-security-scanner/
├── app/                   # โค้ดหลักของแอปพลิเคชัน
│   ├── components/        # React components ที่ใช้ร่วมกัน
│   │   ├── DeviceDetails.tsx # แสดงรายละเอียดอุปกรณ์
│   │   ├── Navbar.tsx     # Navigation bar
│   │   ├── ResultCard.tsx # การ์ดแสดงผลอุปกรณ์ที่ตรวจพบ
│   │   ├── ScanButton.tsx # ปุ่มเริ่มการแสกน
│   │   └── Stats.tsx      # แสดงสถิติการแสกน
│   ├── context/           # React context
│   │   └── ScanContext.tsx # Context สำหรับการจัดการข้อมูลการแสกน
│   ├── report/            # หน้ารายงาน
│   │   └── page.tsx
│   ├── scan-history/      # หน้าประวัติการแสกน
│   │   └── page.tsx
│   ├── settings/          # หน้าตั้งค่า
│   │   └── page.tsx
│   ├── globals.css        # Global CSS
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # หน้าหลัก (หน้าแสกน)
├── public/                # Static files
├── .next/                 # Next.js build output
├── node_modules/          # Dependencies
├── .gitignore             # Git ignore file
├── eslint.config.mjs      # ESLint configuration
├── next-env.d.ts          # Next.js TypeScript declarations
├── next.config.ts         # Next.js configuration
├── package-lock.json      # NPM lock file
├── package.json           # Project dependencies and scripts
├── postcss.config.mjs     # PostCSS configuration
├── README.md              # Project documentation
├── tailwind.config.ts     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## 📱 หน้าจอของแอปพลิเคชัน

แอปพลิเคชันประกอบด้วยหน้าจอหลักดังนี้:

1. **หน้าหลัก (หน้าแสกน)** - หน้าจอหลักสำหรับเริ่มการแสกนและดูผลลัพธ์
2. **หน้ารายละเอียดอุปกรณ์** - แสดงข้อมูลเชิงลึกของอุปกรณ์และช่องโหว่ที่ตรวจพบ
3. **หน้าประวัติการแสกน** - แสดงประวัติการแสกนที่ผ่านมาทั้งหมด
4. **หน้ารายงาน** - แสดงรายงานโดยละเอียดของการแสกนแต่ละครั้ง
5. **หน้าตั้งค่า** - ปรับแต่งการทำงานของแอปพลิเคชัน รวมถึงการกำหนด Whitelist อุปกรณ์

## 🔮 การพัฒนาเพิ่มเติม

- [x] เพิ่มฟีเจอร์ Whitelist อุปกรณ์ในหน้าตั้งค่า
- [ ] เพิ่มการเชื่อมต่อกับฐานข้อมูลจริง
- [ ] พัฒนาระบบการตรวจจับอุปกรณ์แบบ real-time
- [ ] เพิ่มการทดสอบความปลอดภัยขั้นสูง
- [ ] รองรับการสแกนอุปกรณ์ IoT จากระยะไกล
- [ ] พัฒนา API สำหรับการใช้งานร่วมกับระบบอื่น
- [ ] เพิ่มฟีเจอร์การแจ้งเตือนแบบ real-time
- [ ] พัฒนาแอปพลิเคชันบนมือถือ

## 👨‍💻 ผู้พัฒนา

- [ชื่อผู้พัฒนา] - นักพัฒนาหลัก
- ไม่บอก

---

โปรเจกต์นี้พัฒนาด้วย [Next.js](https://nextjs.org/) และ [Tailwind CSS](https://tailwindcss.com/) เริ่มต้นจาก [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app)

📄 [MIT License](./LICENSE) - รายละเอียดลิขสิทธิ์
# WIFI-Cameradetection
