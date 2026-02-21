import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Terms() {
    return (
        <main className="min-h-screen">
            <Header />
            <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
                <div className="glass rounded-2xl p-8 space-y-6 text-secondary border-white/5">
                    <p>By using SnapSave, you agree to the following terms:</p>
                    <h3 className="text-xl font-bold text-foreground">1. Use for Legal Content</h3>
                    <p>You agree to only use this tool to download content for which you have legal permission or that is in the public domain.</p>
                    <h3 className="text-xl font-bold text-foreground">2. No Commercial Use</h3>
                    <p>SnapSave is provided for personal, non-commercial use only. You may not sell or redistribute content downloaded through our service.</p>
                    <h3 className="text-xl font-bold text-foreground">3. No Guarantees</h3>
                    <p>We provide this service "as is" and do not guarantee uptime or compatibility with any specific website. We are not responsible for any issues arising from the use of this tool.</p>
                    <h3 className="text-xl font-bold text-foreground">4. Fair Use</h3>
                    <p>Please do not abuse the service. We reserve the right to rate-limit or block IPs that engage in automated scraping or other abusive behavior.</p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
