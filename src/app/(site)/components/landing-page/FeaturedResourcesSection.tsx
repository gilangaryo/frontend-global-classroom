'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

/* =========================
 * Types
 * =======================*/

type ResourceBase = {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    createdAt: string;
    type: string;
};

type Resource = ResourceBase & {
    tags?: string[];
    source: 'best' | 'new';
};

type BackendTag = { name?: string | null } | string;

type BackendProduct = {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    imageUrl?: string | null;
    createdAt: string;
    type: string;
    tags?: BackendTag[];
};

type FeaturedSuccess = {
    status: 'success';
    data: {
        bestSellers: BackendProduct[];
        newLessons: BackendProduct[];
    };
};

/* =========================
 * Utils
 * =======================*/

function getSafeImageSrc(imageUrl?: string | null): string {
    const fallback =
        'https://res.cloudinary.com/dla5fna8n/image/upload/v1753368277/course_u3alrf.jpg';
    if (!imageUrl || (typeof imageUrl === 'string' && imageUrl.trim() === '')) return fallback;
    return imageUrl;
}

function getCleanDescription(htmlString?: string | null, maxLength: number = 100): string {
    if (!htmlString) return '';
    const cleanText = htmlString.replace(/<[^>]*>/g, '');
    return cleanText.length > maxLength ? cleanText.substring(0, maxLength) + '...' : cleanText;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}
function isBackendTagArray(value: unknown): value is BackendTag[] {
    return Array.isArray(value);
}
function isBackendProduct(value: unknown): value is BackendProduct {
    return (
        isRecord(value) &&
        typeof (value as BackendProduct).id === 'string' &&
        typeof (value as BackendProduct).title === 'string' &&
        typeof (value as BackendProduct).slug === 'string' &&
        typeof (value as BackendProduct).createdAt === 'string' &&
        typeof (value as BackendProduct).type === 'string'
    );
}
function isFeaturedSuccess(value: unknown): value is FeaturedSuccess {
    return (
        isRecord(value) &&
        (value as FeaturedSuccess).status === 'success' &&
        isRecord((value as FeaturedSuccess).data) &&
        Array.isArray((value as FeaturedSuccess).data.bestSellers) &&
        Array.isArray((value as FeaturedSuccess).data.newLessons)
    );
}
function toStringTags(tags: unknown): string[] {
    if (!isBackendTagArray(tags)) return [];
    const names: string[] = [];
    for (const t of tags) {
        if (typeof t === 'string') {
            const s = t.trim();
            if (s) names.push(s);
        } else if (isRecord(t) && typeof t.name === 'string') {
            const s = t.name.trim();
            if (s) names.push(s);
        }
    }
    return names;
}

/* =========================
 * Card
 * =======================*/

type ResourceCardProps = {
    id: string;
    img?: string | null;
    title: string;
    subtitle: string;
    tags?: string[];
    badge?: string;
    badgeColor?: string;
};

function ResourceCard({
    id,
    img,
    title,
    subtitle,
    tags = [],
    badge,
    badgeColor = 'bg-green-active',
}: ResourceCardProps) {
    const [imageSrc, setImageSrc] = useState<string>(getSafeImageSrc(img));

    useEffect(() => {
        setImageSrc(getSafeImageSrc(img));
    }, [img]);

    return (
        <Link href={`/lessons/${id}`} className="space-y-2 w-full">
            <div className="w-full relative rounded-lg overflow-hidden aspect-3/2">
                {imageSrc ? (
                    <Image src={imageSrc} alt={title || 'Resource image'} fill className="object-cover" />
                ) : (
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">No Image</span>
                    </div>
                )}

                {badge && (
                    <span
                        className={`absolute top-0 left-0 text-white text-xs font-semibold px-4 py-2 rounded ${badgeColor}`}
                    >
                        {badge}
                    </span>
                )}
            </div>

            <div className="flex flex-wrap gap-1 mb-2 mt-5">
                {tags && tags.length > 0 && (() => {
                    const display = tags.slice(0, 4);
                    const more = tags.length - display.length;
                    return (
                        <>
                            <span className="text-sm text-tag">{display.join(', ')}</span>
                            {more > 0 && <span className="text-sm text-tag">&nbsp;+{more}</span>}
                        </>
                    );
                })()}
            </div>

            <h4 className="text-xl font-bold text-primary uppercase leading-relaxed">{title}</h4>
            <p className="text-xs text-text mt-3">{subtitle}</p>
        </Link>
    );
}

