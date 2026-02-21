import { NextRequest } from 'next/server';
import { jobManager } from '@/lib/job-manager';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ jobId: string }> }
) {
    const { jobId } = await params;
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            let closed = false;

            const sendData = (data: any) => {
                if (!closed) {
                    // Use unnamed "message" events so EventSource.onmessage works
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
                }
            };

            const interval = setInterval(() => {
                if (closed) return;

                const job = jobManager.getJob(jobId);
                if (!job) {
                    sendData({ status: 'error', message: 'Job not found. Please try again.' });
                    clearInterval(interval);
                    closed = true;
                    controller.close();
                    return;
                }

                if (job.status === 'complete') {
                    sendData({
                        status: 'complete',
                        percent: 100,
                        message: job.message,
                        download_url: `/api/file/${jobId}`,
                        fileName: job.fileName,
                    });
                    clearInterval(interval);
                    closed = true;
                    controller.close();
                } else if (job.status === 'error') {
                    sendData({ status: 'error', message: job.message });
                    clearInterval(interval);
                    closed = true;
                    controller.close();
                } else {
                    sendData({
                        status: job.status,
                        percent: job.percent,
                        message: job.message,
                    });
                }
            }, 500);

            req.signal.addEventListener('abort', () => {
                clearInterval(interval);
                closed = true;
                try { controller.close(); } catch { }
            });
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-store',
            'Connection': 'keep-alive',
        },
    });
}
