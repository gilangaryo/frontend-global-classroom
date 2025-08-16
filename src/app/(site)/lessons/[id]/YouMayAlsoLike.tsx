'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Lesson = {
    id: string;
    title: string;
    slug: string;
    imageUrl?: string | null;
    description?: string | null;
    price: string | number;
    tags?: string[]; // normalized tag names
    createdAt: string;
};

// backend tag bisa { name?: string|null } atau string
type BackendTag = { name?: string | null } | string;

type BackendLesson = {
    id: string;
    title: string;
    slug: string;
    imageUrl?: string | null;
    description?: string | null;
    price: string | number;
    tags?: BackendTag[];
    createdAt: string;
};

function isTagObject(v: unknown): v is { name?: string | null } {
    return (
        typeof v === 'object' &&
        v !== null &&
        'name' in v &&
        (typeof (v as { name?: unknown }).name === 'string' ||
            (v as { name?: unknown }).name == null)
    );
}

function toStringTags(tags: unknown): string[] {
    if (!Array.isArray(tags)) return [];
    const out: string[] = [];
    for (const t of tags as unknown[]) {
        if (typeof t === 'string') {
            const s = t.trim();
            if (s) out.push(s);
        } else if (isTagObject(t) && typeof t.name === 'string') {
            const s = t.name.trim();
            if (s) out.push(s);
        }
    }
    return out;
}

export default function YouMayAlsoLike() {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLessons() {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/featured/LESSON?limit=3`,
                    { cache: 'no-store' }
                );
                const json = await res.json();

                const raw: BackendLesson[] = Array.isArray(json?.data) ? (json.data as BackendLesson[]) : [];

                const mapped: Lesson[] = raw.map((l) => {
                    const tagNames = toStringTags(l.tags);
                    const displayTags =
                        tagNames.length > 4
                            ? [...tagNames.slice(0, 4), '....']
                            : tagNames.slice(0, 4);

                    return {
                        id: l.id,
                        title: l.title,
                        slug: l.slug,
                        imageUrl: l.imageUrl ?? null,
                        description: l.description ?? null,
                        price: l.price,
                        tags: displayTags,
                        createdAt: l.createdAt,
                    };
                });


                setLessons(mapped);
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
        <section className="bg-alt2 px-4 md:px-20 py-25">
            <h2 className="text-xl md:text-4xl font-bold text-[#4E3D34] mb-10 uppercase tracking-wide">
                You may also like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                {lessons.map((lesson) => (
                    <Link
                        key={lesson.id}
                        href={`/lessons/${lesson.id}`}
                        className="rounded overflow-hidden transition-all"
                    >
                        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-md mb-4">
                            <Image
                                src={lesson.imageUrl || '/dummy/sample-product.png'}
                                alt={lesson.title}
                                fill
                                className="object-cover grayscale"
                            />
                        </div>

                        {/* tags dari product */}
                        {lesson.tags && lesson.tags.length > 0 && (
                            <p className="text-xs text-[#8D4A26] ">{lesson.tags.join(', ')}</p>
                        )}

                        <h3 className="text-md md:text-2xl font-semibold text-primary leading-normal mb-3 h-18">
                            {lesson.title}
                        </h3>

                        {lesson.description && (
                            <p className="text-sm text-gray-500 line-clamp-2">
                                {lesson.description.substring(0, 120) +
                                    (lesson.description.length > 120 ? '.....' : '')}
                            </p>
                        )}
                    </Link>
                ))}
            </div>
        </section>
    );
}
