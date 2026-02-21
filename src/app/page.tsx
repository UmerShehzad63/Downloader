'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import UrlInput from '@/components/home/UrlInput';
import VideoPreview from '@/components/home/VideoPreview';
import FormatSelector from '@/components/home/FormatSelector';
import DownloadProgress from '@/components/home/DownloadProgress';
import HistoryList from '@/components/home/HistoryList';
import { VideoMetadata } from '@/lib/yt-dlp';
import axios from 'axios';

export default function Home() {
    const [isLoading, setIsLoading] = useState(false);
    const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
    const [selectedFormatId, setSelectedFormatId] = useState('');
    const [selectedFormat, setSelectedFormat] = useState({ format: '', quality: '' });
    const [jobStatus, setJobStatus] = useState<'idle' | 'queued' | 'downloading' | 'processing' | 'complete' | 'error'>('idle');
    const [progress, setProgress] = useState<{ percent: number; message: string; download_url?: string; fileName?: string }>({ percent: 0, message: '' });
    const [error, setError] = useState('');

    const [currentUrl, setCurrentUrl] = useState('');

    const handleExtract = async (url: string) => {
        setCurrentUrl(url);
        setIsLoading(true);
        setError('');
        setMetadata(null);
        setJobStatus('idle');

        try {
            const { data } = await axios.post('/api/extract', { url });
            setMetadata(data);
            // Default to best quality
            const best = data.formats.find((f: any) => f.quality === '720p') || data.formats[0];
            if (best) {
                setSelectedFormatId(best.format_id);
                setSelectedFormat({ format: best.format, quality: best.quality });
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to extract video info');
        } finally {
            setIsLoading(false);
        }
    };

    const startDownload = async () => {
        if (!metadata || !selectedFormatId || !currentUrl) return;

        setJobStatus('queued');
        setProgress({ percent: 0, message: 'Initiating download...' });

        try {
            const { data } = await axios.post('/api/download', {
                url: currentUrl,
                quality: selectedFormat.quality,
                format: selectedFormat.format
            });

            const eventSource = new EventSource(`/api/progress/${data.jobId}`);

            eventSource.onmessage = (event) => {
                const update = JSON.parse(event.data);

                if (update.status === 'error') {
                    setJobStatus('error');
                    setProgress(p => ({ ...p, message: update.message || 'Download failed' }));
                    eventSource.close();
                    return;
                }

                if (update.status) setJobStatus(update.status);
                if (update.percent !== undefined) setProgress(p => ({ ...p, percent: update.percent }));
                if (update.message) setProgress(p => ({ ...p, message: update.message }));

                if (update.status === 'complete') {
                    eventSource.close();
                    setProgress(p => ({
                        ...p,
                        percent: 100,
                        message: 'Ready!',
                        download_url: update.download_url,
                        fileName: update.fileName,
                    }));

                    // Auto-trigger download
                    setTimeout(() => {
                        window.location.href = update.download_url;
                    }, 500);

                    // Save to history
                    const historyEntry = {
                        id: data.jobId,
                        title: metadata.title,
                        thumbnail: metadata.thumbnail,
                        platform: metadata.platform,
                        quality: selectedFormat.quality,
                        date: new Date().toISOString()
                    };
                    const saved = JSON.parse(localStorage.getItem('snapsave_history') || '[]');
                    localStorage.setItem('snapsave_history', JSON.stringify([historyEntry, ...saved].slice(0, 50)));
                }
            };

            eventSource.onerror = () => {
                eventSource.close();
                setJobStatus(s => {
                    if (s !== 'complete') {
                        setProgress(p => ({ ...p, message: 'Connection lost. Please try again.' }));
                        return 'error';
                    }
                    return s;
                });
            };

        } catch (err) {
            setJobStatus('error');
            setProgress(p => ({ ...p, message: 'Failed to start download' }));
        }
    };

    return (
        <main className="min-h-screen relative overflow-hidden bg-background">
            {/* Background Blobs */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-blob" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-blob animation-delay-2000" />
                <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px] animate-blob animation-delay-4000" />
            </div>

            <Header />

            <div className="relative z-10 pb-20">
                <Hero />

                <UrlInput onExtract={handleExtract} isLoading={isLoading} />

                {error && (
                    <div className="max-w-2xl mx-auto mt-6 px-6 text-center text-red-500 font-medium">
                        {error}
                    </div>
                )}

                <VideoPreview metadata={metadata} isLoading={isLoading} />

                {metadata && jobStatus === 'idle' && (
                    <FormatSelector
                        metadata={metadata}
                        selectedFormatId={selectedFormatId}
                        onSelect={(id, f, q) => {
                            setSelectedFormatId(id);
                            setSelectedFormat({ format: f, quality: q });
                        }}
                        onDownload={startDownload}
                        isLoading={jobStatus !== 'idle'}
                    />
                )}

                {(jobStatus !== 'idle') && (
                    <DownloadProgress
                        status={jobStatus as any}
                        percent={progress.percent}
                        message={progress.message}
                        downloadUrl={jobStatus === 'complete' ? progress.download_url : undefined}
                        fileName={jobStatus === 'complete' ? progress.fileName : undefined}
                    />
                )}

                <HistoryList />
            </div>

            <Footer />
        </main>
    );
}
