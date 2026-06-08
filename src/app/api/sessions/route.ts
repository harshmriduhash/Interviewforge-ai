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
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const [sessions, total] = await Promise.all([
    prisma.session.findMany({
      where: { userId },
      include: { company: { select: { name: true, slug: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.session.count({ where: { userId } }),
  ]);

  return NextResponse.json({ sessions, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id as string;
  const body = await req.json();
  const { companySlug, roundType, difficulty } = body;

  let companyId: string | null = null;
  if (companySlug) {
    const company = await prisma.company.findUnique({ where: { slug: companySlug } });
    companyId = company?.id || null;
  }

  // 1. Session Limit Enforcement (§6.1)
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.tier === "free") {
    const sessionCount = await prisma.session.count({
      where: { userId, status: { in: ["completed", "active"] } },
    });
    if (sessionCount >= 10) {
      return NextResponse.json(
        { error: "Free tier limit reached. Please upgrade to Pro for unlimited sessions." },
        { status: 403 }
      );
    }
  }

  const newSession = await prisma.session.create({
    data: {
      userId,
      companyId,
      roundType: roundType || "algorithms",
      difficulty: difficulty || "medium",
      status: "pending",
    },
  });

  return NextResponse.json({ session: newSession }, { status: 201 });
}
