import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const GRADING_SYSTEM_PROMPT = `
You are a Lead Interview Evaluator at a top-tier tech firm (FAANG level). 
You will be provided with a full transcript of an interview session.
Your task is to provide a "Brutally Honest" and "High-Fidelity" final audit.

Analyze the technical accuracy, communication quality, structure, and depth.
Identify exactly where the candidate failed to meet expectations and where they excelled.

You MUST output ONLY valid JSON matching this exact schema:
{
  "overallScore": <0-100>,
  "aiSummary": "A concise, high-impact executive summary (3-4 sentences).",
  "aiStrengths": ["Strength 1", "Strength 2", "Strength 3"],
  "aiWeaknesses": ["Specific Gap 1", "Specific Gap 2", "Specific Gap 3"],
  "aiActionPlan": [
    { "title": "Topic to master", "type": "Technical|Communication|Behavioral", "resource": "Specific resource recommendation" },
    ...
  ],
  "scores": {
    "technical": <0-100>,
    "communication": <0-100>,
    "structure": <0-100>,
    "depth": <0-100>,
    "confidence": <0-100>,
    "fillerWords": <0-100>,
    "responseTime": <0-100>
  }
}
`;

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: sessionId } = await params;
        const { id: userId } = session.user as any;

        // Fetch session and exchanges
        const dbSession = await prisma.session.findUnique({
            where: { id: sessionId },
            include: {
                exchanges: {
                    orderBy: { exchangeOrder: "asc" },
                },
                company: true,
            },
        });

        if (!dbSession || dbSession.userId !== userId) {
            return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }

        // If no exchanges, write a minimal "no data" completion and return success
        if (dbSession.exchanges.length === 0) {
            await prisma.session.update({
                where: { id: sessionId },
                data: {
                    status: "completed",
                    overallScore: 0,
                    aiSummary: "This session ended before any answers were recorded. No verbal response was captured, so a performance evaluation could not be generated. Speak your answers clearly during the next session to receive a detailed FAANG-level audit.",
                    aiStrengths: [],
                    aiWeaknesses: ["No response captured", "Session ended prematurely"],
                    aiActionPlan: [
                        { title: "Complete a full session", type: "General", resource: "Start a new practice session and speak your answers clearly" }
                    ],
                },
            });
            return NextResponse.json({ success: true, noData: true });
        }

        // Build Transcript String
        let transcript = `Interview Context: ${dbSession.company?.name || "General"} - ${dbSession.roundType} (${dbSession.difficulty})\n\n`;
        dbSession.exchanges.forEach((ex, i) => {
            transcript += `Q${i + 1}: ${ex.aiQuestion}\n`;
            transcript += `A${i + 1}: ${ex.userAnswerText || "(No verbal response captured)"}\n\n`;
        });

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent([
            { text: GRADING_SYSTEM_PROMPT },
            { text: `Transcript for Review:\n${transcript}` },
        ]);

        const rawText = result.response.text().trim();
        const cleaned = rawText.replace(/^```json\n?/i, "").replace(/\n?```$/i, "").trim();

        let evaluation: any;
        try {
            evaluation = JSON.parse(cleaned);
        } catch (e) {
            console.error("Gemini Grading Output Error:", cleaned);
            return NextResponse.json({ error: "Failed to parse AI evaluation" }, { status: 500 });
        }

        // Update Session with Final Grade
        await prisma.session.update({
            where: { id: sessionId },
            data: {
                status: "completed",
                overallScore: evaluation.overallScore,
                aiSummary: evaluation.aiSummary,
                aiStrengths: evaluation.aiStrengths,
                aiWeaknesses: evaluation.aiWeaknesses,
                aiActionPlan: evaluation.aiActionPlan as any,
                scoreTechnical: evaluation.scores.technical,
                scoreCommunication: evaluation.scores.communication,
                scoreStructure: evaluation.scores.structure,
                scoreDepth: evaluation.scores.depth,
                scoreConfidence: evaluation.scores.confidence,
                scoreFillerWords: evaluation.scores.fillerWords,
                scoreResponseTime: evaluation.scores.responseTime,
            },
        });

        return NextResponse.json({ success: true, evaluation });
    } catch (error) {
        console.error("Grading API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
