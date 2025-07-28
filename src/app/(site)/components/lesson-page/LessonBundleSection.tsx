'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface BundleItem {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    price: string;
    type: 'UNIT' | 'COURSE';
}

export default function LessonBundleSection({ lessonId }: { lessonId: string }) {
    const [bundles, setBundles] = useState<BundleItem[]>([]);

    useEffect(() => {
        if (!lessonId) return;
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/featured/bundles?lessonId=${lessonId}`)
            .then(res => res.json())
            .then(json => {
                if (json.status === 'success') {
                    setBundles(json.data);
                }
            });
    }, [lessonId]);

    if (bundles.length === 0) {
        return null;
    }

    return (
        <div>
            <h3 className="font-bold text-lg mb-4 text-heading">
                Save even more with bundles
            </h3>
            <div className="space-y-4">
                {bundles.map(bundle => (
                    <div
                        key={bundle.id}
                        className="border-dashed border-2 p-4 flex items-center gap-4 bg-white rounded-2xl "
                    >
                        <div className="w-16 h-16 relative flex-shrink-0">
                            <Image
                                src={bundle.imageUrl ?? '/dummy/default.jpg'}
                                alt={bundle.title}
                                fill
                                className="object-cover rounded-md"
                            />
                        </div>
                        <div className="flex-grow">
                            <h2 className="text-sm font-semibold text-heading uppercase tracking-wide">
                                Purchase the entire {bundle.type.toLowerCase()}
                            </h2>
                            <p className="text-xs text-text line-clamp-2 mt-1 max-w-xl">
                                {bundle.description}
                            </p>
                            <p className="text-lg mt-2 font-bold text-heading">
                                ${parseFloat(bundle.price).toFixed(0)}
                            </p>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}