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
    const defaultImage = 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=No+Image';

    // Return default if no imageUrl provided
    if (!imageUrl) return defaultImage;

    // Return default if imageUrl is empty string or only whitespace
    if (typeof imageUrl === 'string' && imageUrl.trim() === '') return defaultImage;

    // Return the imageUrl if it seems valid
    return imageUrl;
}

// Utility function to strip HTML and truncate text
function getCleanDescription(htmlString?: string, maxLength: number = 100): string {
    if (!htmlString) return '';

    // Remove HTML tags
    const cleanText = htmlString.replace(/<[^>]*>/g, '');

    // Truncate if too long
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
    const [imageError, setImageError] = useState(false);

    // Update image source when img prop changes
    useEffect(() => {
        setImageSrc(getSafeImageSrc(img));
        setImageError(false);
    }, [img]);

    const handleImageError = () => {
        if (!imageError) {
            console.warn(`Image failed to load for resource ${id}: ${img}`);
            setImageSrc('https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=No+Image');
            setImageError(true);
        }
    };


    return (
        <Link href={`/lessons/${id}`} className="space-y-2 w-full max-w-[340px]">
            <div className="w-full relative rounded-lg overflow-hidden aspect-3/2">
                {imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt={title || 'Resource image'}
                        fill
                        className="object-cover"
                        onError={handleImageError}
                        onLoad={() => console.log(`Image loaded successfully: ${imageSrc}`)}
                    />
                ) : (
                    // Fallback div jika tidak ada image sama sekali
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">No Image</span>
                    </div>
                )}
                {badge && (
                    <span className={`absolute top-0 left-0 text-white text-xs font-semibold px-4 py-2 rounded ${badgeColor}`}>
                        {badge}
                    </span>
                )}
            </div>
            <div className="flex flex-wrap gap-1 mb-1">
                {tags.length > 0 && (
                    <span className="text-xs text-tag font-medium">
                        {tags.join(', ')}
                    </span>
                )}
            </div>
            <h4 className="text-base font-bold text-primary uppercase">{title}</h4>
            <p className="text-xs text-text">{subtitle}</p>
        </Link>
    );
}

export default function FeaturedResourcesSection() {
    const [featured, setFeatured] = useState<Resource[]>([]);
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

                if (json.status === 'success' && Array.isArray(json.data)) {
                    // Filter dan validate data sebelum set state
                    const validResources = json.data
                        .filter((item: Resource) =>
                            item &&
                            item.id &&
                            item.title &&
                            item.title.trim() !== ''
                        )
                        .slice(0, 2); // Ambil 2 item pertama

                    setFeatured(validResources);
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

    // Loading state
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
                                {/* Loading skeletons */}
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

    // Error state
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
                    {/* Kiri: Judul dan dua card di bawah */}
                    <div className='col-span-2 flex flex-col h-full'>
                        <h2 className="text-4xl md:text-7xl font-bold text-primary mb-8 leading-normal">
                            FEATURED <br /> RESOURCES
                        </h2>
                        <div className="flex gap-6 mt-auto mb-6 flex-wrap">
                            {featured.length > 0 ? (
                                featured.map((item) => (
                                    <ResourceCard
                                        key={item.id}
                                        id={item.id}
                                        img={item.imageUrl}
                                        title={item.title}
                                        subtitle={getCleanDescription(item.description, 80)}
                                        badge={item.type === 'LESSON' ? 'Lesson' : item.type === 'COURSE' ? 'Course' : undefined}
                                        badgeColor={item.type === 'LESSON' ? 'bg-blue-500' : 'bg-green-500'}
                                        tags={["11th - 12th", "Higher Education"]}
                                    />
                                ))
                            ) : (
                                <div className="text-gray-600">
                                    <p>No featured resources available at the moment.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Kanan: Gambar besar */}
                    <div className="flex justify-center">
                        <div className="w-full max-w-full md:max-w-md aspect-[3/4] relative items-center">
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