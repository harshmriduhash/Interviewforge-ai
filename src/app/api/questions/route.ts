import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const company = searchParams.get("company") || undefined;
  const roundType = searchParams.get("round") || undefined;
  const difficulty = searchParams.get("difficulty") || undefined;
  const search = searchParams.get("search") || undefined;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where: Record<string, unknown> = {};
  if (company) where.company = { slug: company };
  if (roundType) where.roundType = roundType;
  if (difficulty) where.difficulty = difficulty;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { body: { contains: search, mode: "insensitive" } },
    ];
  }

  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      where,
      include: { company: { select: { name: true, slug: true } } },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.question.count({ where }),
  ]);

  return NextResponse.json({ questions, total, page, limit });
}
