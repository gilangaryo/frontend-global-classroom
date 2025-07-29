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
                        <div className="flex flex-row gap-4 w-full md:w-auto">
                            <button
                                onClick={() => setOpenPreviewPdf(true)}
                                className="px-6 py-3 rounded-lg border border-[#363F36] text-[#363F36] font-bold text-base bg-white hover:bg-primary hover:text-white transition-colors"
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
                            />
                        </div>
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
                    <LessonBundleSection lessonId={lesson.id} />
                </div>
            </div>

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
