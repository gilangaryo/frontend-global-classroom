'use client';

import { Lesson } from './LessonList';
import Image from 'next/image';
import Link from 'next/link';
import AnimatedAddToCartButton from '../AnimatedAddToCartButton';
import ModalPreviewPdf from "../ModalPreviewPdf";
import { useState } from "react";

export default function LessonCard({
    lesson,
    colorClass = '#3E724A',
}: {
    lesson: Lesson;
    colorClass?: string;
}) {
    const [openPreviewPdf, setOpenPreviewPdf] = useState(false);

    const pdfUrl = lesson.previewUrl || "https://res.cloudinary.com/dla5fna8n/image/upload/v1753374352/data_desqhr.pdf";

    return (
        <div className="rounded-lg overflow-hidden flex flex-col bg-white transition">
            <Link href={`/lessons/${lesson.id}`}>
                <div className="relative h-55 w-full bg-[#EFE9E9] cursor-pointer">
                    <Image
                        src={
                            lesson.imageUrl ||
                            'https://res.cloudinary.com/dla5fna8n/image/upload/v1753368278/lesson_ighmqy.jpg'
                        }
                        alt={lesson.title}
                        width={400}
                        height={900}
                        className="object-cover w-full h-full rounded-lg"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://res.cloudinary.com/dla5fna8n/image/upload/v1753368278/lesson_ighmqy.jpg';
                        }}
                    />

                    {lesson.previewUrl && (
                        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-lg">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setOpenPreviewPdf(true);
                                }}
                                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-normal"
                            >

                                See More
                            </button>
                        </div>
                    )}
                </div>
            </Link>

            <div className="py-4 flex-1 flex flex-col">
                {lesson.tags && lesson.tags.length > 0 && (
                    <div className="mb-2">
                        <div className="flex flex-wrap gap-1">
                            {lesson.tags.slice(0, 5).map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-block py-0.5 text-xs text-gray-700"
                                    title={tag}
                                >
                                    {tag}{index < (lesson.tags?.length ?? 0) - 1 ? ',' : ''}
                                </span>
                            ))}
                            {(lesson.tags?.length ?? 0) > 5 && (
                                <span className="inline-block py-0.5 text-xs bg-gray-200 text-gray-600 rounded-full">
                                    +{(lesson.tags?.length ?? 0) - 5}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                <Link href={`/lessons/${lesson.id}`}>
                    <h3 className="font-semibold text-black mb-2 text-lg leading-snug hover:underline cursor-pointer">
                        {lesson.title}
                    </h3>
                </Link>

                {lesson.description && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-3">{lesson.description}</p>
                )}

                {(lesson.course || lesson.unit) && (
                    <div className="text-xs text-gray-400 mb-3">
                        {lesson.course && <span>{lesson.course.title}</span>}
                        {lesson.course && lesson.unit && <span> • </span>}
                        {lesson.unit && <span>{lesson.unit.title}</span>}
                    </div>
                )}

                <div className="text-lg font-bold text-primary mb-4">
                    ${parseFloat(lesson.price).toFixed(2)}
                </div>

                <div className="mt-auto grid grid-cols-2 gap-4">
                    <div className="w-full h-full">
                        <button
                            onClick={() => setOpenPreviewPdf(true)}
                            disabled={!lesson.previewUrl}
                            className={`h-full rounded-md border font-bold text-base transition-colors w-full ${lesson.previewUrl
                                ? 'border-[#363F36] text-[#363F36] bg-white hover:bg-primary hover:text-white'
                                : 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed'
                                }`}
                        >
                            {lesson.previewUrl ? 'Preview' : 'No Preview'}
                        </button>
                    </div>

                    <div>
                        <AnimatedAddToCartButton
                            productId={lesson.id}
                            productType="LESSON"
                            itemTitle={lesson.title}
                            itemImg={lesson.imageUrl ?? '/dummy/sample-product.png'}
                            itemDesc={lesson.description ?? ''}
                            itemPrice={parseFloat(lesson.price)}
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