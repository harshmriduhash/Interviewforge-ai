import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Problem } from "@/components/landing/Problem";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import DemoWidget from "@/components/landing/DemoWidget";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/layout/Footer";

export default function LandingPage() {
    return (
        <div style={{ background: "#0A0A0A", color: "#F5F5F5", minHeight: "100vh" }}>
            <Navbar />
            <main>
                <Hero />
                <Problem />
                <HowItWorks />
                <Features />
                <DemoWidget />
                <Pricing />
                <Testimonials />
                <FAQ />
            </main>
            <Footer />
        </div>
    );
}
