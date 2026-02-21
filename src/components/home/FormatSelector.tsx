'use client';

import { motion } from 'framer-motion';
import { Video, Music, Info, Download } from 'lucide-react';
import { clsx } from 'clsx';
import { VideoMetadata } from '@/lib/yt-dlp';

interface FormatSelectorProps {
    metadata: VideoMetadata;
    selectedFormatId: string;
    onSelect: (id: string, format: string, quality: string) => void;
    onDownload: () => void;
    isLoading: boolean;
}

export default function FormatSelector({
    metadata,
    selectedFormatId,
    onSelect,
    onDownload,
    isLoading
}: FormatSelectorProps) {
    const videoFormats = metadata.formats.filter(f => f.quality !== 'audio');
    const audioFormats = metadata.formats.filter(f => f.quality === 'audio');

    const selectedFormat = metadata.formats.find(f => f.format_id === selectedFormatId);

    return (
        <div className="w-full max-w-2xl mx-auto mt-8 px-6 relative z-10">
            <div className="glass-card rounded-[2.5rem] p-8 border-white/10 space-y-8 shadow-3xl">
                <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/60 mb-4 block">
                        Select Video Quality
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {videoFormats.map((f) => (
                            <button
                                key={f.format_id}
                                onClick={() => onSelect(f.format_id, f.format, f.quality)}
                                className={clsx(
                                    "flex items-center justify-between px-4 py-4 rounded-2xl border text-sm font-bold transition-all duration-300 group",
                                    selectedFormatId === f.format_id
                                        ? "bg-primary border-primary text-white shadow-xl shadow-primary/40 scale-[1.02]"
                                        : "bg-white/5 border-white/10 text-foreground hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]"
                                )}
                            >
                                <span className="flex items-center gap-2">
                                    <Video size={16} className={clsx(selectedFormatId === f.format_id ? "text-white" : "text-primary")} />
                                    {f.quality}
                                </span>
                                <span className={clsx(
                                    "text-[10px] font-black uppercase tracking-wider",
                                    selectedFormatId === f.format_id ? "text-white/60" : "text-secondary/40"
                                )}>
                                    {f.format}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/60 mb-4 block">
                        Extract Audio Only
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {audioFormats.map((f) => (
                            <button
                                key={f.format_id}
                                onClick={() => onSelect(f.format_id, f.format, f.quality)}
                                className={clsx(
                                    "flex items-center justify-between px-6 py-4 rounded-2xl border text-sm font-bold transition-all duration-300 group",
                                    selectedFormatId === f.format_id
                                        ? "bg-primary border-primary text-white shadow-xl shadow-primary/40 scale-[1.02]"
                                        : "bg-white/5 border-white/10 text-foreground hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]"
                                )}
                            >
                                <span className="flex items-center gap-2">
                                    <Music size={16} className={clsx(selectedFormatId === f.format_id ? "text-white" : "text-primary")} />
                                    {f.bitrate || 'Best Audio'}
                                </span>
                                <span className={clsx(
                                    "text-[10px] font-black uppercase tracking-wider",
                                    selectedFormatId === f.format_id ? "text-white/60" : "text-secondary/40"
                                )}>
                                    MP3
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/5 text-sm font-medium text-secondary">
                        <Info size={16} className="text-primary" />
                        <span>Estimated Size: <span className="text-foreground font-bold">{selectedFormat?.size_mb ? `~${selectedFormat.size_mb} MB` : 'Unknown'}</span></span>
                    </div>

                    <button
                        onClick={onDownload}
                        disabled={isLoading || !selectedFormatId}
                        className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-primary to-blue-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-primary/40 hover:shadow-primary/60 hover:scale-[1.05] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                    >
                        <Download size={24} />
                        <span>Download Now</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
