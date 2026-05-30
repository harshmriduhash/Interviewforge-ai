"use client";

import Link from "next/link";
import { Mic } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const NAV_LINKS = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
    { name: "Company Prep", href: "/dashboard/companies" },
];

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const { data: session, status } = useSession();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                height: 64,
                transition: "all 0.3s",
                background: scrolled ? "rgba(10,10,10,0.9)" : "transparent",
                backdropFilter: scrolled ? "blur(20px)" : "none",
                borderBottom: scrolled ? "1px solid #2E2E2E" : "1px solid transparent",
            }}
        >
            <div style={{ maxWidth: 1280, margin: "0 auto", height: "100%", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                {/* Logo */}
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                    <Mic style={{ color: "#FF5C00", width: 28, height: 28 }} />
                    <span style={{ fontSize: 20, fontWeight: 800, color: "#F5F5F5", letterSpacing: "-0.5px" }}>InterviewForge</span>
                    <span style={{ background: "#FF5C00", padding: "2px 6px", borderRadius: 4, fontSize: 11, fontWeight: 900, color: "#fff", lineHeight: 1 }}>AI</span>
                </Link>

                {/* Desktop Nav */}
                <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="hidden md:flex">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            style={{ fontSize: 15, fontWeight: 500, color: "#A3A3A3", textDecoration: "none", transition: "color 0.2s" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#F5F5F5")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "#A3A3A3")}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {status === "authenticated" ? (
                        <>
                            <span style={{ fontSize: 13, color: "#A3A3A3", fontWeight: 600 }} className="hidden sm:inline-block">
                                Welcome, <span style={{ color: "#F5F5F5" }}>{session?.user?.name || "Candidate"}</span>
                            </span>
                            <Link
                                href="/dashboard"
                                style={{ fontSize: 14, fontWeight: 700, background: "#FF5C00", color: "#fff", padding: "10px 20px", borderRadius: 8, textDecoration: "none", transition: "background 0.2s", whiteSpace: "nowrap" }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "#E64D00")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "#FF5C00")}
                            >
                                Dashboard →
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/auth/login"
                                style={{ fontSize: 14, fontWeight: 600, color: "#F5F5F5", padding: "8px 16px", border: "1px solid #2E2E2E", borderRadius: 8, textDecoration: "none", transition: "border-color 0.2s" }}
                                className="hidden sm:block"
                                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#FF5C00")}
                                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2E2E2E")}
                            >
                                Login
                            </Link>
                            <Link
                                href="/auth/signup"
                                style={{ fontSize: 14, fontWeight: 700, background: "#FF5C00", color: "#fff", padding: "10px 20px", borderRadius: 8, textDecoration: "none", transition: "background 0.2s", whiteSpace: "nowrap" }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = "#E64D00")}
                                onMouseLeave={(e) => (e.currentTarget.style.background = "#FF5C00")}
                            >
                                Start Free →
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
