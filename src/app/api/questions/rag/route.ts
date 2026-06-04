import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { queryRelevantQuestions } from "@/lib/pinecone";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id as string;
        const body = await req.json();
        const { roundType, difficulty, company, topK } = body;

        // Get user's progress to inform RAG context
        const userProgress = await prisma.userProgress.findUnique({
            where: { userId },
            select: { weakTopics: true, questionsSeen: true },
        });

        // Try Pinecone RAG first
        const ragResults = await queryRelevantQuestions(
            {
                roundType,
                difficulty,
                weakTopics: userProgress?.weakTopics || [],
                company,
                excludeIds: userProgress?.questionsSeen || [],
            },
            topK || 5
        );

        if (ragResults.length > 0) {
            // Fetch full question data from DB for RAG results
            const questionIds = ragResults.map((r) => r.id);
            const questions = await prisma.question.findMany({
                where: { id: { in: questionIds } },
                include: { company: { select: { name: true, slug: true } } },
            });

            return NextResponse.json({
                questions,
                source: "pinecone_rag",
                count: questions.length,
            });
        }

        // Fallback: DB-based search
        const questions = await prisma.question.findMany({
            where: {
                ...(roundType && { roundType }),
                ...(difficulty && { difficulty }),
                ...(userProgress?.questionsSeen?.length && {
                    id: { notIn: userProgress.questionsSeen },
                }),
            },
            include: { company: { select: { name: true, slug: true } } },
            orderBy: { useCount: "asc" },
            take: topK || 5,
        });

        return NextResponse.json({
            questions,
            source: "database_fallback",
            count: questions.length,
        });
    } catch (error) {
        console.error("RAG query error:", error);
        return NextResponse.json({ error: "Failed to retrieve questions" }, { status: 500 });
    }
}
