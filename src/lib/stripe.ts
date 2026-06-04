import Stripe from "stripe";

// Build-safe Stripe instantiation
const stripeKey = process.env.STRIPE_SECRET_KEY;

export const stripe = new Stripe(stripeKey || "sk_test_placeholder", {
  apiVersion: "2026-05-27.dahlia" as any,
  typescript: true,
});
