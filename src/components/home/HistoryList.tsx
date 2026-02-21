'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { History, Trash2, ExternalLink, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HistoryEntry {
    id: string;
    title: string;
    thumbnail: string;
    platform: string;
    quality: string;
    date: string;
}

export default function HistoryList() {
    const [history, setHistory] = useState<HistoryEntry[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('snapsave_history');
        if (saved) {
            setHistory(JSON.parse(saved));
        }
    }, []);

    const clearHistory = () => {
        localStorage.removeItem('snapsave_history');
        setHistory([]);
    };

    if (history.length === 0) return null;

    return (
        <div className="w-full max-w-2xl mx-auto mt-20 px-6 relative z-10">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                        <History size={20} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-black tracking-tight">Recent Downloads</h3>
                </div>
                <button
                    onClick={clearHistory}
                    className="px-4 py-2 rounded-xl text-xs font-black text-red-500/50 hover:text-red-500 hover:bg-red-500/5 transition-all flex items-center gap-2 uppercase tracking-widest"
                >
                    <Trash2 size={14} />
                    Clear All
                </button>
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {history.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-card rounded-2xl p-4 flex items-center gap-5 border-white/5 group hover:border-primary/30 transition-all cursor-default"
                        >
                            <div className="relative w-24 aspect-video rounded-xl overflow-hidden shrink-0 shadow-lg">
                                <img
                                    src={item.thumbnail}
                                    alt=""
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="text-base font-bold truncate mb-1 group-hover:text-primary transition-colors">{item.title}</h4>
                                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.1em] text-secondary/60">
                                    <span className="text-primary">{item.platform}</span>
                                    <span>·</span>
                                    <span>{item.quality}</span>
                                    <span>·</span>
                                    <span>{new Date(item.date).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="pr-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                    <ExternalLink size={18} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="mt-8 flex items-center justify-center gap-3 py-4 px-6 bg-white/2 rounded-2xl border border-white/5 text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em] max-w-fit mx-auto">
                <ShieldCheck size={14} className="text-green-500/50" />
                History is local-only—your privacy is our priority.
            </div>
        </div>
    );
}
