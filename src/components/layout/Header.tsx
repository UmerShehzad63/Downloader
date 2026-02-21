'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Sun, Moon, Coffee } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Header() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    return (
        <header className="fixed top-0 w-full z-50 glass border-b border-white/10 px-6 py-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                        S
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold tracking-tight">SnapSave</span>
                        <span className="text-[10px] font-medium text-secondary -mt-1 opacity-70">by Umer shehzad</span>
                    </div>
                </Link>

                <nav className="flex items-center gap-4 sm:gap-6">
                    <Link href="/about" className="hidden sm:block text-sm font-medium hover:text-primary transition-colors">
                        About
                    </Link>
                    <a
                        href="https://buymeacoffee.com/umershehzad"
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2 bg-[#FFDD00] text-black font-bold rounded-xl hover:scale-105 transition-all shadow-lg shadow-[#FFDD00]/20 text-sm whitespace-nowrap"
                    >
                        <Coffee size={18} fill="currentColor" />
                        <span>Buy Me a Coffee</span>
                    </a>
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors shrink-0"
                    >
                        {mounted && theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </nav>
            </div>
        </header>
    );
}
