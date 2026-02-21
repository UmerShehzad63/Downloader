import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Coffee, Github, Heart, Shield } from 'lucide-react';

export default function About() {
    return (
        <main className="min-h-screen">
            <Header />

            <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <h1 className="text-4xl font-black mb-8">About SnapSave</h1>

                <div className="glass rounded-3xl p-8 space-y-8 border-white/5">
                    <section className="space-y-4">
                        <p className="text-lg text-secondary leading-relaxed">
                            SnapSave is a free, open-source video downloader built to solve a simple problem:
                            <strong> downloading videos from the internet shouldn't be a nightmare.</strong>
                        </p>
                        <p className="text-lg text-secondary leading-relaxed">
                            I'm Umer shehzad, and I was tired of sketchy download sites full of ads, pop-ups, and malware.
                            So I built the tool I wished existed: fast, clean, and completely free.
                        </p>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                            <Shield className="text-primary mb-4" size={32} />
                            <h3 className="text-xl font-bold mb-2">Privacy First</h3>
                            <p className="text-sm text-secondary">
                                No accounts. No cookies. No tracking. Your download history stays in your browser and never touches our servers.
                            </p>
                        </div>

                        <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                            <Heart className="text-accent mb-4" size={32} />
                            <h3 className="text-xl font-bold mb-2">User Supported</h3>
                            <p className="text-sm text-secondary">
                                No ads or paid tiers. SnapSave is sustained entirely by community donations via "Buy Me a Coffee".
                            </p>
                        </div>
                    </div>

                    <section className="pt-8 border-t border-white/5 space-y-6">
                        <h3 className="text-2xl font-bold italic">The Stack</h3>
                        <p className="text-secondary leading-relaxed">
                            Built with Next.js 14 and Tailwind CSS. Powered by the industry-standard <code className="bg-white/10 px-1.5 py-0.5 rounded text-primary">yt-dlp</code> and <code className="bg-white/10 px-1.5 py-0.5 rounded text-primary">FFmpeg</code> engines.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <a
                                href="https://buymeacoffee.com/umershehzad"
                                target="_blank"
                                className="flex items-center gap-2 px-6 py-3 bg-accent text-black font-bold rounded-xl hover:scale-105 transition-all"
                            >
                                <Coffee size={20} />
                                Buy Me a Coffee — $5
                            </a>
                            <a
                                href="https://github.com"
                                target="_blank"
                                className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
                            >
                                <Github size={20} />
                                Star on GitHub
                            </a>
                        </div>
                    </section>
                </div>
            </div>

            <Footer />
        </main>
    );
}
