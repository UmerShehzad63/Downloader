import { NextRequest, NextResponse } from 'next/server';
import { extractMetadata } from '@/lib/yt-dlp';

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json();
        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        const metadata = await extractMetadata(url);
        return NextResponse.json(metadata);
    } catch (error: any) {
        console.error('Extraction error:', error);
        return NextResponse.json({
            error: 'UNSUPPORTED_URL',
            message: 'Sorry, we don\'t support this site yet or the video is private.'
        }, { status: 400 });
    }
}
