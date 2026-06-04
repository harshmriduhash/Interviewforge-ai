import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

// Generate a share token for a session
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id as string;

        // Verify ownership
        const interviewSession = await prisma.session.findFirst({
            where: { id, userId },
        });

        if (!interviewSession) {
            return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }

        // Generate or return existing share token
        let shareToken = interviewSession.shareToken;
        if (!shareToken) {
            shareToken = randomUUID();
            await prisma.session.update({
                where: { id },
                data: { shareToken },
            });
        }

        const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL || "http://localhost:3000";
        const shareUrl = `${origin}/session/${id}/report/share?token=${shareToken}`;

        return NextResponse.json({ shareUrl, shareToken });
    } catch (error) {
        console.error("Share token error:", error);
        return NextResponse.json({ error: "Failed to generate share link" }, { status: 500 });
    }
}

// Revoke a share token
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id as string;

        await prisma.session.updateMany({
            where: { id, userId },
            data: { shareToken: null },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Share revoke error:", error);
        return NextResponse.json({ error: "Failed to revoke share link" }, { status: 500 });
    }
}

// Public: Get shared report data
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
        return NextResponse.json({ error: "Share token required" }, { status: 400 });
    }

    try {
        const interviewSession = await prisma.session.findFirst({
            where: { id, shareToken: token },
            include: {
                exchanges: { orderBy: { exchangeOrder: "asc" } },
                company: { select: { name: true, slug: true } },
            },
        });

        if (!interviewSession) {
            return NextResponse.json({ error: "Invalid or expired share link" }, { status: 404 });
        }

        // Return sanitized data (no user PII)
        return NextResponse.json({
            roundType: interviewSession.roundType,
            difficulty: interviewSession.difficulty,
            status: interviewSession.status,
            durationSeconds: interviewSession.durationSeconds,
            overallScore: interviewSession.overallScore,
            scoreTechnical: interviewSession.scoreTechnical,
            scoreCommunication: interviewSession.scoreCommunication,
            scoreStructure: interviewSession.scoreStructure,
            scoreDepth: interviewSession.scoreDepth,
            scoreConfidence: interviewSession.scoreConfidence,
            scoreFillerWords: interviewSession.scoreFillerWords,
            scoreResponseTime: interviewSession.scoreResponseTime,
            company: interviewSession.company,
            exchanges: interviewSession.exchanges.map((ex) => ({
                exchangeOrder: ex.exchangeOrder,
                aiQuestion: ex.aiQuestion,
                userAnswerText: ex.userAnswerText,
                aiFeedback: ex.aiFeedback,
                scoreTechnical: ex.scoreTechnical,
                scoreCommunication: ex.scoreCommunication,
                scoreStructure: ex.scoreStructure,
            })),
        });
    } catch (error) {
        console.error("Share report error:", error);
        return NextResponse.json({ error: "Failed to load shared report" }, { status: 500 });
    }
}
