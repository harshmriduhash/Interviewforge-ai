import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const progress = await prisma.userProgress.findUnique({
        where: { userId },
        select: {
            totalSessions: true,
            readinessScore: true,
            // For improvement, we'd ideally compare against initial score, but let's use a mock placeholder or logic if available
        },
    });

    // Calculate improvement (mock logic since we don't have initial score yet)
    const improvement = progress ? Math.round(Number(progress.readinessScore) * 0.4) : 0;

    return NextResponse.json({
        totalSessions: progress?.totalSessions || 0,
        readinessScore: progress?.readinessScore || 0,
        improvement: improvement,
    });
}
