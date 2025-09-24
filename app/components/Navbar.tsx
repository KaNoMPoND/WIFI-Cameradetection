'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    
    const navLinks = [
        { title: 'Home', path: '/' },
        { title: 'Scan History', path: '/scan-history' },
        { title: 'Settings', path: '/settings' },
    ];

    const isActive = (path: string) => {
        if (path === '/' && pathname === '/') return true;
        if (path !== '/' && pathname.startsWith(path)) return true;
        return false;
    };
    
    return (
        <nav className="fixed top-0 w-full bg-[rgba(35,37,57,0.95)] backdrop-blur-md border-b border-white/10 p-4 z-50 shadow-lg transition-all duration-300">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-semibold text-white hover:text-blue-400 transition-colors duration-200">
                    IoT Security Scanner
                </Link>
                
                {/* Mobile menu button */}
                <button 
                    className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
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
                <div className="hidden md:flex space-x-1">
                    {navLinks.map(link => (
                        <Link 
                            key={link.path} 
                            href={link.path} 
                            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                                isActive(link.path) 
                                ? 'text-white font-medium bg-blue-600/20 border border-blue-500/30' 
                                : 'text-[#8d8e98] hover:text-white hover:bg-white/10'
                            }`}
                        >
                            {link.title}
                        </Link>
                    ))}
                </div>
            </div>
            
            {/* Mobile navigation */}
            {menuOpen && (
                <div className="md:hidden pt-4 pb-2 px-2 mt-2 bg-[#1a1b2e] rounded-lg border border-white/10 animate-in slide-in-from-top-2 duration-200">
                    {navLinks.map(link => (
                        <Link 
                            key={link.path} 
                            href={link.path} 
                            className={`block py-3 px-4 my-1 rounded-lg transition-all duration-200 ${
                                isActive(link.path) 
                                ? 'bg-blue-600/20 text-white font-medium border border-blue-500/30' 
                                : 'text-[#8d8e98] hover:bg-white/10 hover:text-white'
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