import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id as string;
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Ensure Stripe customer exists
        let stripeCustomerId = user.stripeCustomerId;
        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name || undefined,
                metadata: { userId: user.id },
            });
            stripeCustomerId = customer.id;
            await prisma.user.update({
                where: { id: userId },
                data: { stripeCustomerId },
            });
        }

        const priceId = process.env.STRIPE_PRO_PRICE_ID;
        if (!priceId || priceId.startsWith("price_PLACEHOLDER")) {
            return NextResponse.json(
                { error: "Stripe price not configured. Set STRIPE_PRO_PRICE_ID in env." },
                { status: 500 }
            );
        }

        const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL || "http://localhost:3000";

        const checkoutSession = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${origin}/dashboard?checkout=success`,
            cancel_url: `${origin}/dashboard?checkout=cancelled`,
            metadata: { userId },
            subscription_data: {
                metadata: { userId },
            },
        });

        return NextResponse.json({ url: checkoutSession.url });
    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
    }
}
