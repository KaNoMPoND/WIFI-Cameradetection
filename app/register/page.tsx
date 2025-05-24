'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '../components/AuthLayout';
import AuthButton from '../components/AuthButton';
import AuthInput from '../components/AuthInput';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // ตรวจสอบรหัสผ่านตรงกัน
    if (formData.password !== formData.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง');
      setLoading(false);
      return;
    }
    
    // สำหรับการ demo จะถือว่าลงทะเบียนสำเร็จเสมอ
    setTimeout(() => {
      setLoading(false);
      // ไปที่หน้า login หลังจากลงทะเบียนสำเร็จ
      router.push('/login');
    }, 1500);
  };

  return (
    <AuthLayout 
      title="สมัครสมาชิก" 
      subtitle="สร้างบัญชีผู้ใช้สำหรับระบบตรวจสอบความปลอดภัยอุปกรณ์ IoT"
    >
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister}>
        <AuthInput
          id="name"
          name="name"
          label="ชื่อ-นามสกุล"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="กรอกชื่อของคุณ"
          required
        />

        <AuthInput
          id="email"
          name="email"
          label="อีเมล"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="กรอกอีเมลของคุณ"
          required
        />

        <AuthInput
          id="password"
          name="password"
          label="รหัสผ่าน"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="กรอกรหัสผ่านของคุณ"
          required
        />

        <AuthInput
          id="confirmPassword"
          name="confirmPassword"
          label="ยืนยันรหัสผ่าน"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="กรอกรหัสผ่านอีกครั้ง"
          className="mb-2"
          required
        />

        <AuthButton
          label="สมัครสมาชิก"
          loadingLabel="กำลังสมัครสมาชิก..."
          loading={loading}
        />
      </form>

      <div className="mt-6 text-center text-sm text-gray-400">
        มีบัญชีอยู่แล้ว?{' '}
        <Link href="/login" className="text-blue-500 hover:text-blue-400">
          เข้าสู่ระบบ
        </Link>
      </div>
    </AuthLayout>
  );
} 