'use client';

import { useState, useEffect, useRef } from 'react';
import { Link2, Clipboard, ArrowRight, X } from 'lucide-react';
import { clsx } from 'clsx';

interface UrlInputProps {
    onExtract: (url: string) => void;
    isLoading: boolean;
}

export default function UrlInput({ onExtract, isLoading }: UrlInputProps) {
    const [url, setUrl] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setUrl(text);
            if (text.startsWith('http')) {
                onExtract(text);
            }
        } catch (err) {
            console.error('Failed to read clipboard');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && url) {
            onExtract(url);
        }
    };

    useEffect(() => {
        const handleGlobalPaste = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
                inputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleGlobalPaste);
        return () => window.removeEventListener('keydown', handleGlobalPaste);
    }, []);

    return (
        <div className="w-full max-w-2xl mx-auto px-6 relative z-10">
            <div className={clsx(
                "relative flex items-center p-2 rounded-[2rem] glass-card transition-all duration-500",
                isLoading ? "opacity-50 pointer-events-none" : "hover:shadow-2xl hover:shadow-primary/20 focus-within:shadow-2xl focus-within:shadow-primary/20 group border-white/10"
            )}>
                <div className="pl-6 pr-2 text-secondary group-focus-within:text-primary transition-colors duration-500">
                    <Link2 size={24} />
                </div>

                <input
                    ref={inputRef}
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Paste video link here..."
                    className="w-full bg-transparent border-none focus:ring-0 text-lg py-5 placeholder:text-secondary/40 outline-none font-medium"
                />

                <div className="flex items-center gap-2 pr-2">
                    {url && (
                        <button
                            onClick={() => setUrl('')}
                            className="p-3 hover:bg-white/10 rounded-xl text-secondary transition-colors"
                        >
                            <X size={20} />
                        </button>
                    )}

                    <button
                        onClick={handlePaste}
                        className="hidden md:flex items-center gap-2 px-5 py-3 hover:bg-white/10 rounded-2xl text-sm font-bold transition-all active:scale-95"
                    >
                        <Clipboard size={18} />
                        <span>Paste</span>
                    </button>

                    <button
                        onClick={() => url && onExtract(url)}
                        disabled={!url || isLoading}
                        className="px-8 py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/30 hover:shadow-primary/50 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span className="hidden sm:inline">Go</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm font-bold tracking-widest uppercase opacity-40">
                <span className="flex items-center gap-2">YouTube</span>
                <span className="flex items-center gap-2">Instagram</span>
                <span className="flex items-center gap-2">TikTok</span>
                <span className="flex items-center gap-2">Twitter</span>
            </div>
        </div>
    );
}
