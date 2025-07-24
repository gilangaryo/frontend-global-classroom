// app/(site)/layout.tsx
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}
