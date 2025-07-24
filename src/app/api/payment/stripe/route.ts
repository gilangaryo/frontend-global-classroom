import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
    const { amount } = await req.json();

    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'idr',
                    product_data: { name: 'Produk Digital' },
                    unit_amount: amount,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
    });

    return NextResponse.json({ sessionId: session.id });
}
