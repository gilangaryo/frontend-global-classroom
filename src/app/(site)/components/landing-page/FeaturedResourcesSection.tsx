'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Resource = {
    id: string;
    title: string;
    slug: string;
    description: string;
    imageUrl: string;
    createdAt: string;
    type: string;
    tags?: string[]; // Added tags property
};

type ResourceCardProps = {
    id: string;
    img: string;
    title: string;
    subtitle: string;
    tags?: string[];
    badge?: string;
    badgeColor?: string;
};

function getSafeImageSrc(imageUrl?: string | null): string {
    const defaultImage = 'https://res.cloudinary.com/dla5fna8n/image/upload/v1753368277/course_u3alrf.jpg';

    if (!imageUrl) return defaultImage;

    if (typeof imageUrl === 'string' && imageUrl.trim() === '') return defaultImage;

    return imageUrl;
}

function getCleanDescription(htmlString?: string, maxLength: number = 100): string {
    if (!htmlString) return '';

    const cleanText = htmlString.replace(/<[^>]*>/g, '');

    if (cleanText.length > maxLength) {
        return cleanText.substring(0, maxLength) + '...';
    }

    return cleanText;
}

function ResourceCard({
    id,
    img,
    title,
    subtitle,
    tags = [],
    badge,
    badgeColor = "bg-green-active",
}: ResourceCardProps) {
    const [imageSrc, setImageSrc] = useState<string>(getSafeImageSrc(img));

    useEffect(() => {
        setImageSrc(getSafeImageSrc(img));
    }, [img]);

    return (
        <Link href={`/lessons/${id}`} className="space-y-2 w-full max-w-[340px]">
            <div className="w-full relative rounded-lg overflow-hidden aspect-3/2">
                {img && img.trim() !== '' ? (
                    <Image
                        src={imageSrc}
                        alt={title || 'Resource image'}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">No Image</span>
                    </div>
                )}

                {badge && (
                    <span className={`absolute top-0 left-0 text-white text-xs font-semibold px-4 py-2 rounded ${badgeColor}`}>
                        {badge}
                    </span>
                )}
            </div>

            <div className="flex flex-wrap gap-1 mb-2 mt-5">
                {tags && tags.length > 0 && (
                    <span className="text-sm text-tag font-normals">
                        {tags.join(', ')}
                    </span>
                )}
            </div>
            <h4 className="text-xl font-bold text-primary uppercase leading-relaxed">{title}</h4>
            <p className="text-xs text-text mt-3">{subtitle}</p>
        </Link>
    );
}

export default function FeaturedResourcesSection() {
    const [featured, setFeatured] = useState<(Resource & { source: 'best' | 'new' })[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/featured`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const json = await response.json();

                if (
                    json.status === 'success' &&
                    json.data &&
                    Array.isArray(json.data.bestSellers) &&
                    Array.isArray(json.data.newLessons)
                ) {
                    const best = json.data.bestSellers?.[0];
                    const newest = json.data.newLessons?.[0];

                    const combined = [
                        best ? { ...best, source: 'best' } : null,
                        newest ? { ...newest, source: 'new' } : null,
                    ].filter(Boolean) as (Resource & { source: 'best' | 'new' })[];

                    setFeatured(combined);

                } else {
                    console.warn('Invalid response format:', json);
                    setFeatured([]);
                }
            } catch (err) {
                console.error("Failed to fetch featured resources:", err);
                setError(err instanceof Error ? err.message : 'Failed to fetch featured resources');
                setFeatured([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFeatured();
    }, []);

    if (loading) {
        return (
            <section className="py-8 md:py-40 px-4 md:px-20 bg-white">
                <div className="mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 md:gap-8 items-stretch min-h-[520px]">
                        <div className='col-span-2 flex flex-col h-full'>
                            <h2 className="text-4xl md:text-7xl font-bold text-primary mb-8 leading-normal">
                                FEATURED <br /> RESOURCES
                            </h2>
                            <div className="flex gap-6 mt-auto mb-6 flex-wrap">
                                {[1, 2].map((i) => (
                                    <div key={i} className="space-y-2 w-full max-w-[340px]">
                                        <div className="w-full aspect-3/2 bg-gray-200 rounded-lg animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <div className="w-full max-w-full md:max-w-md aspect-[3/4] relative">
                                <Image
                                    src="/landing-page/cover-featured.jpg"
                                    alt="Featured Resources Cover"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-8 md:py-40 px-4 md:px-20 bg-white">
                <div className="mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 md:gap-8 items-stretch min-h-[520px]">
                        <div className='col-span-2 flex flex-col h-full'>
                            <h2 className="text-4xl md:text-7xl font-bold text-primary mb-8 leading-normal">
                                FEATURED <br /> RESOURCES
                            </h2>
                            <div className="mt-auto mb-6">
                                <p className="text-red-600 text-sm">
                                    Unable to load featured resources. Please try again later.
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <div className="w-full max-w-full md:max-w-md aspect-[3/4] relative">
                                <Image
                                    src="/landing-page/cover-featured.jpg"
                                    alt="Featured Resources Cover"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-8 md:py-40 px-4 md:px-20 bg-white">
            <div className="mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 md:gap-8 items-stretch min-h-[520px]">
                    <div className='col-span-2 flex flex-col h-full'>
                        <h2 className="text-4xl md:text-7xl font-bold text-primary mb-30 leading-normal">
                            FEATURED <br /> RESOURCES
                        </h2>
                        <div className="flex gap-12 mt-auto mb-6 flex-wrap">
                            {featured.length > 0 ? (
                                featured.map((item) => (
                                    <ResourceCard
                                        key={item.id}
                                        id={item.id}
                                        img={item.imageUrl}
                                        title={item.title}
                                        subtitle={getCleanDescription(item.description, 80)}
                                        badge={item.source === 'best' ? 'Best Seller' : 'New Lesson'}
                                        badgeColor={item.source === 'best' ? 'bg-orange-500' : 'bg-blue-600'}
                                        tags={item.tags && item.tags.length > 2
                                            ? [...item.tags.slice(0, 2), '....']
                                            : item.tags || []
                                        }
                                    />
                                ))
                            ) : (
                                <div className="text-gray-600">
                                    <p>No featured resources available at the moment.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <div className="w-full max-w-full md:max-w-md">
                            <div className="aspect-[2/3] relative w-full">
                                <Image
                                    src="/landing-page/cover-featured.jpg"
                                    alt="Featured Resources Cover"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}