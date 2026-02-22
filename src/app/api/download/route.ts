import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { jobManager } from '@/lib/job-manager';
import ffmpegPath from 'ffmpeg-static';

const DOWNLOAD_DIR = path.join(process.cwd(), 'tmp-downloads');
if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

const LOG_FILE = path.join(process.cwd(), 'snapsave.log');
function log(jobId: string, msg: string) {
    const time = new Date().toISOString();
    const line = `[${time}] [${jobId}] ${msg}\n`;
    fs.appendFileSync(LOG_FILE, line);
    console.log(`[${jobId}] ${msg}`);
}

export async function POST(req: NextRequest) {
    try {
        const { url, quality, format } = await req.json();
        const jobId = Math.random().toString(36).substring(2, 8);

        jobManager.createJob(jobId);

        const isAudio = quality === 'audio';
        // Use %(ext)s so yt-dlp decides the extension
        const outputTemplate = path.join(DOWNLOAD_DIR, `${jobId}.%(ext)s`);

        log(jobId, `URL: ${url} | Quality: ${quality} | Format: ${format} | Audio: ${isAudio}`);

        const args: string[] = [
            '-m', 'yt_dlp',
            '-4',
            '--no-playlist',
            '--newline',
            '-o', outputTemplate,
        ];

        if (isAudio) {
            args.push('-x', '--audio-format', 'mp3', '--audio-quality', '0');
        } else {
            const height = (quality || '720').replace('p', '');
            // Prefer a single stream with both audio+video to avoid merge issues
            // Fallback to separate streams + merge only if needed
            args.push(
                '-f', `best[height<=${height}][ext=mp4]/bestvideo[height<=${height}]+bestaudio/best`,
                '--merge-output-format', 'mp4',
            );
        }

        // Add ffmpeg location for merging
        if (ffmpegPath) {
            log(jobId, `FFmpeg path: ${ffmpegPath}`);
            args.push('--ffmpeg-location', path.dirname(ffmpegPath));
        } else {
            log(jobId, 'WARNING: ffmpeg-static not found!');
        }

        args.push(url);

        log(jobId, `Command: python ${args.join(' ')}`);

        const proc = spawn('python', args, {
            cwd: process.cwd(),
            env: { ...process.env },
        });

        let stderrBuf = '';

        proc.stdout.on('data', (data) => {
            const line = data.toString();
            const match = line.match(/\[download\]\s+(\d+\.?\d*)%/);
            if (match) {
                const pct = parseFloat(match[1]);
                jobManager.updateJob(jobId, {
                    status: 'downloading',
                    percent: Math.min(Math.round(pct * 0.95), 95),
                    message: `Downloading... ${pct.toFixed(1)}%`,
                });
            }
            if (line.includes('[Merger]') || line.includes('Merging')) {
                jobManager.updateJob(jobId, { message: 'Merging audio & video...' });
            }
        });

        proc.stderr.on('data', (data) => {
            stderrBuf += data.toString();
            log(jobId, `STDERR: ${data.toString().trim()}`);
        });

        proc.on('error', (err) => {
            log(jobId, `SPAWN ERROR: ${err.message}`);
            jobManager.updateJob(jobId, { status: 'error', message: 'Failed to start download engine.' });
        });

        proc.on('close', (code) => {
            log(jobId, `Exit code: ${code}`);

            // Give filesystem a moment to flush
            setTimeout(() => {
                const files = fs.readdirSync(DOWNLOAD_DIR);
                const myFiles = files.filter(f => f.startsWith(jobId));
                log(jobId, `My files: ${myFiles.join(', ') || '(none)'}`);

                if (code !== 0) {
                    jobManager.updateJob(jobId, {
                        status: 'error',
                        message: stderrBuf.includes('Unsupported URL')
                            ? 'This site is not supported.'
                            : `Download failed (code ${code}).`,
                    });
                    return;
                }

                // Find the best output file
                // Priority: non-temp completed file > any file with this jobId
                const completedFile = myFiles.find(f =>
                    !f.includes('.f') &&          // Not an intermediate stream file (.f136, .f140)
                    !f.endsWith('.part') &&        // Not a partial download
                    !f.includes('.temp')           // Not a temp file
                );

                if (completedFile) {
                    log(jobId, `SUCCESS: ${completedFile}`);
                    jobManager.updateJob(jobId, {
                        status: 'complete',
                        percent: 100,
                        message: 'Ready!',
                        fileName: completedFile,
                    });
                } else if (myFiles.length > 0) {
                    // Fallback: if we have stream files but no merged file, use the largest one
                    log(jobId, 'No merged file found, picking largest stream file...');
                    const largest = myFiles
                        .map(f => ({ name: f, size: fs.statSync(path.join(DOWNLOAD_DIR, f)).size }))
                        .sort((a, b) => b.size - a.size)[0];

                    if (largest) {
                        // Rename to a clean name
                        const ext = path.extname(largest.name);
                        const cleanName = `${jobId}${ext}`;
                        fs.renameSync(
                            path.join(DOWNLOAD_DIR, largest.name),
                            path.join(DOWNLOAD_DIR, cleanName)
                        );
                        log(jobId, `Renamed ${largest.name} -> ${cleanName}`);
                        jobManager.updateJob(jobId, {
                            status: 'complete',
                            percent: 100,
                            message: 'Ready! (video only, audio merge unavailable)',
                            fileName: cleanName,
                        });
                    } else {
                        jobManager.updateJob(jobId, { status: 'error', message: 'File not found after download.' });
                    }
                } else {
                    log(jobId, 'ERROR: No files found at all!');
                    jobManager.updateJob(jobId, { status: 'error', message: 'Download completed but no file was saved.' });
                }
            }, 500);
        });

        return NextResponse.json({ jobId });
    } catch (error: any) {
        console.error('Download API error:', error);
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
