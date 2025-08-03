'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import search_icon from '../../../../public/search.png'
interface ProductResult {
    id: string;
    title: string;
    type: string;
    imageUrl?: string;
    description?: string;
    parentId?: string; // tambahkan
}

export default function ProductSearchBar() {
    const [q, setQ] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<ProductResult[]>([]);
    const [open, setOpen] = useState(false);
    const timeout = useRef<NodeJS.Timeout | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQ(e.target.value);
        if (timeout.current) clearTimeout(timeout.current);
        if (e.target.value.length === 0) {
            setOpen(false);
            setResults([]);
            return;
        }
        timeout.current = setTimeout(() => {
            setLoading(true);
            fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products?search=${encodeURIComponent(e.target.value)}&limit=8`)
                .then((res) => res.json())
                .then((json) => {
                    setResults(json.data || []);
                    setOpen(true);
                })
                .finally(() => setLoading(false));
        }, 350);
    };

    const getDetailUrl = (item: ProductResult) => {
        if (item.type === 'COURSE') return `/courses/${item.id}`;
        if (item.type === 'UNIT') return `/courses/${item.parentId}/unit/${item.id}`;
        if (item.type === 'LESSON') return `/lessons/${item.id}`;
        return '/';
    };

    return (
        <div className="relative">
            <Image
                src={search_icon}
                alt="Search"
                width={16}
                height={16}
                className="absolute left-3 top-2.5 opacity-70"
            />
            <input
                type="text"
                value={q}
                onChange={handleChange}
                onFocus={() => q && setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 200)}
                placeholder="Search "
                className="pl-10 pr-8 py-2 rounded-md border border-gray-300 text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400"
            />
            {/* List result */}
            {open && results.length > 0 && (
                <ul className="absolute left-0 w-full mt-2 bg-white border rounded shadow-lg z-30 max-h-80 overflow-y-auto">
                    {results.map((item) => (
                        <li key={item.id}>
                            <Link href={getDetailUrl(item)} className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100">
                                {item.imageUrl && (
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.title}
                                        width={28}
                                        height={28}
                                        className="w-7 h-7 object-cover rounded"
                                    />
                                )}
                                <span className="font-semibold">{item.title}</span>
                                <span className="ml-auto text-xs text-gray-400">{item.type}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
            {/* Loading spinner */}
            {loading && (
                <span className="absolute right-2 top-2">
                    <svg className="animate-spin w-4 h-4 text-gray-400" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                </span>
            )}
        </div>
    );
}
