import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <main className="lg:pl-64 transition-all duration-300">
                <DashboardContent />
            </main>
        </div>
    );
}
