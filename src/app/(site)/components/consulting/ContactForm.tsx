'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ContactSection() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!firstName || !lastName || !email || !message) {
            alert('Please fill in all fields.');
            return;
        }

        setLoading(true);
        setSuccessMsg('');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, email, message }),
            });

            const data = await res.json();
            if (res.ok) {
                setSuccessMsg('Your message has been sent successfully!');
                setFirstName('');
                setLastName('');
                setEmail('');
                setMessage('');
            } else {
                alert(`❌ Failed: ${data.message || 'Something went wrong.'}`);
            }
        } catch (err) {
            console.error('Error submitting form:', err);
            alert('❌ An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-4 md:py-70 px-4 md:px-25 bg-alt2 max-w-full">
            <div className="mx-auto grid md:grid-cols-2 gap-12 items-start">
                <div>
                    <h2 className="text-4xl md:text-7xl font-bold text-black mb-4 leading-normal">LET’S COLLABORATE</h2>
                    <p className="text-[#8E8E8E] mb-2">
                        Ready to bring your project to life through story-rich, justice-centered learning?
                    </p>
                    <p className="mb-1 font-bold">
                        <Link href="#" className="underline text-black">Contact Us</Link>{' '}
                        to discuss your goals and how we can help.
                    </p>
                    <p className="text-[#8E8E8E] text-sm flex items-center gap-2 mt-3">
                        <Image src="/consulting/email-icon.png" alt="Email" width={20} height={20} />
                        aglobalclass@gmail.com
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 bg-white/80 p-5 rounded-lg">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg"
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <input
                        type="email"
                        placeholder="E-mail*"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <textarea
                        placeholder="Message*"
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-primary text-[#FDFDFD] rounded-lg font-semibold disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>

                    {successMsg && (
                        <p className="text-primary text-sm mt-2">{successMsg}</p>
                    )}
                </form>
            </div>
        </section>
    );
}
