import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    try {
        const pendingRequest = await prisma.accountDeletionRequest.findFirst({
            where: { userId, cancelledAt: null, scheduledAt: { gt: new Date() } },
        });

        if (!pendingRequest) {
            return NextResponse.json({ error: "No pending deletion request found" }, { status: 404 });
        }

        await prisma.$transaction([
            prisma.accountDeletionRequest.update({
                where: { id: pendingRequest.id },
                data: { cancelledAt: new Date() }
            }),
            prisma.user.update({
                where: { id: userId },
                data: { deletedAt: null }
            })
        ]);

        return NextResponse.json({ success: true, message: "Account deletion request cancelled." });
    } catch (error) {
        console.error("Account deletion cancellation error:", error);
        return NextResponse.json({ error: "Failed to cancel deletion request" }, { status: 500 });
    }
}