/* =========================
 * Main component
 * =======================*/

export default function FeaturedResourcesSection() {
    const [best, setBest] = useState<Resource[]>([]);
    const [news, setNews] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/featured`, {
                    cache: 'no-store',
                });
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

                const json: unknown = await res.json();

                if (isFeaturedSuccess(json)) {
                    const adapt = (item: unknown, source: 'best' | 'new'): Resource | null => {
                        if (!isBackendProduct(item)) return null;
                        const tagNames = toStringTags((item as BackendProduct).tags);
                        return {
                            id: (item as BackendProduct).id,
                            title: (item as BackendProduct).title,
                            slug: (item as BackendProduct).slug,
                            description: ((item as BackendProduct).description ?? null) as string | null,
                            imageUrl: ((item as BackendProduct).imageUrl ?? null) as string | null,
                            createdAt: (item as BackendProduct).createdAt,
                            type: (item as BackendProduct).type,
                            tags: tagNames,
                            source,
                        };
                    };

                    const bestList = (json.data.bestSellers ?? []).slice(0, 1).map((b) => adapt(b, 'best'));
                    const newList = (json.data.newLessons ?? []).slice(0, 2).map((n) => adapt(n, 'new'));

                    setBest(bestList.filter((x): x is Resource => x !== null));
                    setNews(newList.filter((x): x is Resource => x !== null));
                } else {
                    setBest([]);
                    setNews([]);
                }
            } catch (e) {
                const msg = e instanceof Error ? e.message : 'Failed to fetch featured resources';
                setError(msg);
                setBest([]);
                setNews([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFeatured();
    }, []);

    if (loading) {
        return (
            <section className="py-8 md:py-40 px-4 md:px-20 bg-white">
                <h2 className="text-4xl md:text-7xl font-bold text-primary mb-8 leading-normal">
                    FEATURED <br /> RESOURCES
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2 w-full">
                            <div className="w-full aspect-3/2 bg-gray-200 rounded-lg animate-pulse" />
                            <div className="h-4 bg-gray-200 rounded animate-pulse" />
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-8 md:py-40 px-4 md:px-20 bg-white">
                <h2 className="text-4xl md:text-7xl font-bold text-primary mb-8 leading-normal">
                    FEATURED <br /> RESOURCES
                </h2>
                <p className="text-red-600 text-sm">Unable to load featured resources. Please try again later.</p>
            </section>
        );
    }

    // gabungkan HANYA UNTUK PENATAAN GRID (bukan penggabungan data/logic)
    const cardsInOrder: Resource[] = [...best, ...news];

    return (
        <section className="py-8 md:py-40 px-4 md:px-20 bg-white">
            <h2 className="text-4xl md:text-7xl font-bold text-primary mb-8 leading-normal">
                FEATURED <br /> RESOURCES
            </h2>

            {/* Grid 3 kolom sejajar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
                {cardsInOrder.map((item, idx) => (
                    <ResourceCard
                        key={`${item.id}-${item.source}-${idx}`} // unik meski id sama di 2 blok
                        id={item.id}
                        img={item.imageUrl ?? undefined}
                        title={item.title}
                        subtitle={getCleanDescription(item.description, 80)}
                        badge={item.source === 'best' ? 'Best Seller' : 'New Lesson'}
                        badgeColor="bg-green-active"
                        tags={item.tags}
                    />
                ))}
            </div>
        </section>
    );
}
