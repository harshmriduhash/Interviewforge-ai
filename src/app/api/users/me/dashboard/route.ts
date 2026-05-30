import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id as string;

  const [progress, recentSessions, user] = await Promise.all([
    prisma.userProgress.findUnique({ where: { userId } }),
    prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { company: { select: { name: true, slug: true } } },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, tier: true, targetRole: true, experienceLevel: true },
    }),
  ]);

  return NextResponse.json({
    user,
    progress,
    recentSessions,
  });
}
