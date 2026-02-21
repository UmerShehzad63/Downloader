import { Coffee } from "lucide-react";

export default function Hero() {
    return (
        <section className="pt-32 pb-12 px-6 text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 bg-gradient-to-br from-slate-900 via-indigo-600 to-indigo-400 dark:from-white dark:via-indigo-400 dark:to-indigo-300 bg-clip-text text-transparent leading-[1.1] pb-2">
                Download Any Video.<br />
                <span className="text-primary italic">Instantly.</span> Free.
            </h1>
            <p className="text-lg md:text-xl text-secondary max-w-2xl mx-auto mb-8 font-medium">
                The cleanest, fastest, and most private way to save your favorite content. No ads, no tracking, just pure simplicity.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <a
                    href="https://buymeacoffee.com/umershehzad"
                    target="_blank"
                    className="w-full sm:w-auto px-10 py-5 bg-[#FFDD00] text-black font-black text-lg rounded-[2rem] hover:scale-105 transition-all shadow-xl shadow-[#FFDD00]/30 flex items-center justify-center gap-3"
                >
                    <Coffee size={24} fill="currentColor" />
                    Buy Me a Coffee — $5
                </a>
                <div className="flex -space-x-3 items-center">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full border-4 border-background bg-secondary/20 flex items-center justify-center overflow-hidden">
                            <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Supporter" className="w-full h-full object-cover" />
                        </div>
                    ))}
                    <span className="pl-6 text-sm font-bold text-secondary">Supported by 1,200+ users</span>
                </div>
            </div>
        </section>
    );
}
