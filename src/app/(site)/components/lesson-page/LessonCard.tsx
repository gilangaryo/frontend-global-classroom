'use client';

import { Lesson } from './LessonList';
import Image from 'next/image';
import Link from 'next/link';
import AnimatedAddToCartButton from '../AnimatedAddToCartButton';
import ModalPreviewPdf from '../ModalPreviewPdf';
import { useMemo, useState, MouseEvent } from 'react';

export default function LessonCard({
    lesson,
    colorClass = '#3E724A',
    onTagClick,
}: {
    lesson: Lesson;
    colorClass?: string;
    onTagClick?: (t: string) => void;
}) {
    const [openPreviewPdf, setOpenPreviewPdf] = useState(false);

    const fallbackImg =
        'https://res.cloudinary.com/dla5fna8n/image/upload/v1753368278/lesson_ighmqy.jpg';
    const [imgSrc, setImgSrc] = useState<string>(
        lesson.imageUrl && lesson.imageUrl.trim() ? lesson.imageUrl : fallbackImg
    );

    const pdfUrl =
        lesson.previewUrl ||
        'https://res.cloudinary.com/dla5fna8n/image/upload/v1753374352/data_desqhr.pdf';

    const priceNumber = useMemo(() => {
        const n = typeof lesson.price === 'number' ? lesson.price : parseFloat(lesson.price);
        return Number.isFinite(n) ? n : 0;
    }, [lesson.price]);

    const { displayTags, moreCount } = useMemo(() => {
        const tags = Array.isArray(lesson.tags)
            ? lesson.tags.filter((t) => typeof t === 'string' && t.trim()).map((t) => t.trim())
            : [];
        const firstFive = tags.slice(0, 5);
        return { displayTags: firstFive, moreCount: Math.max(0, tags.length - firstFive.length) };
    }, [lesson.tags]);

    const onClickPreview = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (lesson.previewUrl) setOpenPreviewPdf(true);
    };

    return (
        <div className="rounded-lg overflow-hidden flex flex-col bg-white transition">
            <Link href={`/lessons/${lesson.id}`} aria-label={`Open lesson ${lesson.title}`}>
                <div className="relative h-55 w-full bg-[#EFE9E9] cursor-pointer">
                    <Image
                        src={imgSrc}
                        alt={lesson.title}
                        width={400}
                        height={900}
                        className="object-cover w-full h-full rounded-lg"
                        onError={() => setImgSrc(fallbackImg)}
                        priority={false}
                    />

                    {lesson.previewUrl && (
                        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-lg">
                            <button
                                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-normal"
                                aria-label="Preview PDF"
                            >
                                See More
                            </button>
                        </div>
                    )}
                </div>
            </Link>

            <div className="py-4 flex-1 flex flex-col">
                {displayTags.length > 0 && (
                    <div className="mb-2">
                        <div className="flex flex-wrap gap-1 items-center">
                            {displayTags.map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onTagClick?.(t);
                                    }}
                                    className="inline-block py-0.5 px-1.5 text-xs text-gray-700 rounded hover:bg-gray-100"
                                    title={t}
                                >
                                    {t}
                                </button>
                            ))}
                            {moreCount > 0 && (
                                <span
                                    className="inline-block py-0.5 text-xs bg-gray-200 text-gray-600 rounded-full px-2"
                                    title={`${moreCount} more tags`}
                                >
                                    +{moreCount}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                <Link href={`/lessons/${lesson.id}`} aria-label={`Open lesson ${lesson.title}`}>
                    <h3 className="font-semibold text-black mb-2 text-lg leading-snug hover:underline cursor-pointer">
                        {lesson.title}
                    </h3>
                </Link>

                {lesson.description && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-3">{lesson.description}</p>
                )}

                <div className="text-lg font-bold text-primary mb-4">${priceNumber.toFixed(2)}</div>

                <div className="mt-auto grid grid-cols-2 gap-4">
                    <div className="w-full h-full">
                        <button
                            onClick={onClickPreview}
                            disabled={!lesson.previewUrl}
                            className={`h-full rounded-md border font-bold text-base transition-colors w-full ${lesson.previewUrl
                                ? 'border-[#363F36] text-[#363F36] bg-white hover:bg-primary hover:text-white'
                                : 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed'
                                }`}
                            aria-disabled={!lesson.previewUrl}
                            aria-label={lesson.previewUrl ? 'Open preview' : 'No preview available'}
                        >
                            {lesson.previewUrl ? 'Preview' : 'No Preview'}
                        </button>
                    </div>

                    <div>
                        <AnimatedAddToCartButton
                            productId={lesson.id}
                            productType="LESSON"
                            itemTitle={lesson.title}
                            itemImg={imgSrc || '/dummy/sample-product.png'}
                            itemDesc={lesson.description ?? ''}
                            itemPrice={priceNumber}
                            colorButton={colorClass}
                        />
                    </div>
                </div>

                <ModalPreviewPdf
                    open={openPreviewPdf}
                    onClose={() => setOpenPreviewPdf(false)}
                    pdfUrl={pdfUrl}
                    title="Lesson Preview"
                />
            </div>
        </div>
    );
}
