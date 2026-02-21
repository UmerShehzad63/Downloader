'use client';

import { motion } from 'framer-motion';
import { Youtube, Instagram, Twitter, Music, Clock, User } from 'lucide-react';
import { VideoMetadata } from '@/lib/yt-dlp';

interface VideoPreviewProps {
    metadata: VideoMetadata | null;
    isLoading: boolean;
}

export default function VideoPreview({ metadata, isLoading }: VideoPreviewProps) {
    if (isLoading) {
        return (
            <div className="w-full max-w-2xl mx-auto mt-12 px-6">
                <div className="glass rounded-3xl p-6 flex flex-col md:flex-row gap-6 animate-pulse">
                    <div className="w-full md:w-48 aspect-video bg-white/10 rounded-2xl" />
                    <div className="flex-1 space-y-4">
                        <div className="h-6 bg-white/10 rounded w-3/4" />
                        <div className="h-4 bg-white/10 rounded w-1/2" />
                        <div className="h-4 bg-white/10 rounded w-1/4" />
                    </div>
                </div>
            </div>
        );
    }

    if (!metadata) return null;

    const getPlatformIcon = (platform: string) => {
        switch (platform.toLowerCase()) {
            case 'youtube': return <Youtube size={16} className="text-red-500" />;
            case 'instagram': return <Instagram size={16} className="text-pink-500" />;
            case 'twitter': case 'x': return <Twitter size={16} className="text-blue-400" />;
            case 'tiktok': return <Music size={16} className="text-cyan-400" />;
            default: return null;
        }
    };

    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return [h > 0 ? h : null, m, s].filter(x => x !== null).map(x => x!.toString().padStart(2, '0')).join(':');
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl mx-auto mt-12 px-6"
        >
            <div className="glass-card rounded-[2.5rem] p-8 flex flex-col md:flex-row gap-8 border-white/10 shadow-3xl relative overflow-hidden group">
                {/* Decorative background accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />

                <div className="relative w-full md:w-48 shrink-0 overflow-hidden rounded-2xl shadow-2xl">
                    <img
                        src={metadata.thumbnail}
                        alt={metadata.title}
                        className="w-full h-full object-cover aspect-video hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 backdrop-blur-md rounded-lg text-[11px] font-black text-white tracking-widest uppercase">
                        {formatDuration(metadata.duration)}
                    </div>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="px-2 py-1 bg-white/5 rounded-lg border border-white/10 flex items-center gap-1.5">
                            {getPlatformIcon(metadata.platform)}
                            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">{metadata.platform}</span>
                        </div>
                    </div>

                    <h2 className="text-xl md:text-2xl font-black leading-tight mb-4 tracking-tight group-hover:text-primary transition-colors duration-300">
                        {metadata.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-secondary">
                        <div className="flex items-center gap-2 py-1 px-3 bg-white/5 rounded-full border border-white/5">
                            <User size={14} className="text-primary" />
                            <span className="truncate max-w-[120px]">{metadata.author}</span>
                        </div>
                        <div className="flex items-center gap-2 py-1 px-3 bg-white/5 rounded-full border border-white/5">
                            <Clock size={14} className="text-primary" />
                            <span>{formatDuration(metadata.duration)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
