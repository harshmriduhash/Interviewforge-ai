import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkRateLimit } from "@/lib/rateLimit";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const DEMO_QUESTIONS = [
    {
        question: "How would you design a URL shortener like bit.ly that handles 1 billion requests per day?",
        roundType: "system_design",
        difficulty: "medium",
    },
    {
        question: "Given an array of integers, find two numbers such that they add up to a specific target. What's your approach and its time complexity?",
        roundType: "algorithms",
        difficulty: "easy",
    },
    {
        question: "Tell me about a time you had to push back on a decision from your manager. How did you handle it?",
        roundType: "behavioral",
        difficulty: "medium",
    },
    {
        question: "Design a distributed rate limiter for an API gateway that handles 100K requests per second across multiple data centers.",
        roundType: "system_design",
        difficulty: "hard",
    },
    {
        question: "How would you implement an LRU cache? Walk me through the data structure choices and trade-offs.",
        roundType: "algorithms",
        difficulty: "medium",
    },
];

const SYSTEM_PROMPT = `You are an expert technical interview evaluator. Evaluate the candidate's answer concisely. Output ONLY valid JSON:
{
  "scores": {
    "technical_accuracy": <0-100>,
    "communication_clarity": <0-100>,
    "answer_structure": <0-100>
  },
  "overall_score": <0-100>,
  "feedback_summary": "<2 sentence honest assessment>",
  "specific_gaps": ["<gap1>", "<gap2>"],
  "model_answer_outline": "<key points of an ideal answer>"
}`;

export async function GET() {
    const question = DEMO_QUESTIONS[Math.floor(Math.random() * DEMO_QUESTIONS.length)];
    return NextResponse.json({ question });
}

export async function POST(req: NextRequest) {
    // Rate limit: 5 demo evaluations per 10 minutes per IP
    const rateLimited = await checkRateLimit(req, {
        limit: 5,
        windowSeconds: 600,
        prefix: "demo_eval",
    });
    if (rateLimited) return rateLimited;

    try {
        const { question, answer } = await req.json();

        if (!question || !answer) {
            return NextResponse.json({ error: "Question and answer required" }, { status: 400 });
        }

        if (answer.length > 2000) {
            return NextResponse.json({ error: "Answer too long (max 2000 chars)" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const userPrompt = `
Question: "${question}"
Candidate's Answer: "${answer}"

Evaluate strictly. Output JSON only.`.trim();

        const result = await model.generateContent([
            { text: SYSTEM_PROMPT },
            { text: userPrompt },
        ]);

        const rawText = result.response.text().trim();
        const cleaned = rawText.replace(/^```json\n?/i, "").replace(/\n?```$/i, "").trim();

        let evaluation: Record<string, unknown>;
        try {
            evaluation = JSON.parse(cleaned);
        } catch {
            evaluation = {
                scores: { technical_accuracy: 65, communication_clarity: 70, answer_structure: 68 },
                overall_score: 68,
                feedback_summary: "Your answer shows basic understanding. Consider elaborating on edge cases and trade-offs.",
                specific_gaps: ["More depth needed", "Consider scalability"],
                model_answer_outline: "A strong answer would cover architecture, trade-offs, and scaling considerations.",
            };
        }

        return NextResponse.json({ evaluation });
    } catch (error) {
        console.error("Demo evaluation error:", error);
        return NextResponse.json({ error: "Evaluation failed" }, { status: 500 });
    }
}
