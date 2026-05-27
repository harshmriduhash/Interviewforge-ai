import Link from "next/link";
import { Mic } from "lucide-react";

const ORANGE = "#FF5C00";
const BG = "#070707";
const BORDER = "#2E2E2E";
const TEXT = "#F5F5F5";
const MUTED = "#A3A3A3";
const DIM = "#525252";

export function Footer() {
    return (
        <footer style={{ background: BG, borderTop: `1px solid ${BORDER}`, padding: "80px 24px 40px" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 48, marginBottom: 80 }}>
                    {/* Brand */}
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                            <Mic style={{ color: ORANGE, width: 24, height: 24 }} />
                            <span style={{ fontSize: 16, fontWeight: 800, color: TEXT, letterSpacing: "-0.5px", fontStyle: "italic", textTransform: "uppercase" }}>InterviewForge</span>
                            <span style={{ background: ORANGE, padding: "1px 5px", borderRadius: 4, fontSize: 10, fontWeight: 900, color: "#fff" }}>AI</span>
                        </div>
                        <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.7, maxWidth: 260 }}>
                            Built for engineers who refuse to lose. Practice until you can't fail with the world's most advanced AI interviewer.
                        </p>
                        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                            <a href="https://github.com" target="_blank" rel="noreferrer" style={{ width: 36, height: 36, borderRadius: 8, background: "#141414", border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", color: MUTED, transition: "border-color 0.2s, color 0.2s" }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = ORANGE; e.currentTarget.style.color = ORANGE; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED; }}>
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noreferrer" style={{ width: 36, height: 36, borderRadius: 8, background: "#141414", border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", color: MUTED, transition: "border-color 0.2s, color 0.2s" }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = ORANGE; e.currentTarget.style.color = ORANGE; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.color = MUTED; }}>
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.1em" }}>Product</h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {[["Features", "#features"], ["Pricing", "#pricing"], ["Companies", "/companies"], ["How it Works", "#how-it-works"], ["Changelog", "/changelog"]].map(([label, href]) => (
                                <Link key={label} href={href} style={{ fontSize: 14, color: MUTED, textDecoration: "none", transition: "color 0.2s" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = ORANGE)}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}>{label}</Link>
                            ))}
                        </div>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.1em" }}>Resources</h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {[["Blog", "/blog"], ["System Design Guide", "/guides"], ["LC Patterns PDF", "/patterns"], ["Newsletter", "/newsletter"]].map(([label, href]) => (
                                <Link key={label} href={href} style={{ fontSize: 14, color: MUTED, textDecoration: "none", transition: "color 0.2s" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = ORANGE)}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}>{label}</Link>
                            ))}
                        </div>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 style={{ fontSize: 13, fontWeight: 700, color: TEXT, marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.1em" }}>Legal</h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {[["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"], ["Cookie Policy", "/cookies"], ["GDPR", "/gdpr"]].map(([label, href]) => (
                                <Link key={label} href={href} style={{ fontSize: 14, color: MUTED, textDecoration: "none", transition: "color 0.2s" }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = ORANGE)}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}>{label}</Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{ paddingTop: 32, borderTop: `1px solid ${BORDER}`, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                    <p style={{ fontSize: 12, color: DIM }}>© 2026 InterviewForge AI · Built for engineers who refuse to lose</p>
                    <div style={{ display: "flex", gap: 12 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: DIM, border: `1px solid ${BORDER}`, padding: "4px 8px", borderRadius: 4 }}>SOC 2 TYPE II</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: DIM, border: `1px solid ${BORDER}`, padding: "4px 8px", borderRadius: 4 }}>GDPR</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
