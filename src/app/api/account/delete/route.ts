import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { password } = await req.json();

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user || !user.passwordHash) {
        return NextResponse.json({ error: "User or password not found" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
        return NextResponse.json({ error: "Incorrect password" }, { status: 403 });
    }

    const scheduledAt = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 hours from now

    try {
        await prisma.$transaction([
            prisma.accountDeletionRequest.create({
                data: {
                    userId,
                    scheduledAt,
                }
            }),
            prisma.user.update({
                where: { id: userId },
                data: { deletedAt: scheduledAt }
            })
        ]);

        return NextResponse.json({ success: true, scheduledAt });
    } catch (error) {
        console.error("Account deletion request error:", error);
        return NextResponse.json({ error: "Failed to schedule account deletion" }, { status: 500 });
    }
}
