import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Privacy() {
    return (
        <main className="min-h-screen">
            <Header />
            <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
                <div className="glass rounded-2xl p-8 space-y-6 text-secondary border-white/5">
                    <p>
                        At SnapSave, we take your privacy seriously. This policy outlines our commitment to data protection.
                    </p>
                    <h3 className="text-xl font-bold text-foreground">1. No Accounts</h3>
                    <p>We do not require accounts to use our service. We never ask for your email, name, or any other personal identifiers.</p>
                    <h3 className="text-xl font-bold text-foreground">2. No Tracking</h3>
                    <p>We do not use cookies for tracking. We use privacy-friendly analytics that do not track individual users.</p>
                    <h3 className="text-xl font-bold text-foreground">3. Local History</h3>
                    <p>Your download history is stored exclusively in your browser's local storage. This data never touches our servers and is lost if you clear your browser data.</p>
                    <h3 className="text-xl font-bold text-foreground">4. Temporary Storage</h3>
                    <p>Videos processed on our servers are deleted automatically within 10 minutes of completion.</p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
