'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    
    // ตรวจสอบว่าเป็นหน้า auth หรือไม่
    const isAuthPage = pathname === '/login' || pathname === '/register';
    
    // ถ้าเป็นหน้า auth ไม่ต้องแสดง Navbar
    if (isAuthPage) {
        return null;
    }
    
    const navLinks = [
        { title: 'หน้าหลัก', path: '/' },
        { title: 'ประวัติการแสกน', path: '/scan-history' },
        { title: 'รายงาน', path: '/report' },
        { title: 'ตั้งค่า', path: '/settings' },
        { title: 'เข้าสู่ระบบ', path: '/login' },
    ];

    const isActive = (path: string) => {
        if (path === '/' && pathname === '/') return true;
        if (path !== '/' && pathname.startsWith(path)) return true;
        return false;
    };
    
    return (
        <nav className="fixed top-0 w-full bg-[rgba(35,37,57,0.95)] backdrop-blur-sm p-4 z-50 shadow-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-semibold text-white flex items-center">
                    <span className="mr-2 text-blue-500 text-3xl">🔒</span>
                    <span>IoT Security Scanner</span>
                </Link>
                
                {/* Mobile menu button */}
                <button 
                    className="md:hidden text-white p-2"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-6 w-6" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        {menuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
                
                {/* Desktop navigation */}
                <div className="hidden md:flex space-x-5">
                    {navLinks.map(link => (
                        <Link 
                            key={link.path} 
                            href={link.path} 
                            className={`transition-colors ${
                                isActive(link.path) 
                                ? 'text-white font-medium border-b-2 border-blue-500' 
                                : 'text-[#8d8e98] hover:text-white'
                            }`}
                        >
                            {link.title}
                        </Link>
                    ))}
                </div>
            </div>
            
            {/* Mobile navigation */}
            {menuOpen && (
                <div className="md:hidden pt-4 pb-2 px-2 mt-2 bg-[#1a1b2e] rounded-lg">
                    {navLinks.map(link => (
                        <Link 
                            key={link.path} 
                            href={link.path} 
                            className={`block py-2 px-3 my-1 rounded ${
                                isActive(link.path) 
                                ? 'bg-blue-600/20 text-white font-medium border-l-4 border-blue-500' 
                                : 'text-[#8d8e98] hover:bg-[#232539] hover:text-white'
                            }`}
                            onClick={() => setMenuOpen(false)}
                        >
                            {link.title}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
} 