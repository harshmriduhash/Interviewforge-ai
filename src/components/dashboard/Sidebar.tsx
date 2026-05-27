"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mic, LayoutDashboard, History, BarChart2, BookOpen, Building2, FileText, Settings, LogOut, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const NAV_ITEMS = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Sessions", href: "/dashboard/sessions", icon: History },
    { name: "Progress", href: "/dashboard/progress", icon: BarChart2 },
    { name: "Question Bank", href: "/dashboard/questions", icon: BookOpen },
    { name: "Company Prep", href: "/dashboard/companies", icon: Building2 },
    { name: "Reports", href: "/dashboard/reports", icon: FileText },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={cn(
                "h-screen fixed left-0 top-0 bg-[#0D0D0D] border-r border-border transition-all duration-300 z-50 flex flex-col",
                collapsed ? "w-20" : "w-64"
            )}
        >
            {/* Sidebar Header */}
            <div className="h-16 flex items-center px-6 border-b border-border/50">
                <Link href="/" className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
                    <Mic className="text-primary w-7 h-7 shrink-0" />
                    {!collapsed && (
                        <>
                            <span className="text-lg font-bold text-white tracking-tighter italic uppercase">InterviewForge</span>
                            <span className="bg-primary px-1 py-0.5 rounded text-[10px] font-black text-white">AI</span>
                        </>
                    )}
                </Link>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 py-6 px-3 space-y-1">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group overflow-hidden whitespace-nowrap",
                                isActive
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "text-text-secondary hover:bg-surface hover:text-white"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 shrink-0 transition-transform group-hover:scale-110", isActive && "text-primary")} />
                            {!collapsed && <span className="font-bold text-[14px]">{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* User / Bottom */}
            <div className="p-4 border-t border-border/50 space-y-4">
                {!collapsed && (
                    <div className="p-4 bg-surface rounded-2xl border border-border/50 group hover:border-primary/50 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">H</div>
                            <div className="overflow-hidden">
                                <p className="text-white text-xs font-bold truncate">Harsh M.</p>
                                <span className="text-[10px] text-primary font-black uppercase tracking-widest bg-primary/10 px-1.5 py-0.5 rounded leading-none">Pro User</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-text-muted italic leading-relaxed">
                            Target: SWE L4 @ Google
                        </p>
                    </div>
                )}

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full flex items-center justify-center p-2 text-text-muted hover:text-white hover:bg-surface rounded-lg transition-all"
                >
                    <ChevronRight className={cn("w-5 h-5 transition-transform duration-300", !collapsed && "rotate-180")} />
                </button>

                <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-text-muted hover:bg-error/10 hover:text-error transition-all overflow-hidden whitespace-nowrap">
                    <LogOut className="w-5 h-5 shrink-0" />
                    {!collapsed && <span className="font-bold text-[14px]">Log Out</span>}
                </button>
            </div>
        </aside>
    );
}
