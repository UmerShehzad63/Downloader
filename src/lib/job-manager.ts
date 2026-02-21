import fs from 'fs';
import path from 'path';

type JobStatus = 'queued' | 'downloading' | 'processing' | 'complete' | 'error';

interface Job {
    id: string;
    status: JobStatus;
    percent: number;
    message: string;
    downloadUrl?: string;
    fileName?: string;
}

// File-based job storage so state survives Next.js hot-reloads
const JOBS_DIR = path.join(process.cwd(), 'tmp-downloads', '.jobs');

function ensureJobsDir() {
    if (!fs.existsSync(JOBS_DIR)) {
        fs.mkdirSync(JOBS_DIR, { recursive: true });
    }
}

function jobPath(id: string): string {
    return path.join(JOBS_DIR, `${id}.json`);
}

export const jobManager = {
    createJob: (id: string): Job => {
        ensureJobsDir();
        const job: Job = { id, status: 'queued', percent: 0, message: 'Starting...' };
        fs.writeFileSync(jobPath(id), JSON.stringify(job));
        return job;
    },

    updateJob: (id: string, updates: Partial<Job>) => {
        ensureJobsDir();
        const fp = jobPath(id);
        if (fs.existsSync(fp)) {
            const job = JSON.parse(fs.readFileSync(fp, 'utf-8')) as Job;
            const updated = { ...job, ...updates };
            fs.writeFileSync(fp, JSON.stringify(updated));
        }
    },

    getJob: (id: string): Job | undefined => {
        ensureJobsDir();
        const fp = jobPath(id);
        if (fs.existsSync(fp)) {
            return JSON.parse(fs.readFileSync(fp, 'utf-8')) as Job;
        }
        return undefined;
    },

    deleteJob: (id: string) => {
        const fp = jobPath(id);
        if (fs.existsSync(fp)) {
            fs.unlinkSync(fp);
        }
    },
};
