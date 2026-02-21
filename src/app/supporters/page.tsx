import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Heart, Coffee } from 'lucide-react';

const MOCK_SUPPORTERS = [
    { name: 'Sarah M.', amount: 5, message: 'Love this tool!', date: '2025-01-14' },
    { name: 'Anonymous', amount: 3, message: null, date: '2025-01-13' },
    { name: 'DevDude42', amount: 10, message: 'No ads = instant support', date: '2025-01-12' },
    { name: 'Maria L.', amount: 25, message: 'Best video downloader ever', date: '2025-01-10' },
];

export default function Supporters() {
    return (
        <main className="min-h-screen">
            <Header />

            <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-center">
                <Heart className="mx-auto text-red-500 mb-6 animate-pulse" size={64} fill="currentColor" />
                <h1 className="text-4xl font-black mb-4">Wall of Supporters</h1>
                <p className="text-secondary text-lg mb-12">
                    SnapSave is kept alive by these amazing people.
                </p>

                <div className="glass rounded-3xl overflow-hidden border-white/5 max-w-2xl mx-auto shadow-2xl text-left">
                    <div className="divide-y divide-white/5">
                        {MOCK_SUPPORTERS.map((s, i) => (
                            <div key={i} className="p-6 hover:bg-white/5 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-lg">{s.name}</span>
                                        <span className="text-xs font-bold px-2 py-0.5 bg-primary/20 text-primary rounded-full">
                                            ${s.amount}
                                        </span>
                                    </div>
                                    <span className="text-xs text-secondary font-medium">
                                        {new Date(s.date).toLocaleDateString()}
                                    </span>
                                </div>
                                {s.message && (
                                    <p className="text-secondary italic text-sm">"{s.message}"</p>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="p-8 bg-white/5 border-t border-white/5 text-center">
                        <a
                            href="https://www.buymeacoffee.com/snapsave"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-black font-bold rounded-2xl hover:scale-105 transition-all shadow-xl shadow-accent/20"
                        >
                            <Coffee size={20} />
                            Join them — Buy me a coffee
                        </a>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
