"use client";

import Link from "next/link";
import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const NAV_LINKS = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Pricing", href: "/pricing" },
    { name: "Company Prep", href: "/companies" },
    { name: "Blog", href: "/blog" },
];

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-[1000] h-16 transition-all duration-300",
                scrolled ? "glass bg-opacity-95" : "bg-transparent border-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <Mic className="text-primary w-7 h-7 group-hover:scale-110 transition-transform" />
                    <span className="text-xl font-bold text-white tracking-tight">
                        InterviewForge
                    </span>
                    <span className="bg-primary px-1.5 py-0.5 rounded text-[11px] font-black text-white leading-none">
                        AI
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-[15px] font-medium text-text-secondary hover:text-text-primary transition-colors relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full" />
                        </Link>
                    ))}
                </div>

                {/* CTA Zone */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/auth/login"
                        className="hidden sm:block text-[15px] text-white px-4 py-2 border border-border rounded-lg hover:border-primary transition-colors"
                    >
                        Login
                    </Link>
                    <Link
                        href="/auth/signup"
                        className="text-[15px] font-bold bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-lg transition-colors whitespace-nowrap"
                    >
                        Start Free
                    </Link>
                </div>
            </div>
        </nav>
    );
}
