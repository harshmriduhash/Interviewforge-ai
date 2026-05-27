import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

export default function DashboardPage() {
    return (
        <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex" }}>
            <Sidebar />
            <main style={{ flex: 1, paddingLeft: 240, minHeight: "100vh", transition: "padding-left 0.3s" }}>
                <DashboardContent />
            </main>
        </div>
    );
}
