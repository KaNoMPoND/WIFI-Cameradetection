'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '../components/AuthLayout';
import AuthButton from '../components/AuthButton';
import AuthInput from '../components/AuthInput';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // สำหรับการ demo จะล็อกอินอัตโนมัติโดยไม่มีการตรวจสอบ
    setTimeout(() => {
      setLoading(false);
      // ให้เข้าสู่ระบบสำเร็จและไปที่หน้าหลัก
      router.push('/');
    }, 1500);
  };

  return (
    <AuthLayout 
      title="เข้าสู่ระบบ" 
      subtitle="ระบบตรวจสอบความปลอดภัยอุปกรณ์ IoT"
    >
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <AuthInput
          id="email"
          label="อีเมล"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="กรอกอีเมลของคุณ"
          required
        />

        <AuthInput
          id="password"
          label="รหัสผ่าน"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="กรอกรหัสผ่านของคุณ"
          className="mb-2"
          required
        />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-400">
              จดจำฉัน
            </label>
          </div>
          <div className="text-sm">
            <Link href="#" className="text-blue-500 hover:text-blue-400">
              ลืมรหัสผ่าน?
            </Link>
          </div>
        </div>

        <AuthButton
          label="เข้าสู่ระบบ"
          loadingLabel="กำลังเข้าสู่ระบบ..."
          loading={loading}
        />
      </form>

      <div className="mt-6 text-center text-sm text-gray-400">
        ยังไม่มีบัญชี?{' '}
        <Link href="/register" className="text-blue-500 hover:text-blue-400">
          สมัครสมาชิก
        </Link>
      </div>
    </AuthLayout>
  );
} 