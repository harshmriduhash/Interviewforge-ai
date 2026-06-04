import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id as string;
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user?.stripeCustomerId) {
            return NextResponse.json(
                { error: "No billing account found. Please subscribe first." },
                { status: 400 }
            );
        }

        const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL || "http://localhost:3000";

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: user.stripeCustomerId,
            return_url: `${origin}/dashboard/settings`,
        });

        return NextResponse.json({ url: portalSession.url });
    } catch (error) {
        console.error("Portal error:", error);
        return NextResponse.json({ error: "Failed to create billing portal session" }, { status: 500 });
    }
}
