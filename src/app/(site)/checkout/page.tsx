'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function CheckoutPage() {
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const [form, setForm] = useState({ email: '', firstName: '', lastName: '', country: '' });
    const [loading, setLoading] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => setHasMounted(true), []);
    if (!hasMounted) return null;

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleCheckout = async () => {
        if (!form.email || !form.firstName || !form.lastName || !form.country) {
            return alert('Please fill all fields');
        }

        if (cartItems.length === 0) {
            return alert('Your cart is empty');
        }

        const items = cartItems
            .filter(item => item.id && item.productType)
            .map(item => ({
                itemId: item.id,
                itemType: item.productType,
            }));

        if (items.length === 0) {
            return alert('Cart items are invalid or missing ID/type');
        }

        const payload = {
            email: form.email,
            firstName: form.firstName,
            lastName: form.lastName,
            country: form.country,
            items,
        };

        try {
            setLoading(true);
            console.log('🟢 Sending checkout payload:', payload);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Backend error: ${res.status} – ${errorText}`);
            }

            const data = await res.json();
            console.log("🔥 Stripe session response:", data);

            if (!data.sessionId) {
                throw new Error('Stripe sessionId not found in response');
            }

            const stripe = await (await import('@stripe/stripe-js')).loadStripe(
                process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
            );
            console.log('🔵 Redirecting to Stripe with sessionId:', data.sessionId);


            await stripe?.redirectToCheckout({ sessionId: data.sessionId });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            console.error('❌ Checkout error:', message);
            alert('Checkout failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row justify-between max-w-6xl mx-auto px-6 py-10">
            {/* Left: Billing Form */}
            <div className="w-full md:w-[60%]">
                <h1 className="text-3xl font-bold mb-6">CHECKOUT</h1>
                <p className="mb-6 text-gray-600">Enter your billing information to complete the order.</p>

                <div className="space-y-4 mb-8">
                    <input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full border rounded px-4 py-2"
                    />
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="First Name"
                            value={form.firstName}
                            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                            className="w-full border rounded px-4 py-2"
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={form.lastName}
                            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                            className="w-full border rounded px-4 py-2"
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Country"
                        value={form.country}
                        onChange={(e) => setForm({ ...form, country: e.target.value })}
                        className="w-full border rounded px-4 py-2"
                    />
                </div>
            </div>

            {/* Right: Order Summary */}
            <div className="w-full md:w-[35%] border border-gray-200 rounded p-6 h-fit">
                <h3 className="text-xl font-semibold mb-4">ORDER SUMMARY</h3>
                <div className="flex justify-between text-gray-700 mb-2">
                    <span>Subtotal ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''}):</span>
                    <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold mt-2">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                </div>

                <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full mt-6 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                    {loading ? 'Processing...' : 'Submit Order'}
                </button>

                <p className="text-xs text-center mt-2 text-gray-500">
                    You’ll be redirected to Stripe to complete your payment securely.
                </p>
            </div>
        </div>
    );
}
