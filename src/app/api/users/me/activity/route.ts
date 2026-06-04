import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { startOfDay, subDays } from "date-fns";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id as string;
    const ninetyDaysAgo = subDays(new Date(), 180);

    const sessions = await prisma.session.findMany({
        where: {
            userId,
            createdAt: { gte: ninetyDaysAgo },
        },
        select: { createdAt: true },
    });

    // Group by date
    const activityMap: Record<string, number> = {};
    sessions.forEach(s => {
        const d = s.createdAt.toISOString().split("T")[0];
        activityMap[d] = (activityMap[d] || 0) + 1;
    });

    const activityArray = [];
    for (let i = 0; i < 180; i++) {
        const d = subDays(new Date(), i);
        const dateStr = d.toISOString().split("T")[0];
        activityArray.push({
            date: dateStr,
            count: activityMap[dateStr] || 0,
        });
    }

    return NextResponse.json(activityArray.reverse());
}
