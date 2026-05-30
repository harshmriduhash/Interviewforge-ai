import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        emailVerified: true, // Skip OTP for MVP
        tier: "free",
        userProgress: {
          create: {
            readinessScore: 0,
            totalSessions: 0,
            totalDurationMinutes: 0,
            currentStreak: 0,
            longestStreak: 0,
            weakTopics: [],
            strongTopics: [],
            questionsSeen: [],
          },
        },
      },
      select: { id: true, name: true, email: true, tier: true },
    });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (err) {
    console.error("[REGISTER ERROR]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
