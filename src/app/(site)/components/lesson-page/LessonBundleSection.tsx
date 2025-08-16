'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DashedFrame from './DashedFrame';

interface BundleItem {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    price: string;
    type: 'UNIT' | 'COURSE' | 'SUBUNIT';
    parentId?: string; // For UNIT, this is courseId; for SUBUNIT, this is unitId
    courseId?: string; // Explicit courseId for clarity
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
            <h3 className="font-bold text-2xl mb-4 text-heading py-4">
                Save even more with bundles
            </h3>
            <div className="space-y-4">
                {bundles.map(bundle => {
                    let href = '';
                    if (bundle.type === 'UNIT') {
                        const courseId = bundle.parentId || bundle.courseId;
                        href = `/courses/${courseId}/unit/${bundle.id}`;
                    } else if (bundle.type === 'COURSE') {
                        href = `/courses/${bundle.id}`;
                    } else if (bundle.type === 'SUBUNIT') {
                        href = `/subunit/${bundle.id}`;
                    }

                    const isCourse = bundle.type === 'COURSE';

                    return (

                        <Link
                            key={bundle.id}
                            href={href}
                            className="block"
                            style={{ textDecoration: 'none' }}
                        >
                            <DashedFrame
                                className={`
                                p-4 flex items-center gap-4 rounded-2xl px-6
                                transition
                                group
                            `}
                                stroke="#9ca3af"
                                strokeWidth={1}
                                dash={8}
                                gap={10}
                                radius={20}
                            >
                                <div className="w-21 h-21 relative flex-shrink-0">
                                    <Image
                                        src={bundle.imageUrl ?? '/dummy/default.jpg'}
                                        alt={bundle.title}
                                        fill
                                        className={`object-cover transition ${!isCourse ? 'grayscale ' : ''
                                            }`}
                                    />
                                </div>

                                <div className="flex-grow">
                                    <h2 className="text-sm font-semibold uppercase tracking-wide">
                                        Purchase the entire {bundle.type.toLowerCase()}
                                    </h2>
                                    <p className="text-xs line-clamp-2 mt-1 max-w-xl">{bundle.description}</p>
                                    <p className="text-lg mt-2 font-bold">
                                        ${parseFloat(bundle.price).toFixed(0)}
                                    </p>
                                </div>
                            </DashedFrame>
                        </Link>
                    );
                })}


            </div>
        </div>
    );
}