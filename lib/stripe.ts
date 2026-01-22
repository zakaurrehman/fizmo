import Stripe from "stripe";

// Initialize Stripe with secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

// Helper to get Stripe publishable key for client-side
export function getStripePublishableKey(): string {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
}
