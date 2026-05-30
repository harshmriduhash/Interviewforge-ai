"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Target, Building, BarChart, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const STEPS = [
  { id: 1, name: "Welcome", icon: Mic },
  { id: 2, name: "Target Role", icon: Target },
  { id: 3, name: "Plan", icon: Building },
  { id: 4, name: "Assessment", icon: BarChart },
  { id: 5, name: "Ready", icon: Rocket },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { update } = useSession();
  const [formData, setFormData] = useState({
    role: "",
    experience: "IC3",
    companies: [] as string[],
    timeline: "exploring",
    skills: { algorithms: 5, systemDesign: 5, behavioral: 5 }
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const completeOnboarding = async () => {
    setSaving(true);
    try {
      await fetch("/api/users/me/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      await update({ onboardingCompleted: true });
    } catch (e) {
      console.error("Onboarding save failed", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary blur-[150px] rounded-full" />
      </div>

      <div className="max-w-2xl w-full z-10 flex flex-col gap-8">
        {/* Progress Bar */}
        <div className="flex justify-between items-center px-2 relative">
          <div className="absolute top-5 left-0 w-full h-px bg-border -z-10" />
          {STEPS.map((step) => (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-background",
                currentStep >= step.id
                  ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(255,92,0,0.3)]"
                  : "border-border text-text-muted"
              )}>
                <step.icon className="w-5 h-5" />
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest",
                currentStep >= step.id ? "text-primary" : "text-text-muted"
              )}>
                {step.name}
              </span>
            </div>
          ))}
        </div>

        <div className="glass p-8 md:p-12 rounded-3xl relative min-h-[500px] flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1"
            >
              {currentStep === 1 && <Step1 next={nextStep} />}
              {currentStep === 2 && <Step2 data={formData} set={setFormData} next={nextStep} />}
              {currentStep === 3 && <Step3 data={formData} set={setFormData} next={nextStep} />}
              {currentStep === 4 && <Step4 data={formData} set={setFormData} next={nextStep} />}
              {currentStep === 5 && <Step5 saving={saving} onComplete={completeOnboarding} />}
            </motion.div>
          </AnimatePresence>

          {currentStep > 1 && currentStep < 5 && (
            <button
              onClick={prevStep}
              className="absolute bottom-12 left-12 text-text-muted hover:text-white font-bold transition-colors"
            >
              ← Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Step1({ next }: { next: () => void }) {
  return (
    <div className="text-center space-y-8 flex flex-col items-center justify-center h-full pt-10">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center animate-pulse border border-primary/20">
        <Mic className="w-10 h-10 text-primary" />
      </div>
      <div className="space-y-4">
        <h2 className="text-4xl font-black text-white">Welcome to InterviewForge.</h2>
        <p className="text-lg text-text-secondary max-w-md mx-auto">
          We&apos;re going to set up your AI interview coach. This takes 3 minutes and makes every session 10× more targeted.
        </p>
      </div>
      <button onClick={next} className="px-10 py-4 bg-primary text-white text-lg font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all mt-8">
        Let&apos;s Build Your Profile →
      </button>
    </div>
  );
}

function Step2({ data, set, next }: any) {
  const roles = ["Software Engineer", "Staff Engineer", "Engineering Manager", "ML Engineer", "Frontend Engineer", "Backend Engineer", "Mobile Engineer", "Product Manager"];
  const levels = ["IC1", "IC2", "IC3", "IC4", "IC5", "IC6+"];
  const timelines = ["Actively interviewing", "1-3 months", "3-6 months", "Exploring"];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-white">What job are you going for?</h2>
        <p className="text-text-secondary">This helps us curate the right question bank for you.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-bold text-text-muted uppercase tracking-wider">Target Role</label>
          <select value={data.role} onChange={(e) => set({ ...data, role: e.target.value })}
            className="w-full bg-surface border border-border p-4 rounded-xl text-white outline-none focus:border-primary transition-colors">
            <option value="" disabled>Select a role</option>
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-text-muted uppercase tracking-wider">Experience Level: <span className="text-primary">{data.experience}</span></label>
          <div className="flex justify-between gap-2">
            {levels.map(l => (
              <button key={l} onClick={() => set({ ...data, experience: l })}
                className={cn("flex-1 py-3 rounded-lg border font-bold transition-all text-sm",
                  data.experience === l ? "border-primary bg-primary/10 text-primary" : "border-border text-text-muted hover:border-text-muted")}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-text-muted uppercase tracking-wider">Interview Timeline</label>
          <select value={data.timeline} onChange={(e) => set({ ...data, timeline: e.target.value })}
            className="w-full bg-surface border border-border p-4 rounded-xl text-white outline-none focus:border-primary transition-colors">
            {timelines.map(t => <option key={t} value={t.toLowerCase().replace(/ /g, "_")}>{t}</option>)}
          </select>
        </div>
      </div>

      <button disabled={!data.role} onClick={next}
        className="w-full py-4 bg-primary text-white text-lg font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
        Continue →
      </button>
    </div>
  );
}

function Step3({ data, set, next }: any) {
  const companies = ["Google", "Meta", "Amazon", "Apple", "Netflix", "Stripe", "Airbnb", "Uber", "OpenAI", "Anthropic"];

  const toggleCompany = (c: string) => {
    const list = data.companies.includes(c)
      ? data.companies.filter((x: string) => x !== c)
      : [...data.companies, c];
    set({ ...data, companies: list.slice(0, 5) });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-white">Target Companies</h2>
        <p className="text-text-secondary">We&apos;ll prioritize questions from these companies&apos; actual rounds. (Max 5)</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {companies.map(c => (
          <button key={c} onClick={() => toggleCompany(c)}
            className={cn("p-4 rounded-xl border font-bold transition-all text-sm",
              data.companies.includes(c) ? "border-primary bg-primary/10 text-primary" : "border-border text-text-muted hover:border-text-secondary")}>
            {c}
          </button>
        ))}
      </div>

      <button onClick={next} className="w-full py-4 bg-primary text-white text-lg font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all">
        {data.companies.length > 0 ? "Save Companies →" : "Skip — Open to All"}
      </button>
    </div>
  );
}

function Step4({ data, set, next }: any) {
  const handleSkill = (skill: string, val: number) => {
    set({ ...data, skills: { ...data.skills, [skill]: val } });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-white">Self Assessment</h2>
        <p className="text-text-secondary">This calibrates your starting difficulty. The AI will immediately test your stated level.</p>
      </div>

      <div className="space-y-8">
        {[
          { key: 'algorithms', label: 'Algorithms / Data Structures' },
          { key: 'systemDesign', label: 'System Design' },
          { key: 'behavioral', label: 'Behavioral / Communication' }
        ].map(s => (
          <div key={s.key} className="space-y-4">
            <div className="flex justify-between items-center text-sm font-bold text-text-muted uppercase tracking-wider">
              <span>{s.label}</span>
              <span className="text-primary text-lg">{data.skills[s.key]}/10</span>
            </div>
            <input type="range" min="1" max="10" value={data.skills[s.key]}
              onChange={(e) => handleSkill(s.key, parseInt(e.target.value))}
              className="w-full accent-primary h-2 bg-surface rounded-lg appearance-none cursor-pointer border border-border" />
          </div>
        ))}
      </div>

      <button onClick={next} className="w-full py-4 bg-primary text-white text-lg font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all">
        Complete Profile →
      </button>
    </div>
  );
}

function Step5({ saving, onComplete }: { saving: boolean; onComplete: () => Promise<void> }) {
  const router = useRouter();

  const handleStart = async () => {
    await onComplete();
    router.push("/session/demo");
  };

  const handleDashboard = async () => {
    await onComplete();
    router.push("/dashboard");
  };

  return (
    <div className="text-center space-y-8 flex flex-col items-center justify-center h-full pt-10">
      <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center border border-success/20">
        <Rocket className="w-10 h-10 text-success" />
      </div>
      <div className="space-y-4">
        <h2 className="text-4xl font-black text-white">Your first session is ready.</h2>
        <p className="text-lg text-text-secondary max-w-md mx-auto">
          We&apos;ve prepared a custom Google L4 SWE Algorithmic session based on your profile.
        </p>
      </div>

      <div className="w-full p-6 bg-surface border border-border rounded-2xl flex items-center justify-between text-left group hover:border-primary transition-colors">
        <div>
          <h4 className="text-white font-bold">Google L4 SWE</h4>
          <p className="text-text-muted text-sm italic">Algorithms Round · 45 Mins</p>
        </div>
        <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-colors">
          <span className="text-white">→</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <button onClick={handleStart} disabled={saving}
          className="flex-1 py-4 bg-primary text-white text-lg font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all text-center disabled:opacity-60">
          {saving ? "Saving..." : "Start My First Session →"}
        </button>
        <button onClick={handleDashboard} disabled={saving}
          className="flex-1 py-4 border border-border hover:border-primary text-white text-lg font-bold rounded-xl transition-all text-center disabled:opacity-60">
          Explore Dashboard
        </button>
      </div>
    </div>
  );
}
