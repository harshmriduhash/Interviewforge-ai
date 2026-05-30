"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Sparkles, Mic, Volume2, ShieldCheck, ArrowRight, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

const COMPANIES = [
  { slug: "", name: "General Mock" },
  { slug: "google", name: "Google Track" },
  { slug: "meta", name: "Meta Track" },
  { slug: "stripe", name: "Stripe Track" },
  { slug: "amazon", name: "Amazon Track" },
  { slug: "netflix", name: "Netflix Track" },
];

const ROUNDS = [
  { value: "algorithms", label: "Algorithmic & DS Round", desc: "LeetCode style problem solving, complexity optimization, and structural code walk-throughs." },
  { value: "system_design", label: "Distributed System Design", desc: "High-throughput messaging queues, consistency trade-offs, DB schemas, and geo-scaling." },
  { value: "behavioral", label: "Behavioral & STAR Leadership", desc: "Conflict resolution, stakeholder management, career arc, and deep cultural fit rubrics." },
];

const DIFFICULTIES = [
  { value: "easy", label: "Easy (L3 Expectation)", color: "#22C55E" },
  { value: "medium", label: "Medium (L4 Expectation)", color: "#F59E0B" },
  { value: "hard", label: "Hard (L5 Senior Loop)", color: "#EF4444" },
  { value: "uber_hard", label: "Uber Hard (Staff L6+)", color: "#9333EA" },
];

export default function NewSessionPage() {
  const router = useRouter();
  
  // Selection States
  const [company, setCompany] = useState("");
  const [round, setRound] = useState("system_design");
  const [difficulty, setDifficulty] = useState("medium");
  
  // Mic Pre-flight Check States
  const [micGranted, setMicGranted] = useState<boolean | null>(null);
  const [testingMic, setTestingMic] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [launching, setLaunching] = useState(false);

  // Check initial audio devices if browser supports
  const requestMicPermission = async () => {
    setTestingMic(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicGranted(true);
      
      // Setup simple volume listener for visual micro-animations
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;

      microphone.connect(analyser);
      analyser.connect(javascriptNode);
      javascriptNode.connect(audioContext.destination);

      javascriptNode.onaudioprocess = () => {
        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        let values = 0;

        const length = array.length;
        for (let i = 0; i < length; i++) {
          values += (array[i]);
        }
        const average = values / length;
        setAudioLevel(Math.min(100, Math.round(average * 1.5)));
      };

      // Stop test after 5 seconds to free mic resources
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
        javascriptNode.disconnect();
        analyser.disconnect();
        microphone.disconnect();
        setTestingMic(false);
        setAudioLevel(0);
      }, 5000);

    } catch (e) {
      setMicGranted(false);
      setTestingMic(false);
    }
  };

  const handleLaunch = async () => {
    setLaunching(true);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companySlug: company || null,
          roundType: round,
          difficulty,
        }),
      });
      const data = await res.json();
      if (data.session?.id) {
        router.push(`/session/${data.session.id}`);
      }
    } catch (e) {
      console.error(e);
      setLaunching(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex" }}>
      <Sidebar />
      <main style={{ flex: 1, paddingLeft: 240, minHeight: "100vh" }}>
        <div className="p-8 lg:p-12 max-w-5xl mx-auto space-y-10">
          
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-primary" /> Setup Spoken Mock Panel
            </h1>
            <p className="text-text-secondary">Configure your interview parameters and execute a real-time vocal prep session.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Setup Options Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Option 1: Company Selection */}
              <div className="glass p-6 rounded-2xl border border-border/60 space-y-4">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest block">1. Targeted Track</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {COMPANIES.map(c => (
                    <button
                      key={c.slug}
                      onClick={() => setCompany(c.slug)}
                      className={`p-4 rounded-xl border text-sm font-bold transition-all text-center ${
                        company === c.slug
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-surface border-border text-text-secondary hover:border-text-muted hover:text-white"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 2: Round Type */}
              <div className="glass p-6 rounded-2xl border border-border/60 space-y-4">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest block">2. Round Focus</label>
                <div className="space-y-3">
                  {ROUNDS.map(r => (
                    <button
                      key={r.value}
                      onClick={() => setRound(r.value)}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-4 ${
                        round === r.value
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-surface border-border text-text-secondary hover:border-text-muted"
                      }`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${round === r.value ? "bg-primary" : "bg-text-muted"}`} />
                      <div>
                        <span className={`block font-bold text-sm ${round === r.value ? "text-white" : "text-text-secondary"}`}>{r.label}</span>
                        <span className="block text-xs text-text-muted mt-1 leading-relaxed">{r.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 3: Difficulty */}
              <div className="glass p-6 rounded-2xl border border-border/60 space-y-4">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest block">3. Panel Rigidity</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {DIFFICULTIES.map(d => (
                    <button
                      key={d.value}
                      onClick={() => setDifficulty(d.value)}
                      className={`p-4 rounded-xl border text-xs font-bold transition-all text-center uppercase tracking-wider ${
                        difficulty === d.value
                          ? "bg-primary/15 border-primary"
                          : "bg-surface border-border text-text-muted hover:border-text-muted"
                      }`}
                      style={{
                        color: difficulty === d.value ? d.color : undefined,
                      }}
                    >
                      {d.label.split(" (")[0]}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Pre-Flight mic check & summary Column */}
            <div className="space-y-6">
              
              {/* Mic Diagnostics */}
              <div className="glass p-6 rounded-2xl border border-border/60 space-y-6 text-center">
                <div className="w-12 h-12 rounded-full bg-surface-2 border border-border flex items-center justify-center mx-auto text-primary">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Vocal Panel Diagnostics</h4>
                  <p className="text-text-secondary text-xs mt-1.5 leading-relaxed">
                    InterviewForge relies on microphone input. Let's calibrate your system input.
                  </p>
                </div>

                {micGranted === null ? (
                  <button
                    onClick={requestMicPermission}
                    className="w-full py-2.5 bg-surface border border-border hover:border-primary text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    Calibrate Input Feed
                  </button>
                ) : micGranted ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-success font-bold uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4 fill-success/10" /> Mic Calibrated
                    </div>
                    {testingMic && (
                      <div className="space-y-2">
                        <span className="block text-[10px] text-text-muted font-bold uppercase">Dynamic Sound Level</span>
                        <div className="h-2 bg-surface rounded-full overflow-hidden border border-border">
                          <motion.div className="h-full bg-primary" animate={{ width: `${audioLevel}%` }} transition={{ duration: 0.1 }} />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1.5 text-xs text-error font-bold uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4 fill-error/10" /> Permission Blocked
                  </div>
                )}
              </div>

              {/* Ready Summary Card */}
              <div className="glass p-6 rounded-2xl border border-primary/20 space-y-6 bg-gradient-to-b from-primary/5 to-transparent">
                <div className="space-y-3 text-sm">
                  <h4 className="text-white font-bold text-xs uppercase tracking-widest text-text-muted">Target Panel Summary</h4>
                  <div className="flex justify-between font-bold">
                    <span className="text-text-secondary">Company:</span>
                    <span className="text-white capitalize">{company || "General Mock"}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-text-secondary">Round Focus:</span>
                    <span className="text-white capitalize">{round.replace("_", " ")}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-text-secondary">Difficulty:</span>
                    <span className="text-white capitalize">{difficulty.replace("_", " ")}</span>
                  </div>
                </div>

                <button
                  disabled={launching}
                  onClick={handleLaunch}
                  className="w-full py-4 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-black rounded-xl shadow-xl shadow-primary/25 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                >
                  {launching ? "Configuring workspace..." : "Launch Spoken Panel"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
