import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { reason, feedback } = await req.json();

    try {
        await prisma.$transaction([
            // 1. Record cancellation reason
            prisma.cancellationReason.create({
                data: {
                    userId,
                    reason,
                    feedback,
                },
            }),
            // 2. Update subscription status
            prisma.subscription.update({
                where: { userId },
                data: {
                    cancelAtPeriodEnd: true,
                    status: "cancelled", // In a real app, this would be handled by Stripe webhooks
                    cancelledAt: new Date(),
                },
            }),
            // 3. Downgrade user tier
            prisma.user.update({
                where: { id: userId },
                data: { tier: "free" },
            }),
        ]);

        return NextResponse.json({ success: true, message: "Subscription successfully cancelled." });
    } catch (error) {
        console.error("Cancellation error:", error);
        return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
    }
}
