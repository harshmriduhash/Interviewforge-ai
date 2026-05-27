import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Problem } from "@/components/landing/Problem";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { Pricing } from "@/components/landing/Pricing";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/layout/Footer";

export default function LandingPage() {
    return (
        <div className="bg-background text-foreground selection:bg-primary selection:text-white">
            <Navbar />
            <main>
                <Hero />
                <Problem />
                <HowItWorks />
                <Features />
                <Pricing />
                <Testimonials />
                <FAQ />
            </main>
            <Footer />
        </div>
    );
}
