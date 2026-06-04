import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
        return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET || ""
        );
    } catch (err: any) {
        console.error("Webhook signature verification failed:", err.message);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                const userId = session.metadata?.userId;
                if (!userId) break;

                const subscriptionId = session.subscription as string;
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);

                // Create or update subscription record
                await prisma.subscription.upsert({
                    where: { userId },
                    create: {
                        userId,
                        stripeSubscriptionId: subscriptionId,
                        stripePriceId: subscription.items.data[0]?.price?.id || null,
                        status: "active",
                        currentPeriodStart: new Date(subscription.current_period_start * 1000),
                        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                    },
                    update: {
                        stripeSubscriptionId: subscriptionId,
                        stripePriceId: subscription.items.data[0]?.price?.id || null,
                        status: "active",
                        currentPeriodStart: new Date(subscription.current_period_start * 1000),
                        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                        cancelAtPeriodEnd: false,
                        cancelledAt: null,
                    },
                });

                // Upgrade user tier
                await prisma.user.update({
                    where: { id: userId },
                    data: { tier: "pro" },
                });

                console.log(`✅ Checkout completed for user ${userId}`);
                break;
            }

            case "invoice.paid": {
                const invoice = event.data.object as Stripe.Invoice;
                const subscriptionId = invoice.subscription as string;
                if (!subscriptionId) break;

                const sub = await prisma.subscription.findFirst({
                    where: { stripeSubscriptionId: subscriptionId },
                });
                if (sub) {
                    const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);
                    await prisma.subscription.update({
                        where: { id: sub.id },
                        data: {
                            status: "active",
                            currentPeriodStart: new Date(stripeSub.current_period_start * 1000),
                            currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
                        },
                    });
                }
                break;
            }

            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;
                const sub = await prisma.subscription.findFirst({
                    where: { stripeSubscriptionId: subscription.id },
                });
                if (sub) {
                    await prisma.$transaction([
                        prisma.subscription.update({
                            where: { id: sub.id },
                            data: {
                                status: "cancelled",
                                cancelledAt: new Date(),
                            },
                        }),
                        prisma.user.update({
                            where: { id: sub.userId },
                            data: { tier: "free" },
                        }),
                    ]);
                    console.log(`❌ Subscription cancelled for user ${sub.userId}`);
                }
                break;
            }

            case "invoice.payment_failed": {
                const invoice = event.data.object as Stripe.Invoice;
                const subscriptionId = invoice.subscription as string;
                if (!subscriptionId) break;

                const sub = await prisma.subscription.findFirst({
                    where: { stripeSubscriptionId: subscriptionId },
                });
                if (sub) {
                    await prisma.subscription.update({
                        where: { id: sub.id },
                        data: { status: "past_due" },
                    });
                }
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
    } catch (error) {
        console.error("Webhook handler error:", error);
        return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
    }

    return NextResponse.json({ received: true });
}
