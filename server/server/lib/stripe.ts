import Stripe from "stripe";

// Initialize Stripe if secret key is provided
let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function createPaymentIntent(amount: number, currency: string = "eur") {
  if (!stripe) {
    throw new Error("Stripe not initialized - STRIPE_SECRET_KEY not found");
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
}

export async function retrievePaymentIntent(paymentIntentId: string) {
  if (!stripe) {
    throw new Error("Stripe not initialized");
  }

  try {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (error) {
    console.error("Error retrieving payment intent:", error);
    throw error;
  }
}

export { stripe };
