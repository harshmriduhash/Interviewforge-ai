import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id as string;
  const body = await req.json();
  const { role, experience, companies, skills, timeline } = body;

  await prisma.user.update({
    where: { id: userId },
    data: {
      targetRole: role,
      experienceLevel: experience,
      interviewTimeline: timeline || "exploring",
      onboardingCompleted: true,
    },
  });

  // Update initial progress scores from self-assessment
  await prisma.userProgress.upsert({
    where: { userId },
    update: {
      readinessByCompany: companies.reduce((acc: Record<string, number>, c: string) => {
        acc[c.toLowerCase()] = 0;
        return acc;
      }, {}),
    },
    create: {
      userId,
      readinessScore: 0,
      totalSessions: 0,
      totalDurationMinutes: 0,
      currentStreak: 0,
      longestStreak: 0,
      weakTopics: [],
      strongTopics: [],
      questionsSeen: [],
    },
  });

  return NextResponse.json({ success: true });
}
