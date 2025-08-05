'use client';

import Link from 'next/link';
import { usePortfolios } from '@/hooks/usePortfolios';
import Image from 'next/image';
export default function PortfolioPage() {
    const { portfolios, loading } = usePortfolios();

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Featured Management</h1>
                <Link
                    href="/dashboard/featured-project/add"
                    className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600"
                >
                    Add Featured
                </Link>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : portfolios.length === 0 ? (
                <p>No portfolios found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {portfolios.map((item) => (
                        <div key={item.id} className="rounded-lg overflow-hidden shadow">
                            <Image
                                src={item.image}
                                alt={item.title}
                                width={400}
                                height={240}
                                className="w-full h-60 object-cover rounded-t"
                            />
                            <div className="p-4">
                                <h2 className="text-lg font-bold mb-1">{item.title}</h2>
                                <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>

                                <div className="flex justify-end mt-4 gap-2">
                                    <Link
                                        href={`/dashboard/featured-project/edit/${item.id}`}
                                        className="text-sm px-3 py-1 rounded bg-yellow-500 text-white"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={async () => {
                                            if (confirm('Delete this Featured?')) {
                                                await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/portfolios/${item.id}`, {
                                                    method: 'DELETE',
                                                });
                                                location.reload(); // or use state to update
                                            }
                                        }}
                                        className="text-sm px-3 py-1 rounded bg-red-500 text-white"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
