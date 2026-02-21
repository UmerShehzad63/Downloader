import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { jobManager } from '@/lib/job-manager';

const DOWNLOAD_DIR = path.join(process.cwd(), 'tmp-downloads');

export async function GET(
    req: NextRequest,
    { params }: { params: { jobId: string } }
) {
    const { jobId } = await params;

    // Find any file belonging to this job
    if (!fs.existsSync(DOWNLOAD_DIR)) {
        return NextResponse.json({ error: 'Download directory missing' }, { status: 404 });
    }

    const files = fs.readdirSync(DOWNLOAD_DIR);
    const fileName = files.find(f =>
        f.startsWith(jobId) &&
        !f.includes('.f') &&       // Skip intermediate stream files
        !f.endsWith('.part') &&
        !f.endsWith('.json')
    );

    if (!fileName) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const filePath = path.join(DOWNLOAD_DIR, fileName);

    if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: 'File went missing' }, { status: 404 });
    }

    const stats = fs.statSync(filePath);
    const fileBuffer = fs.readFileSync(filePath);

    // Determine content type
    const ext = path.extname(fileName).toLowerCase();
    const contentType = ext === '.mp3' ? 'audio/mpeg'
        : ext === '.webm' ? 'video/webm'
            : ext === '.mkv' ? 'video/x-matroska'
                : 'video/mp4';

    const downloadName = `SnapSave_${fileName}`;

    // Schedule deletion after 30 minutes
    setTimeout(() => {
        try {
            // Clean up all files for this job
            const allFiles = fs.readdirSync(DOWNLOAD_DIR);
            allFiles.filter(f => f.startsWith(jobId)).forEach(f => {
                try { fs.unlinkSync(path.join(DOWNLOAD_DIR, f)); } catch { }
            });
            jobManager.deleteJob(jobId);
        } catch (e) {
            console.error('Cleanup error:', e);
        }
    }, 1000 * 60 * 30);

    return new NextResponse(fileBuffer, {
        headers: {
            'Content-Disposition': `attachment; filename="${downloadName}"`,
            'Content-Type': contentType,
            'Content-Length': stats.size.toString(),
        },
    });
}
