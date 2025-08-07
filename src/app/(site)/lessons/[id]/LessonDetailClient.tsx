'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import AnimatedAddToCartButton from '../../components/AnimatedAddToCartButton';
import LessonPdfThumbnailModal from '../../components/LessonPdfThumbnailModal';
import ModalPreviewPdf from '../../components/ModalPreviewPdf';
import LessonBundleSection from '../../components/lesson-page/LessonBundleSection';
import YouMayAlsoLike from './YouMayAlsoLike';

interface Lesson {
    id: string;
    title: string;
    description: string;
    courseIncluded?: string | null;
    imageUrl: string;
    price: string;
    previewUrl: string | null;
    studyGuideUrl?: string | null;      // ← tambahkan field ini
    digitalUrl: string | null;
    isFreeLesson?: boolean;
    tags?: string[];
    colorButton?: string;
    metadata?: {
        learningActivities?: string;
    };
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
    const [openStudyGuidePdf, setOpenStudyGuidePdf] = useState(false); // ← state baru
    const [openThumbnail, setOpenThumbnail] = useState(false);

    const [emailInput, setEmailInput] = useState('');
    const [sending, setSending] = useState(false);

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

                const parsedLesson = json.data as Lesson;
                if (parsedLesson.metadata && typeof parsedLesson.metadata === 'string') {
                    try {
                        parsedLesson.metadata = JSON.parse(parsedLesson.metadata);
                    } catch (e) {
                        console.warn('Failed to parse metadata:', e);
                        parsedLesson.metadata = {};
                    }
                }

                setLesson(parsedLesson);
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

    const getBackLink = () => {
        if (lesson.unit) {
            return `/courses/${lesson.course?.id || 'unknown'}/unit/${lesson.unit.id}`;
        }
        return '/lessons';
    };

    const getBackText = () => {
        if (lesson.unit) {
            return `← Back to ${lesson.unit.title}`;
        }
        return '← Back to Lessons';
    };

    const handleSubmitFreeLesson = async () => {
        if (!emailInput || !/\S+@\S+\.\S+/.test(emailInput)) {
            alert('Masukkan email yang valid.');
            return;
        }

        setSending(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/free-access`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lessonId: lesson.id, email: emailInput }),
            });

            const data = await res.json();

            if (res.ok) {
                alert('✅ Materi telah dikirim ke email!');
                setEmailInput('');
            } else {
                alert(`❌ Gagal: ${data.error}`);
            }
        } catch (err) {
            console.error('Send failed:', err);
            alert('❌ Gagal mengirim email.');
        } finally {
            setSending(false);
        }
    };

    return (
        <main className="font-body bg-white text-[#363F36]">
            <div className="px-6 md:px-16 py-10 ">
                <Link href={getBackLink()} className="text-sm text-[#346046] font-semibold mb-6 inline-block">
                    {getBackText()}
                </Link>

                <div className=" grid grid-cols-1 md:grid-cols-2 gap-12 ">
                    {/* LEFT SIDE */}
                    <div className="max-w-lg">
                        <h1 className="text-2xl md:text-3xl font-bold mb-4">{lesson.title}</h1>
                        <p className="text-sm text-text mb-4 leading-6">{lesson.description}</p>

                        {lesson.metadata?.learningActivities && (
                            <div className="mb-6">
                                <p className="text-md font-semibold text-[#3E724A] p-2 mb-4 border-b-2 border-[#3E724A] pb-1">
                                    Learning Activities
                                </p>
                                <div
                                    className="text-sm text-[#363F36] space-y-5 leading-6"
                                    dangerouslySetInnerHTML={{ __html: lesson.metadata.learningActivities }}
                                />
                            </div>
                        )}

                        {/* Tags */}
                        {lesson.tags && lesson.tags.length > 0 && (
                            <div className="mb-4">
                                <div className="flex flex-wrap gap-3">
                                    {lesson.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="pr-4 py-1  text-gray-500 text-xs rounded-md"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4 mb-6 mt-8">
                            <div className="flex flex-row gap-4 w-full md:w-auto">
                                <button
                                    onClick={() => setOpenStudyGuidePdf(true)}
                                    disabled={!lesson.previewUrl}
                                    className={`px-6 py-3 rounded-lg border font-bold text-base transition-colors ${lesson.previewUrl
                                        ? 'border-[#363F36] text-[#363F36] bg-white hover:bg-primary hover:text-white'
                                        : 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed'
                                        }`}
                                >
                                    Preview
                                </button>

                                {lesson.isFreeLesson ? (
                                    <div className="flex flex-col gap-2 w-full md:w-auto">
                                        <input
                                            type="email"
                                            placeholder="Masukkan email kamu"
                                            value={emailInput}
                                            onChange={(e) => setEmailInput(e.target.value)}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-sm"
                                        />
                                        <button
                                            onClick={handleSubmitFreeLesson}
                                            disabled={sending}
                                            className="px-6 py-3 rounded-lg font-bold text-sm transition-colors text-white bg-[#3E724A] hover:bg-[#2e5a39] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {sending ? 'Mengirim...' : 'Kirim Gratis ke Email'}
                                        </button>
                                    </div>
                                ) : (
                                    <AnimatedAddToCartButton
                                        productId={lesson.id}
                                        productType="LESSON"
                                        itemTitle={lesson.title}
                                        itemImg={lesson.imageUrl}
                                        itemDesc={lesson.description}
                                        itemPrice={parseFloat(lesson.price)}
                                        size="base"
                                        colorButton={lesson.colorButton || '#363F36'}
                                    />
                                )}
                            </div>
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

                        <LessonBundleSection lessonId={lesson.id} />
                    </div>
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
                title="Preview Lesson"
            />

            <ModalPreviewPdf
                open={openStudyGuidePdf}
                onClose={() => setOpenStudyGuidePdf(false)}
                pdfUrl={lesson.studyGuideUrl || ''}
                title="Preview Study Guide"
            />

            <YouMayAlsoLike />
        </main>
    );
}
