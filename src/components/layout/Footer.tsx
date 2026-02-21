export default function Footer() {
    return (
        <footer className="w-full py-12 px-6 border-t border-white/5 bg-background">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="font-bold">SnapSave</span>
                        <span className="text-sm text-secondary">· Free & Open Source</span>
                    </div>
                    <p className="text-sm text-secondary">
                        Built with ❤️ by Umer shehzad. Sustained by community support.
                    </p>
                </div>

                <div className="flex flex-wrap gap-6 md:justify-end text-sm text-secondary font-medium">
                    <a href="/privacy" className="hover:text-primary">Privacy</a>
                    <a href="/terms" className="hover:text-primary">Terms</a>
                    <a href="https://github.com" className="hover:text-primary">GitHub</a>
                    <a
                        href="https://buymeacoffee.com/umershehzad"
                        className="flex items-center gap-1 text-accent font-bold"
                    >
                        ☕ Buy me a coffee
                    </a>
                </div>
            </div>
        </footer>
    );
}
