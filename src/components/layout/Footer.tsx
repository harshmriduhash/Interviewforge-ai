import Link from "next/link";
import { Mic, Twitter, Linkedin, Github } from "lucide-react";

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
                        <div className="flex gap-4">
                            <Link href="#" className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center border border-border hover:border-primary transition-colors text-text-muted hover:text-primary">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center border border-border hover:border-primary transition-colors text-text-muted hover:text-primary">
                                <Linkedin className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center border border-border hover:border-primary transition-colors text-text-muted hover:text-primary">
                                <Github className="w-5 h-5" />
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
