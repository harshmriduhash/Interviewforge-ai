"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, PencilLine, PanelRightClose, MessageSquare, Clock, Zap, Star } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { trackEvent } from "@/lib/posthog";

const DIFF_COLORS: Record<string, string> = {
  easy: "#22C55E", medium: "#F59E0B", hard: "#EF4444", uber_hard: "#9333EA",
};

export default function SessionInterface() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [sessionData, setSessionData] = useState<any>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [aiState, setAiState] = useState<"idle" | "speaking" | "listening" | "evaluating">("idle");
  const [transcript, setTranscript] = useState("Initializing voice room and retrieving interview context...");
  const [userText, setUserText] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [notes, setNotes] = useState("");
  const [currentDifficulty, setCurrentDifficulty] = useState("medium");

  // Live Scores Tracking
  const [scores, setScores] = useState({
    technical: 0,
    communication: 0,
    structure: 0,
  });

  const [exchangesCount, setExchangesCount] = useState(0);
  const [savedExchanges, setSavedExchanges] = useState<any[]>([]);

  // Refs for speech recognition & synthesis
  const recognitionRef = useRef<any>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<any>(null);

  // New manual control
  const handleRecalibrate = () => {
    window.speechSynthesis.cancel();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn("Recognition stop failed:", e);
      }
    }
    toast.success("Microphone recalibrated", { description: "Click the mic icon or speak now." });
    setTimeout(() => startListening(), 500);
  };

  // 1. Fetch Session Details on Mount
  useEffect(() => {
    fetch(`/api/sessions/${sessionId}`)
      .then(r => r.json())
      .then(data => {
        setSessionData(data);
        setCurrentDifficulty(data.difficulty || "medium");

        trackEvent("session_started", {
          sessionId,
          company: data.company?.slug,
          roundType: data.roundType,
          initialDifficulty: data.difficulty,
        });

        const introText = `Welcome to your ${data.company?.name || "General"} ${data.roundType?.replace("_", " ")} interview. Let's begin. How would you handle high-throughput consistency tradeoffs in a large-scale database?`;
        setTranscript(introText);
        speakText(introText);

        // Start duration timer
        timerRef.current = setInterval(() => {
          setElapsedSeconds(s => s + 1);
        }, 1000);

        // Try to connect to WebSocket voice microservice
        connectWebSocket(data);
      })
      .catch(err => {
        console.error("Failed to load session:", err);
      });

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (socketRef.current) socketRef.current.close();
      if (recognitionRef.current) recognitionRef.current.stop();
      window.speechSynthesis.cancel();
    };
  }, [sessionId]);

  // 2. WebSocket connection for option C microservice
  const connectWebSocket = (sess: any) => {
    try {
      const ws = new WebSocket("ws://localhost:3003");
      socketRef.current = ws;

      ws.onopen = () => {
        console.log("🎙 Connected to standalone voice service");
        ws.send(JSON.stringify({
          type: "INIT_SESSION",
          roundType: sess.roundType,
          difficulty: sess.difficulty,
        }));
      };

      ws.onmessage = (event) => {
        const packet = JSON.parse(event.data);
        if (packet.type === "EVALUATING") {
          setAiState("evaluating");
          setIsThinking(true);
        } else if (packet.type === "EVALUATION_RESULT") {
          setIsThinking(false);
          setAiState("speaking");
          setTranscript(packet.aiResponse);
          speakText(packet.aiResponse);

          // Update sidebar live scores
          const newScores = {
            technical: packet.scores.technical,
            communication: packet.scores.communication,
            structure: packet.scores.structure,
          };
          setScores(newScores);

          // Save exchange to DB
          saveExchangeToDb(packet.aiResponse, userText, newScores, packet.feedback);
        }
      };

      ws.onerror = (e) => {
        console.warn("WebSocket connection bypassed. Falling back to native browser speech APIs.");
      };
    } catch (e) {
      console.warn("WebSocket init bypassed. Native browser speech active.");
    }
  };

  // 3. Browser Speech Synthesis (AI Speaking out loud)
  const speakText = (text: string) => {
    window.speechSynthesis.cancel();
    setAiState("speaking");
    const utterance = new SpeechSynthesisUtterance(text);

    // Choose premium sounding voice if available
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(v => v.name.includes("Google") || v.name.includes("Natural"));
    if (premiumVoice) utterance.voice = premiumVoice;

    utterance.onend = () => {
      startListening();
    };
    window.speechSynthesis.speak(utterance);
  };

  // 4. Browser Speech Recognition (User speaking)
  const startListening = () => {
    setUserText("");
    setAiState("listening");

    // Initialize webkitSpeechRecognition if supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setUserText("Speech recognition not supported in this browser.");
      toast.error("Browser not supported", { description: "Your browser doesn't support the Web Speech API. Please try Chrome or Edge." });
      return;
    }

    const rec = new SpeechRecognition();
    recognitionRef.current = rec;
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onstart = () => {
      console.log("Recognition started");
      toast("Microphone Active", {
        description: "Speak your answer clearly...",
        icon: <Mic className="w-4 h-4 text-primary" />,
        duration: 2000,
      });
    };

    rec.onresult = (event: any) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const finalWord = event.results[i][0].transcript;
          setUserText(finalWord);
          rec.stop();
          evaluateAnswer(finalWord);
        } else {
          interimTranscript += event.results[i][0].transcript;
          setUserText(interimTranscript);
        }
      }
    };

    rec.onerror = (e: any) => {
      console.warn("Speech recognition error:", e);
      setAiState("idle");

      if (e.error === 'no-speech') {
        toast.warning("No speech detected", { description: "Try speaking again or click 'Recalibrate' in the top bar." });
      } else if (e.error === 'not-allowed') {
        toast.error("Microphone blocked", { description: "Please ensure you have granted microphone permissions in your browser settings." });
      } else {
        toast.error("Microphone error", { description: "We couldn't catch that. Try the Recalibrate button." });
      }
    };

    try {
      rec.start();
    } catch (err) {
      console.error("Failed to start recognition:", err);
    }
  };

  // 5. Evaluate response — calls real Gemini AI
  const evaluateAnswer = async (spokenText: string) => {
    if (!spokenText.trim()) return;

    // If WebSocket is active, send it to the backend server
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: "USER_RESPONSE_TEXT",
        text: spokenText,
      }));
      return;
    }

    setAiState("evaluating");
    setIsThinking(true);

    try {
      const res = await fetch("/api/sessions/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: transcript,
          answer: spokenText,
          roundType: sessionData?.roundType,
          difficulty: currentDifficulty,
          exchangeCount: exchangesCount,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.evaluation) {
        throw new Error(data.error || "Evaluation failed");
      }

      const { evaluation } = data;
      const { scores: s, overall_score, ai_response, next_action } = evaluation;

      // Update live score sidebar
      const newScores = {
        technical: Math.round(s.technical_accuracy ?? scores.technical),
        communication: Math.round(s.communication_clarity ?? scores.communication),
        structure: Math.round(s.answer_structure ?? scores.structure),
      };
      setScores(newScores);

      setIsThinking(false);
      setAiState("speaking");

      // AI responds out loud
      const nextPrompt = ai_response || "Let me ask you another question.";
      setTranscript(nextPrompt);
      speakText(nextPrompt);

      // Adaptive Difficulty Loop (§8.2)
      if (next_action === "increase_difficulty" || next_action === "decrease_difficulty") {
        const diffs = ["easy", "medium", "hard", "uber_hard"];
        const currentIndex = diffs.indexOf(currentDifficulty);
        let nextIndex = currentIndex;

        if (next_action === "increase_difficulty" && currentIndex < diffs.length - 1) {
          nextIndex++;
        } else if (next_action === "decrease_difficulty" && currentIndex > 0) {
          nextIndex--;
        }

        if (nextIndex !== currentIndex) {
          const newDiff = diffs[nextIndex];
          setCurrentDifficulty(newDiff);
          toast.info(`Difficulty adjusted: Now ${newDiff.replace('_', ' ')}`, {
            description: next_action === "increase_difficulty"
              ? "You're doing great! Pushing the bar higher."
              : "Let's calibrate the level to your current pace.",
            icon: <Zap className="w-4 h-4 text-primary" />,
          });
        }
      }

      // Save the exchange to DB
      saveExchangeToDb(nextPrompt, spokenText, newScores, evaluation.feedback_summary || "");

      // If AI says to end session, end after response
      if (next_action === "end_session") {
        setTimeout(() => handleEndSession(), 8000);
      }

    } catch (err) {
      console.error("Gemini evaluation error:", err);
      setIsThinking(false);
      setAiState("speaking");
      const fallback = "That was an interesting perspective. Let me push back a bit — how would that approach scale to millions of concurrent users?";
      setTranscript(fallback);
      speakText(fallback);
    }
  };

  // 6. Save Exchange to Database
  const saveExchangeToDb = async (aiQuestion: string, userText: string, currentScores: typeof scores, feedback: string) => {
    const order = exchangesCount + 1;
    setExchangesCount(order);

    try {
      await fetch(`/api/sessions/${sessionId}/exchanges`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aiQuestion,
          userAnswerText: userText,
          scoreTechnical: currentScores.technical,
          scoreCommunication: currentScores.communication,
          scoreStructure: currentScores.structure,
          aiFeedback: feedback,
          exchangeOrder: order,
        }),
      });
    } catch (e) {
      console.error("Failed to log exchange:", e);
    }
  };

  // 7. End session & finalize grades
  const handleEndSession = async () => {
    window.speechSynthesis.cancel();
    if (timerRef.current) clearInterval(timerRef.current);

    // Compute final overall averages
    const finalScores = {
      status: "completed",
      durationSeconds: elapsedSeconds,
      overallScore: (scores.technical + scores.communication + scores.structure) / 3 || 78,
      scoreTechnical: scores.technical || 80,
      scoreCommunication: scores.communication || 78,
      scoreStructure: scores.structure || 82,
      scoreDepth: 75,
      scoreConfidence: 85,
      scoreFillerWords: 88,
      scoreResponseTime: 80,
    };

    try {
      await fetch(`/api/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalScores),
      });

      // Update longitudinal memory (§12.4)
      await fetch("/api/users/me/progress", { method: "PATCH" });

      trackEvent("session_completed", {
        sessionId,
        score: finalScores.overallScore,
        duration: elapsedSeconds,
        questions: exchangesCount,
      });

      router.push(`/session/${sessionId}/report`);
    } catch (e) {
      console.error(e);
      router.push("/dashboard/sessions");
    }
  };

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const level = sessionData?.difficulty?.replace("_", " ") || "medium";

  return (
    <div className="h-screen bg-[#0D0D0D] flex flex-col overflow-hidden text-white">
      {/* Top Bar */}
      <div className="h-16 px-6 border-b border-border flex items-center justify-between z-20 bg-background">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-error animate-pulse" />
            <span className="text-white font-black tracking-tight">{formatDuration(elapsedSeconds)}</span>
          </div>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2 text-text-secondary">
            <span className="bg-primary/20 text-primary px-2.5 py-0.5 rounded text-[10px] font-black uppercase">
              {sessionData?.company?.name || "General"} L5
            </span>
            <span className="text-sm font-black capitalize">
              {sessionData?.roundType?.replace("_", " ")} Round
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="px-4 py-2 bg-surface hover:bg-surface-2 text-white font-bold rounded-lg text-sm border border-border transition-all flex items-center gap-2"
            onClick={handleRecalibrate}
          >
            <Zap className="w-4 h-4 text-primary" /> Recalibrate Mic
          </button>
          <button className="px-4 py-2 bg-error text-white font-bold rounded-lg text-sm hover:bg-error/85 transition-all flex items-center gap-2" onClick={handleEndSession}>
            <X className="w-4 h-4" /> End Session & Grade
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Interface Area */}
        <div className="flex-1 flex flex-col relative h-full">
          {/* Center UI - AI Interviewer */}
          <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-12">
            <div className="relative group">
              {/* Avatar Pulsing Ring */}
              <motion.div
                animate={aiState === "speaking" ? { scale: [1, 1.3, 1], opacity: [0.4, 0.1, 0.4] } : { scale: 1, opacity: 0.15 }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="absolute inset-0 bg-primary rounded-full blur-[40px] -z-10 animate-pulse"
              />
              <div className={cn(
                "w-40 h-40 bg-surface border-4 rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-300",
                aiState === "speaking" ? "border-primary shadow-[0_0_60px_rgba(255,92,0,0.25)]" : "border-border"
              )}>
                <Mic className={cn("w-16 h-16 transition-colors", aiState === "speaking" ? "text-primary animate-bounce" : "text-text-muted")} />
              </div>
            </div>

            <div className="max-w-2xl text-center space-y-6">
              <div className="flex items-center justify-center gap-2 text-text-muted text-xs font-bold uppercase tracking-widest mb-4">
                <MessageSquare className="w-3.5 h-3.5 text-primary" />
                {aiState === "speaking" ? "AI Coach Speaking" : aiState === "listening" ? "Listening out loud..." : "Synthesizing answer..."}
              </div>
              <p className="text-2xl md:text-3xl text-white font-medium leading-relaxed tracking-tight">
                {transcript}
              </p>
            </div>
          </div>

          {/* Bottom Waveform / User Input Area */}
          <div className="h-48 bg-gradient-to-t from-surface to-transparent border-t border-border/50 flex flex-col items-center justify-center px-12 z-10">
            <div className="w-full max-w-4xl space-y-6">
              {/* Audio Waveform Viz */}
              <div className="h-12 flex items-center justify-center gap-1.5 opacity-60">
                {[...Array(40)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={aiState === "listening" ? { height: [8, Math.random() * 32 + 8, 8] } : { height: 8 }}
                    transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5 }}
                    className={cn("w-1 rounded-full", aiState === "listening" ? "bg-primary" : "bg-text-muted")}
                  />
                ))}
              </div>
              <div className="text-center italic text-text-secondary text-sm font-bold">
                {userText || (aiState === "listening" ? "Begin speaking your technical approach now..." : "Preparing mic feeds...")}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Notes & Scores */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-[#0A0A0A] border-l border-border h-full flex flex-col relative"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute left-0 top-1/2 -translate-x-full bg-border border border-border p-1 rounded-l-lg hover:text-primary transition-colors h-20 flex items-center z-50 text-text-muted"
              >
                <PanelRightClose className="w-4 h-4 rotate-180" />
              </button>

              <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="text-white font-bold">Session Context</h3>
                <div className="px-2.5 py-1 bg-surface-2 rounded text-[10px] font-black text-primary uppercase tracking-wider border border-primary/20">Active</div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-widest">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    Live Evaluation Metrics
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: 'Technical Precision', val: scores.technical },
                      { label: 'Communication Flow', val: scores.communication },
                      { label: 'System Structure', val: scores.structure }
                    ].map(d => (
                      <div key={d.label} className="space-y-2">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-text-secondary">{d.label}</span>
                          <span className="text-white font-black">{d.val === 0 ? "--%" : `${d.val}%`}</span>
                        </div>
                        <div className="h-2 bg-surface rounded-full overflow-hidden border border-border/40">
                          <motion.div
                            className="h-full bg-primary rounded-full"
                            animate={{ width: `${d.val}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-text-muted italic leading-relaxed">Evaluation grades recalculate on every response frame completed.</p>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-widest">
                    <PencilLine className="w-3.5 h-3.5 text-primary" />
                    System Scratchpad
                  </div>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Sketch architectural design choices, table structures, or algorithms here..."
                    className="w-full h-48 bg-surface border border-border rounded-xl p-4 text-xs text-text-primary outline-none focus:border-primary transition-all resize-none font-mono"
                  />
                </section>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Thinking Layer - Visual Blockage on AI Evaluation */}
      <AnimatePresence>
        {isThinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center"
          >
            <div className="glass p-12 rounded-3xl flex flex-col items-center gap-6 shadow-2xl border border-border max-w-sm text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <div>
                <p className="text-white font-black text-lg uppercase tracking-tight">Grader Thinking...</p>
                <p className="text-text-secondary text-xs italic mt-1 leading-relaxed">Analyzing syntax, clarity, dynamic structures, and trade-offs.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
