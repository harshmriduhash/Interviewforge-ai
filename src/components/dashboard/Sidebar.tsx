import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mic, LayoutDashboard, History, BarChart2, BookOpen, Building2, FileText, Settings, LogOut, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

const ORANGE = "#FF5C00";
const BG = "#0A0A0A";
const SURFACE = "#141414";
const BORDER = "#2E2E2E";
const TEXT = "#F5F5F5";
const MUTED = "#A3A3A3";
const DIM = "#525252";

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
    const { data: session } = useSession();

    const userName = session?.user?.name || "Candidate";
    const userInitials = userName.charAt(0).toUpperCase();
    const targetRole = (session?.user as any)?.targetRole || "SWE";
    const tier = (session?.user as any)?.tier || "FREE";

    return (
        <aside
            style={{
                height: "100vh",
                position: "fixed",
                left: 0,
                top: 0,
                background: BG,
                borderRight: `1px solid ${BORDER}`,
                transition: "width 0.3s",
                zIndex: 50,
                display: "flex",
                flexDirection: "column",
                width: collapsed ? 72 : 240,
                flexShrink: 0,
            }}
        >
            {/* Header */}
            <div style={{ height: 64, display: "flex", alignItems: "center", padding: "0 16px", borderBottom: `1px solid ${BORDER}`, gap: 8, overflow: "hidden" }}>
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", overflow: "hidden" }}>
                    <Mic style={{ color: ORANGE, width: 28, height: 28, flexShrink: 0 }} />
                    {!collapsed && (
                        <>
                            <span style={{ fontSize: 16, fontWeight: 800, color: TEXT, whiteSpace: "nowrap", letterSpacing: "-0.5px", fontStyle: "italic", textTransform: "uppercase" }}>InterviewForge</span>
                            <span style={{ background: ORANGE, padding: "2px 5px", borderRadius: 4, fontSize: 10, fontWeight: 900, color: "#fff", lineHeight: 1, flexShrink: 0 }}>AI</span>
                        </>
                    )}
                </Link>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: "16px 8px", display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" }}>
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                padding: "10px 12px",
                                borderRadius: 10,
                                textDecoration: "none",
                                transition: "all 0.2s",
                                background: isActive ? "rgba(255,92,0,0.12)" : "transparent",
                                border: `1px solid ${isActive ? "rgba(255,92,0,0.25)" : "transparent"}`,
                                color: isActive ? ORANGE : MUTED,
                                fontWeight: 600,
                                fontSize: 14,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                            }}
                            onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = SURFACE; e.currentTarget.style.color = TEXT; } }}
                            onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = MUTED; } }}
                        >
                            <item.icon style={{ width: 18, height: 18, flexShrink: 0 }} />
                            {!collapsed && <span>{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom */}
            <div style={{ padding: 12, borderTop: `1px solid ${BORDER}`, display: "flex", flexDirection: "column", gap: 8 }}>
                {!collapsed && (
                    <div style={{ padding: 14, background: SURFACE, borderRadius: 12, border: `1px solid ${BORDER}`, marginBottom: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,92,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: ORANGE, fontSize: 14 }}>{userInitials}</div>
                            <div style={{ overflow: "hidden" }}>
                                <p style={{ fontSize: 13, fontWeight: 700, color: TEXT, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{userName}</p>
                                <span style={{ fontSize: 10, background: "rgba(255,92,0,0.15)", color: ORANGE, padding: "1px 6px", borderRadius: 4, fontWeight: 700, display: "inline-block", textTransform: "uppercase" }}>{tier}</span>
                            </div>
                        </div>
                        <p style={{ fontSize: 11, color: DIM, margin: 0, fontStyle: "italic" }}>Target: {targetRole}</p>
                    </div>
                )}

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "8px", background: "transparent", border: `1px solid ${BORDER}`, borderRadius: 8, cursor: "pointer", color: MUTED, transition: "all 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = SURFACE; e.currentTarget.style.color = TEXT; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = MUTED; }}
                >
                    <ChevronRight style={{ width: 16, height: 16, transform: `rotate(${collapsed ? 0 : 180}deg)`, transition: "transform 0.3s" }} />
                </button>

                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "transparent", border: "none", borderRadius: 10, cursor: "pointer", color: MUTED, fontWeight: 600, fontSize: 14, transition: "all 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#EF4444"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = MUTED; }}>
                    <LogOut style={{ width: 18, height: 18, flexShrink: 0 }} />
                    {!collapsed && <span>Log Out</span>}
                </button>
            </div>
        </aside>
    );
}
