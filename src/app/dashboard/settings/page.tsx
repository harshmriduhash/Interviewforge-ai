"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, CreditCard, Shield, AlertTriangle, CheckCircle2, User, Building, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CancelSubscriptionModal } from "@/components/dashboard/CancelSubscriptionModal";
import { DeleteAccountModal } from "@/components/dashboard/DeleteAccountModal";

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [profile, setProfile] = useState({
    name: session?.user?.name || "Candidate",
    email: session?.user?.email || "",
    role: (session?.user as any)?.targetRole || "Software Engineer",
    experience: (session?.user as any)?.experienceLevel || "mid_level",
    targetCompany: (session?.user as any)?.targetCompany || "",
  });

  const [tier, setTier] = useState(session?.user ? (session.user as any).tier : "free");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (session?.user) {
      setProfile({
        name: session.user.name || "",
        email: session.user.email || "",
        role: (session.user as any).targetRole || "Software Engineer",
        experience: (session.user as any).experienceLevel || "mid_level",
        targetCompany: (session.user as any).targetCompany || "",
      });
      setTier((session.user as any).tier || "free");
    }
  }, [session]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulation of profile update
    setTimeout(() => {
      setSuccess("Profile settings successfully synchronized.");
      setLoading(false);
      setTimeout(() => setSuccess(""), 4000);
    }, 800);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex" }}>
      <Sidebar />
      <main style={{ flex: 1, paddingLeft: 240, minHeight: "100vh" }}>
        <div className="p-8 lg:p-12 max-w-4xl mx-auto space-y-10">

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-white tracking-tight">Portal Settings</h1>
            <p className="text-text-secondary">Configure your target objectives, personal credentials, and subscription status</p>
          </div>

          {/* Success Banner */}
          {success && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-success/15 border border-success/30 p-4 rounded-xl text-success text-sm flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-5 h-5 fill-success/10" />
              {success}
            </motion.div>
          )}

          {/* Grid Layout */}
          <div className="space-y-8">

            {/* Component 1: Personal profile */}
            <div className="glass p-8 rounded-3xl border border-border/60 space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-border/40">
                <User className="w-5 h-5 text-primary" />
                <h3 className="text-white font-bold text-lg">Practice Target Profiles</h3>
              </div>

              <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Candidate Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-border rounded-xl text-white outline-none focus:border-primary transition-all text-sm font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Target Role / Track</label>
                  <input
                    type="text"
                    value={profile.role}
                    onChange={e => setProfile({ ...profile, role: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-border rounded-xl text-white outline-none focus:border-primary transition-all text-sm font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Experience Level</label>
                  <select
                    value={profile.experience}
                    onChange={e => setProfile({ ...profile, experience: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-border rounded-xl text-text-secondary outline-none focus:border-primary transition-all text-sm font-bold capitalize"
                  >
                    <option value="entry_level">Entry Level (0-2 YOE)</option>
                    <option value="mid_level">Mid Level (2-5 YOE)</option>
                    <option value="senior_level">Senior Level (5+ YOE)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Target Company Target</label>
                  <input
                    type="text"
                    value={profile.targetCompany}
                    onChange={e => setProfile({ ...profile, targetCompany: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-border rounded-xl text-white outline-none focus:border-primary transition-all text-sm font-bold"
                  />
                </div>

                <div className="md:col-span-2 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-bold rounded-xl text-sm transition-all"
                  >
                    {loading ? "Saving changes..." : "Synchronize Profile"}
                  </button>
                </div>
              </form>
            </div>

            {/* Component 2: Subscriptions */}
            <div className="glass p-8 rounded-3xl border border-border/60 space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-border/40">
                <CreditCard className="w-5 h-5 text-primary" />
                <h3 className="text-white font-bold text-lg">Billing & Membership Plan</h3>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-[#0D0D0D] border border-border rounded-2xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-black text-xl capitalize">{tier} Plan Membership</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${tier === "pro" ? "bg-primary/20 text-primary" : "bg-white/10 text-text-muted"}`}>
                      Active
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm mt-1 leading-relaxed max-w-md">
                    {tier === "pro"
                      ? "Full access unlocked. Spoken adaptive sessions, FAANG-specific report cards, and multi-dimensional longitudinal history tracking are fully active."
                      : "Standard plan. Limited to text-only mock questions. Upgrade to simulate custom speech tracks."}
                  </p>
                </div>

                {tier === "pro" ? (
                  <button
                    onClick={() => setIsCancelModalOpen(true)}
                    className="px-6 py-3 border border-border bg-surface hover:bg-surface-2 text-white font-bold rounded-xl text-xs transition-all whitespace-nowrap"
                  >
                    Cancel Subscription
                  </button>
                ) : (
                  <button
                    className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl text-xs transition-all whitespace-nowrap"
                  >
                    Upgrade to Pro →
                  </button>
                )}
              </div>
            </div>

            {/* Component 3: Danger Zone */}
            <div className="glass p-8 rounded-3xl border border-error/20 space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-error/10">
                <AlertTriangle className="w-5 h-5 text-error" />
                <h3 className="text-white font-bold text-lg">Danger Zone</h3>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h4 className="text-white font-bold text-sm">Purge Account Identity</h4>
                  <p className="text-text-muted text-xs mt-1 leading-relaxed max-w-md">
                    Permanently delete your profile, spoken audio records, and longitudinal readiness history. This process is absolutely irreversible and follows a 12-hour cooling period.
                  </p>
                </div>

                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="px-5 py-3 bg-error/10 hover:bg-error/20 text-error border border-error/20 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" /> Delete My Account
                </button>
              </div>
            </div>

          </div>

        </div>
      </main>

      <AnimatePresence>
        {isCancelModalOpen && (
          <CancelSubscriptionModal
            isOpen={isCancelModalOpen}
            onClose={() => setIsCancelModalOpen(false)}
            onConfirm={() => {
              setTier("free");
              update({ tier: "free" });
            }}
          />
        )}
        {isDeleteModalOpen && (
          <DeleteAccountModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
