import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export interface VideoMetadata {
  title: string;
  author: string;
  duration: number;
  thumbnail: string;
  platform: string;
  formats: {
    format_id: string;
    quality: string;
    format: string;
    size_mb: number | null;
    has_audio: boolean;
    bitrate?: string;
  }[];
  url: string;
}

export async function extractMetadata(url: string): Promise<VideoMetadata> {
  const { stdout } = await execPromise(`python -m yt_dlp --dump-json --no-playlist "${url}"`);
  const data = JSON.parse(stdout);

  const formats = data.formats.map((f: any) => ({
    format_id: f.format_id,
    quality: f.height ? `${f.height}p` : 'audio',
    format: f.ext,
    size_mb: f.filesize ? Math.round(f.filesize / (1024 * 1024)) : null,
    has_audio: !!f.acodec && f.acodec !== 'none',
    bitrate: f.abr ? `${Math.round(f.abr)}kbps` : undefined,
  }));

  // Filter for common qualities
  const filteredFormats = formats.filter((f: any) =>
    (['360p', '480p', '720p', '1080p', '1440p', '2160p'].includes(f.quality) || f.quality === 'audio')
  );

  return {
    title: data.title,
    author: data.uploader || data.channel,
    duration: data.duration,
    thumbnail: data.thumbnail,
    platform: data.extractor,
    formats: filteredFormats,
    url: url, // Store the original URL
  };
}
