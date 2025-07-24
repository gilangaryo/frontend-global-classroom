'use client';

import { useEffect, useState } from 'react';

export default function CheckoutPage() {
    const [form, setForm] = useState({ email: '', firstName: '', lastName: '', country: '' });
    const [method, setMethod] = useState<'midtrans' | 'stripe' | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch('https://ipapi.co/json/')
            .then((res) => res.json())
            .then((data) => {
                setForm((prev) => ({ ...prev, country: data.country_name || 'Indonesia' }));
            });
    }, []);

    const handleCheckout = async () => {
        if (!method) return alert('Pilih metode pembayaran!');
        setLoading(true);

        const res = await fetch(`/api/payment/${method}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 15000000 }),
        });

        const data = await res.json();

        if (method === 'midtrans') {
            window.location.href = data.redirect_url;
        } else if (method === 'stripe') {
            const stripe = await (await import('@stripe/stripe-js')).loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
            await stripe?.redirectToCheckout({ sessionId: data.sessionId });
        }

        setLoading(false);
    };

    return (
        <div className="flex flex-col md:flex-row justify-between max-w-6xl mx-auto px-6 py-10">
            {/* Left */}
            <div className="w-full md:w-[60%]">
                <h1 className="text-3xl font-bold mb-6">CHECKOUT</h1>
                <p className="mb-6 text-gray-600">Enter your payment information and submit your order.</p>

                {/* Billing Address */}
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

                {/* Payment Method */}
                <div className="mb-8">
                    <h3 className="font-bold mb-2">PAYMENT METHOD</h3>
                    <div className="space-y-2">
                        {form.country === 'Indonesia' && (
                            <label className="block border rounded px-4 py-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="midtrans"
                                    onChange={() => setMethod('midtrans')}
                                    className="mr-2"
                                />
                                Midtrans (QRIS, GoPay, Bank Transfer)
                            </label>
                        )}
                        <label className="block border rounded px-4 py-3 cursor-pointer">
                            <input
                                type="radio"
                                name="payment"
                                value="stripe"
                                onChange={() => setMethod('stripe')}
                                className="mr-2"
                            />
                            Stripe (Visa / Mastercard)
                        </label>
                    </div>
                </div>
            </div>

            {/* Right - Order Summary */}
            <div className="w-full md:w-[35%] border border-gray-200 rounded p-6 h-fit">
                <h3 className="text-xl font-semibold mb-4">ORDER SUMMARY</h3>
                <div className="flex justify-between text-gray-700">
                    <span>Subtotal (1 item):</span>
                    <span>Rp150.000</span>
                </div>
                <div className="flex justify-between mt-2 font-bold">
                    <span>Totals:</span>
                    <span>Rp150.000</span>
                </div>
                <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full mt-6 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                    {loading ? 'Memproses...' : 'Submit Order'}
                </button>
                <p className="text-xs text-center mt-2 text-gray-500">
                    By submitting your order, you agree to our{' '}
                    <a href="#" className="underline">Terms of Service</a> and{' '}
                    <a href="#" className="underline">Privacy Policy</a>.
                </p>
            </div>
        </div>
    );
}
