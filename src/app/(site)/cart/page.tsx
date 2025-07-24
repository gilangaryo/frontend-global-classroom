'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
    const product = {
        title: 'Case Study: Sportswashing and Qatar’s Quest for Soft Power',
        subtitle: 'Global Politic Lesson',
        price: 15,
        image: '/dummy/sample-product.png',
    };

    return (
        <main className="max-w-full mx-auto px-15 py-10">
            {/* Back to Course */}
            <Link href="/courses" className="text-sm text-black flex items-center mb-6">
                <span className="mr-2 text-xl">&larr;</span> Back to course
            </Link>

            {/* Title */}
            <h1 className="text-3xl font-bold mb-8">MY CART</h1>

            <div className="grid md:grid-cols-5 gap-8">
                {/* Left: Cart Item */}
                <div className="md:col-span-4">
                    <div className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center space-x-4">
                            <button className="p-2 rounded hover:bg-gray-100">
                                <Image src="/trash.png" alt="Remove" width={35} height={35} />
                            </button>
                            <Image src={product.image} alt="Product" width={80} height={60} className="object-cover" />
                            <div>
                                <p className="font-semibold">{product.title}</p>
                                <p className="text-sm text-gray-600">{product.subtitle}</p>
                            </div>
                        </div>
                        <p className="text-lg font-semibold">${product.price}</p>
                    </div>
                </div>

                {/* Right: Order Summary */}
                <div className="border rounded-md p-6">
                    <h2 className="font-bold text-lg mb-4">ORDER SUMMARY</h2>
                    <div className="flex justify-between text-sm mb-2">
                        <span>Subtotal (1 items):</span>
                        <span className='font-semibold '>${product.price}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-semibold mb-4">
                        <span>Totals:</span>
                        <span>${product.price}</span>
                    </div>
                    <button className="w-full bg-primary text-white py-2 rounded hover:bg-green-hover">
                        Checkout Item
                    </button>
                    <p className="text-xs text-gray-500 text-center mt-3">
                        Your purchased resources can be instantly <br />
                        downloaded from your TPT account
                    </p>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-20 border-t pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-primary">
                <p>Copyright © 2025 Global Classroom</p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                    <Link href="/courses">Course</Link>
                    <Link href="/contact">Contact</Link>
                    <Link href="#" aria-label="Instagram">
                        <Image src="/social-icons/instagram.png" alt="Instagram" width={24} height={24} />
                    </Link>
                    <Link href="#" aria-label="WhatsApp">
                        <Image src="/social-icons/whatsapp.png" alt="WhatsApp" width={24} height={24} />
                    </Link>
                    <Link href="#" aria-label="LinkedIn">
                        <Image src="/social-icons/linkedin.png" alt="LinkedIn" width={24} height={24} />
                    </Link>
                </div>
            </footer>
        </main>
    );
}
