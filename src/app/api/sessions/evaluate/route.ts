import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `You are an expert technical interview evaluator at a top-tier technology company (Google, Meta, Amazon, Apple, Netflix, Stripe). You evaluate candidate answers with precision, fairness, and brutal honesty. You score across 7 dimensions.

You MUST output ONLY valid JSON matching this exact schema — no markdown fences, no extra text:
{
  "scores": {
    "technical_accuracy": <0-100>,
    "communication_clarity": <0-100>,
    "answer_structure": <0-100>,
    "depth_of_knowledge": <0-100>,
    "confidence": <0-100>,
    "filler_word_ratio": <0-100>,
    "response_time_efficiency": <0-100>
  },
  "overall_score": <0-100>,
  "feedback_summary": "<2-3 sentence honest assessment>",
  "specific_gaps": ["<gap1>", "<gap2>"],
  "model_answer_outline": "<key points of an ideal answer>",
  "next_action": "<followup|next_question|increase_difficulty|decrease_difficulty|end_session>",
  "followup_question": "<string or null>",
  "ai_response": "<what the AI interviewer says out loud next — a follow-up, new question, or closing remark>"
}`;

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { question, answer, roundType, difficulty, exchangeCount } = body;

        if (!question || !answer) {
            return NextResponse.json({ error: "Question and answer are required" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const userPrompt = `
Interview Context:
- Round Type: ${roundType || "algorithms"}
- Difficulty: ${difficulty || "medium"}
- Exchange Number: ${exchangeCount || 1} (if exchange >= 5, consider ending session)

Question Asked: "${question}"

Candidate's Answer: "${answer}"

Evaluate this answer strictly and honestly. Do not sugarcoat. Output the JSON evaluation now.
    `.trim();

        const result = await model.generateContent([
            { text: SYSTEM_PROMPT },
            { text: userPrompt },
        ]);

        const rawText = result.response.text().trim();

        // Strip any markdown fences if Gemini wraps the response
        const cleaned = rawText.replace(/^```json\n?/i, "").replace(/\n?```$/i, "").trim();

        let evaluation: Record<string, unknown>;
        try {
            evaluation = JSON.parse(cleaned);
        } catch {
            console.error("Gemini returned invalid JSON:", cleaned);
            // Fallback: build a default response
            evaluation = {
                scores: {
                    technical_accuracy: 70,
                    communication_clarity: 70,
                    answer_structure: 70,
                    depth_of_knowledge: 70,
                    confidence: 70,
                    filler_word_ratio: 80,
                    response_time_efficiency: 75,
                },
                overall_score: 72,
                feedback_summary: "Your answer showed a reasonable understanding of the topic. Keep going.",
                specific_gaps: ["More depth needed", "Clearer structure would help"],
                model_answer_outline: "A strong answer would cover the core algorithm, time/space complexity, and edge cases.",
                next_action: "next_question",
                followup_question: null,
                ai_response: "Interesting approach. Let me ask you something more challenging.",
            };
        }

        return NextResponse.json({ evaluation });
    } catch (error) {
        console.error("Evaluation API error:", error);
        return NextResponse.json({ error: "Evaluation failed" }, { status: 500 });
    }
}
