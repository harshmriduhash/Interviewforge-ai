import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const s = await prisma.session.findUnique({
    where: { id },
    include: {
      company: { select: { name: true, slug: true } },
      exchanges: { orderBy: { exchangeOrder: "asc" } },
    },
  });

  if (!s) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  return NextResponse.json(s);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const {
    status,
    durationSeconds,
    overallScore,
    scoreTechnical,
    scoreCommunication,
    scoreStructure,
    scoreDepth,
    scoreConfidence,
    scoreFillerWords,
    scoreResponseTime,
  } = body;

  const updatedSession = await prisma.session.update({
    where: { id },
    data: {
      status,
      durationSeconds,
      overallScore,
      scoreTechnical,
      scoreCommunication,
      scoreStructure,
      scoreDepth,
      scoreConfidence,
      scoreFillerWords,
      scoreResponseTime,
      endedAt: status === "completed" ? new Date() : undefined,
    },
  });

  // If completed, update longitudinal user progress aggregation
  if (status === "completed") {
    const userId = (session.user as any).id as string;

    const allCompleted = await prisma.session.findMany({
      where: { userId, status: "completed" },
      select: { overallScore: true, durationSeconds: true },
    });

    const totalSessions = allCompleted.length;
    const totalDurationMinutes = Math.round(
      allCompleted.reduce((acc: number, s: any) => acc + (s.durationSeconds || 0), 0) / 60
    );
    const averageOverallScore = allCompleted.reduce((acc: number, s: any) => acc + Number(s.overallScore || 0), 0) / totalSessions;

    await prisma.userProgress.upsert({
      where: { userId },
      update: {
        totalSessions,
        totalDurationMinutes,
        readinessScore: averageOverallScore,
        currentStreak: { increment: 1 },
      },
      create: {
        userId,
        totalSessions,
        totalDurationMinutes,
        readinessScore: averageOverallScore,
        currentStreak: 1,
        longestStreak: 1,
      },
    });
  }

  return NextResponse.json(updatedSession);
}
