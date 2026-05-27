import Link from "next/link";
import { Mic } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-[#0A0A0A] border-t border-border pt-20 pb-10 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-12 mb-20">
                    {/* Brand Col */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Mic className="text-primary w-6 h-6" />
                            <span className="text-lg font-bold text-white uppercase tracking-tighter italic">InterviewForge</span>
                            <span className="bg-primary px-1 py-0.5 rounded text-[10px] font-black text-white leading-none">AI</span>
                        </div>
                        <p className="text-text-secondary text-sm leading-relaxed">
                            Built for engineers who refuse to lose. Practice until you can't fail with the world's most advanced AI interviewer.
                        </p>
                        <div className="flex gap-4 text-text-muted">
                            <Link href="#" className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center border border-border hover:border-primary transition-colors hover:text-primary">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                            </Link>
                        </div>
                    </div>

                    {/* Product Col */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Product</h4>
                        <ul className="space-y-4 text-sm text-text-secondary">
                            <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
                            <li><Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                            <li><Link href="/companies" className="hover:text-primary transition-colors">Companies</Link></li>
                            <li><Link href="#how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
                            <li><Link href="/changelog" className="hover:text-primary transition-colors">Changelog</Link></li>
                        </ul>
                    </div>

                    {/* Resources Col */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Resources</h4>
                        <ul className="space-y-4 text-sm text-text-secondary">
                            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link href="/guides/system-design" className="hover:text-primary transition-colors">System Design Guide</Link></li>
                            <li><Link href="/patterns/lc" className="hover:text-primary transition-colors">LC Patterns PDF</Link></li>
                            <li><Link href="/newsletter" className="hover:text-primary transition-colors">Newsletter</Link></li>
                        </ul>
                    </div>

                    {/* Legal Col */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Legal</h4>
                        <ul className="space-y-4 text-sm text-text-secondary">
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
                            <li><Link href="/gdpr" className="hover:text-primary transition-colors">GDPR</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[12px] text-text-muted">
                        © 2026 InterviewForge AI · Made for engineers who refuse to lose
                    </p>
                    <div className="flex gap-6 opacity-30 grayscale contrast-0">
                        <span className="text-[10px] font-bold text-white border border-white px-2 py-1 rounded">SOC 2 TYPE II</span>
                        <span className="text-[10px] font-bold text-white border border-white px-2 py-1 rounded">GDPR COMPLIANT</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
