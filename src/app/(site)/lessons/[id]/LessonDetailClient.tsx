'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import AnimatedAddToCartButton from '../../components/AnimatedAddToCartButton';
import LessonPdfThumbnailModal from '../../components/LessonPdfThumbnailModal';
import ModalPreviewPdf from '../../components/ModalPreviewPdf';
import LessonBundleSection from '../../components/lesson-page/LessonBundleSection';

interface Lesson {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    price: string;
    previewUrl: string | null;
    digitalUrl: string | null;
    tags?: string[];
    colorButton?: string;
    subunit?: {
        id: string;
        title: string;
        price: string;
        imageUrl: string;
    } | null;
    unit?: {
        id: string;
        title: string;
        price: string;
        imageUrl: string;
    } | null;
    course?: {
        id: string;
        title: string;
        price: string;
        imageUrl: string;
    } | null;
}

export default function LessonDetailClient() {
    const params = useParams();
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [openPreviewPdf, setOpenPreviewPdf] = useState(false);
    const [openThumbnail, setOpenThumbnail] = useState(false);

    const id =
        typeof params.id === 'string'
            ? params.id
            : Array.isArray(params.id)
                ? params.id[0]
                : '';

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/lessons/${id}`);
                if (!res.ok) {
                    if (res.status === 404) {
                        setLesson(null);
                        return;
                    }
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const json = await res.json();
                setLesson(json.data);
            } catch (err) {
                console.error('Error fetching lesson:', err);
                setLesson(null);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchLesson();
    }, [id]);

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (!lesson) return notFound();

    // Determine the back link based on hierarchy
    const getBackLink = () => {
        if (lesson.unit) {
            return `/courses/${lesson.course?.id || 'unknown'}/unit/${lesson.unit.id}`;
        }
        return '/lessons'; // Fallback to lessons page
    };

    const getBackText = () => {
        if (lesson.unit) {
            return `← Back to ${lesson.unit.title}`;
        }
        return '← Back to Lessons';
    };

    return (
        <main className="px-6 md:px-16 py-10 font-body bg-white text-[#363F36]">
            <Link href={getBackLink()} className="text-sm text-[#346046] font-semibold mb-6 inline-block">
                {getBackText()}
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* LEFT SIDE */}
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-4">{lesson.title}</h1>
                    <p className="text-sm text-[#363F36] mb-4 max-w-lg">{lesson.description}</p>

                    {/* Tags */}
                    {lesson.tags && lesson.tags.length > 0 && (
                        <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                                {lesson.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Price */}
                    <div className="mb-6">
                        <p className="text-sm text-gray-600 mb-1">Price:</p>
                        <div className="text-2xl font-bold text-primary">${parseFloat(lesson.price).toFixed(2)}</div>
                    </div>

                    <div className="flex gap-4 mb-6 mt-8">
                        <div className="flex flex-row gap-4 w-full md:w-auto">
                            <button
                                onClick={() => setOpenPreviewPdf(true)}
                                disabled={!lesson.previewUrl}
                                className={`px-6 py-3 rounded-lg border font-bold text-base transition-colors ${lesson.previewUrl
                                    ? 'border-[#363F36] text-[#363F36] bg-white hover:bg-primary hover:text-white'
                                    : 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed'
                                    }`}
                            >
                                Preview
                            </button>

                            <AnimatedAddToCartButton
                                productId={lesson.id}
                                productType="LESSON"
                                itemTitle={lesson.title}
                                itemImg={lesson.imageUrl}
                                itemDesc={lesson.description}
                                itemPrice={parseFloat(lesson.price)}
                                size="base"
                                colorButton={lesson.colorButton || '#3E724A'}
                            />
                        </div>
                    </div>

                    {/* Hierarchy Info */}
                    <div className="mb-6 text-sm text-gray-600">
                        {lesson.course && (
                            <p className="mb-1">
                                <span className="font-medium">Course:</span>{' '}
                                <Link href={`/courses/${lesson.course.id}`} className="text-[#346046] hover:underline">
                                    {lesson.course.title}
                                </Link>
                            </p>
                        )}
                        {lesson.unit && (
                            <p className="mb-1">
                                <span className="font-medium">Unit:</span>{' '}
                                <Link
                                    href={getBackLink()}
                                    className="text-[#346046] hover:underline"
                                >
                                    {lesson.unit.title}
                                </Link>
                            </p>
                        )}
                        {lesson.subunit && (
                            <p className="mb-1">
                                <span className="font-medium">Subunit:</span> {lesson.subunit.title}
                            </p>
                        )}
                    </div>

                    {lesson.previewUrl && (
                        <Link
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setOpenPreviewPdf(true);
                            }}
                            className="text-[#346046] text-sm font-medium flex items-center gap-1 hover:underline"
                        >
                            Preview Lesson Overview →
                        </Link>
                    )}
                </div>

                {/* RIGHT SIDE */}
                <div className="flex flex-col gap-10">
                    {/* Image */}
                    <div className="relative w-full aspect-[4/3]">
                        <Image
                            src={lesson.imageUrl || '/dummy/sample-product.png'}
                            alt={lesson.title}
                            fill
                            className="object-cover rounded-md shadow"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/dummy/sample-product.png';
                            }}
                        />
                        {lesson.previewUrl && (
                            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-md">
                                <button
                                    onClick={() => setOpenThumbnail(true)}
                                    className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg text-sm font-medium"
                                >
                                    Preview
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Bundles */}
                    <LessonBundleSection lessonId={lesson.id} />
                </div>
            </div>

            <LessonPdfThumbnailModal
                open={openThumbnail}
                onClose={() => setOpenThumbnail(false)}
                imgUrl={lesson.imageUrl || '/dummy/sample-product.png'}
                onPreviewPdf={() => {
                    setOpenThumbnail(false);
                    setOpenPreviewPdf(true);
                }}
            />

            <ModalPreviewPdf
                open={openPreviewPdf}
                onClose={() => setOpenPreviewPdf(false)}
                pdfUrl={lesson.previewUrl || ''}
                title="Preview PDF"
            />
        </main>
    );
}