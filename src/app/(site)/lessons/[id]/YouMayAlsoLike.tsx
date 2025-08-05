'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Lesson {
    id: string;
    title: string;
    slug: string;
    imageUrl?: string;
    description?: string;
    price: string;
    tags?: string[];
    createdAt: string;
}

export default function YouMayAlsoLike() {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLessons() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/featured/LESSON?limit=3`);
                const json = await res.json();
                setLessons(json.data || []);
            } catch (err) {
                console.error('Failed to fetch related lessons:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchLessons();
    }, []);

    if (loading) return null;
    if (lessons.length === 0) return null;

    return (
        <section className="bg-alt2 px-4 md:px-20 py-16">
            <h2 className="text-lg md:text-xl font-bold mb-10 text-secondary">YOU MAY ALSO LIKE</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                {lessons.map((lesson) => (
                    <Link key={lesson.id} href={`/lessons/${lesson.slug}`} className="bg-white rounded overflow-hidden shadow hover:shadow-lg transition-all">
                        <div className="w-full h-[200px] relative">
                            <Image
                                src={lesson.imageUrl || '/dummy/sample-product.png'}
                                alt={lesson.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="p-4">
                            <p className="text-sm text-gray-500 mb-1">11th - 12th, Adult Education, Higher Education</p>
                            <h3 className="text-md font-semibold text-primary">{lesson.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2">{lesson.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
