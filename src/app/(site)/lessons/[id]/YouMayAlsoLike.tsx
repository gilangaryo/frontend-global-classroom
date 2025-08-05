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
            <h2 className="text-xl md:text-4xl font-bold text-[#4E3D34] mb-10 uppercase tracking-wide">
                You may also like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                {lessons.map((lesson) => (
                    <Link key={lesson.id} href={`/lessons/${lesson.id}`} className="rounded overflow-hidden transition-all">

                        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-md mb-4">
                            <Image
                                src={lesson.imageUrl || '/dummy/sample-product.png'}
                                alt={lesson.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="">
                            <p className="text-sm text-[#4E3D34] mb-2">11th - 12th, Adult Education, Higher Education</p>
                            <h3 className="text-md md:text-2xl font-semibold text-primary leading-normal mb-3">{lesson.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{lesson.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
