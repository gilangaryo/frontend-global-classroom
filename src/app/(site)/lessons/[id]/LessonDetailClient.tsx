'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import AnimatedAddToCartButton from '../../components/AnimatedAddToCartButton';
import LessonPdfThumbnailModal from '../../components/LessonPdfThumbnailModal';
import ModalPreviewPdf from '../../components/ModalPreviewPdf';

interface Lesson {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    price: string;
    previewUrl: string | null;
    digitalUrl: string | null;
    unit: {
        id: string;
        title: string;
        price: string;
        imageUrl: string;
    };
    course?: {
        id: string;
        title: string;
        price: string;
        imageUrl: string;
    };
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
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/lessons/${id}`);
                const json = await res.json();
                setLesson(json.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchLesson();
    }, [id]);

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (!lesson) return notFound();
    const pdfUrl = "https://res.cloudinary.com/dla5fna8n/image/upload/v1753374352/data_desqhr.pdf";
    return (
        <main className="px-6 md:px-16 py-10 font-body bg-white text-[#363F36]">
            <Link href={`/units/${lesson.unit.id}`} className="text-sm text-[#346046] font-semibold mb-6 inline-block">
                ← Back to Unit
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* LEFT SIDE */}
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-4">{lesson.title}</h1>
                    <p className="text-sm text-[#363F36] mb-4 max-w-lg">{lesson.description}</p>
                    <div className="flex gap-4 mb-6 mt-8">
                        <div className="flex flex-col gap-3 w-full md:flex-row md:gap-4">

                            <button
                                onClick={() => setOpenPreviewPdf(true)}
                                className="px-6 py-3 rounded-lg border border-[#363F36] text-[#363F36] font-bold text-base bg-white hover:bg-primary hover:text-white transition-colors w-full md:w-auto"
                            >
                                Preview Full PDF
                            </button>
                        </div>
                        <AnimatedAddToCartButton
                            productId={lesson.id}
                            productType="LESSON"
                            itemTitle={lesson.title}
                            itemImg={lesson.imageUrl}
                            itemDesc={lesson.description}
                            itemPrice={parseFloat(lesson.price)}
                        />
                    </div>

                    <Link
                        href="#"
                        className="text-[#346046] text-sm font-medium flex items-center gap-1 hover:underline"
                    >
                        Preview Lesson Overview →
                    </Link>
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
                        />
                    </div>

                    {/* Bundles */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Save even more with bundles</h3>
                        <div className="space-y-4">
                            {/* UNIT Bundle */}
                            <div className="border border-dashed p-4 rounded-md flex items-center gap-4">
                                <div className="w-16 h-16 relative flex-shrink-0">
                                    <Image
                                        src={lesson.unit.imageUrl ?? '/dummy/sample-unit.jpg'}
                                        alt="Unit"
                                        fill
                                        className="object-cover rounded-md"
                                    />
                                </div>
                                <div className="flex-grow">
                                    <p className="text-sm font-semibold">Purchase the entire unit</p>
                                    <p className="text-xs text-gray-500">This unit introduces students to...</p>
                                    <p className="text-sm mt-1 font-bold">${parseFloat(lesson.unit.price).toFixed(2)}</p>
                                </div>
                                <AnimatedAddToCartButton
                                    productId={lesson.unit.id}
                                    productType="UNIT"
                                    itemTitle={lesson.unit.title}
                                    itemImg={lesson.unit.imageUrl}
                                    itemDesc=""
                                    itemPrice={parseFloat(lesson.unit.price)}
                                    size="sm"
                                />
                            </div>

                            {/* COURSE Bundle (optional, tampilkan hanya jika ada course) */}
                            {lesson && (
                                <div className="border border-dashed p-4 rounded-md flex items-center gap-4">
                                    <div className="w-16 h-16 relative flex-shrink-0">
                                        <Image
                                            src={lesson.imageUrl ?? '/dummy/sample-course.jpg'}
                                            alt="Course"
                                            fill
                                            className="object-cover rounded-md"
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-sm font-semibold">Purchase the entire course</p>
                                        <p className="text-xs text-gray-500">
                                            Foundations of Global Politics is a complete...
                                        </p>
                                        <p className="text-sm mt-1 font-bold">${parseFloat(lesson.price).toFixed(2)}</p>
                                    </div>
                                    <AnimatedAddToCartButton
                                        productId={lesson.id}
                                        productType="COURSE"
                                        itemTitle={lesson.title}
                                        itemImg={lesson.imageUrl}
                                        itemDesc=""
                                        itemPrice={parseFloat(lesson.price)}
                                        size="sm"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <LessonPdfThumbnailModal
                open={openThumbnail}
                onClose={() => setOpenThumbnail(false)}
                imgUrl={lesson.imageUrl}
                onPreviewPdf={() => {
                    setOpenThumbnail(false);
                    setOpenPreviewPdf(true);
                }}
            />

            <ModalPreviewPdf
                open={openPreviewPdf}
                onClose={() => setOpenPreviewPdf(false)}
                // pdfUrl={lesson.previewUrl ?? ''}
                pdfUrl={pdfUrl}
                title="Preview PDF"
            />
        </main>
    );
}
