'use client';

import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface DownloadProgressProps {
    status: 'queued' | 'downloading' | 'processing' | 'complete' | 'error';
    percent: number;
    message: string;
    downloadUrl?: string; // Add this
    fileName?: string; // Add this
}

export default function DownloadProgress({ status, percent, message, downloadUrl, fileName }: DownloadProgressProps) {
    const getIcon = () => {
        switch (status) {
            case 'complete': return <CheckCircle2 className="text-green-400" size={32} />;
            case 'error': return <AlertCircle className="text-red-500" size={32} />;
            default: return <Loader2 className="text-primary animate-spin" size={32} />;
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mt-8 px-6 relative z-10">
            <div className={`glass-card rounded-[2.5rem] p-10 border-white/10 shadow-3xl relative overflow-hidden transition-all duration-500 ${status === 'complete' ? 'border-green-500/20 bg-green-500/5' : ''}`}>
                {/* Animated Background Progress */}
                <motion.div
                    className={`absolute inset-0 pointer-events-none transition-colors duration-500 ${status === 'complete' ? 'bg-green-500/5' : 'bg-primary/10'}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: percent / 100 }}
                    style={{ originX: 0 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                />

                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className={`mb-6 p-4 rounded-[1.5rem] border shadow-inner transition-all duration-500 ${status === 'complete' ? 'bg-green-500/10 border-green-500/20' : 'bg-white/5 border-white/10'}`}>
                        {getIcon()}
                    </div>

                    <h3 className="text-2xl font-black mb-2 tracking-tight">
                        {status === 'complete' ? 'Extraction Successful!' : status === 'error' ? 'Oops! Error Occurred' : 'Processing Your Video'}
                    </h3>
                    <p className={`font-medium mb-8 max-w-sm mx-auto transition-colors duration-500 ${status === 'complete' ? 'text-green-500/80' : 'text-secondary'}`}>
                        {message}
                    </p>

                    {status !== 'complete' && (
                        <>
                            <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden mb-6 border border-white/10 p-1">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percent}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>

                            <div className="text-4xl font-black text-primary italic tracking-tighter">
                                {percent}<span className="text-lg opacity-50 not-italic ml-1">%</span>
                            </div>
                        </>
                    )}

                    {status === 'complete' && downloadUrl && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full space-y-4"
                        >
                            <a
                                href={downloadUrl}
                                download={fileName}
                                className="inline-flex items-center gap-3 px-12 py-5 bg-green-500 text-white rounded-2xl font-black text-xl shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 hover:scale-[1.05] active:scale-95 transition-all w-full sm:w-auto"
                            >
                                <CheckCircle2 size={24} />
                                Save to Your Device
                            </a>
                            <p className="text-[10px] font-bold text-secondary uppercase tracking-widest opacity-60">
                                Your download has started automatically. Click above if it didn't.
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
