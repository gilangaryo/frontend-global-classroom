'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Divider from '@/app/(site)/components/Divider';
import AnimatedAddToCartButton from '@/app/(site)/components/AnimatedAddToCartButton';
import ModalPreviewPdf from '@/app/(site)/components/ModalPreviewPdf';

interface Lesson {
    id: string;
    title: string;
    description: string;
    price: string;
    imageUrl: string;
    subunitId: string | null;
    previewUrl?: string | null;
}

interface Subunit {
    id: string;
    title: string;
}

interface Unit {
    id: string;
    title: string;
    description: string;
    price: string;
    imageUrl: string;
    lessons: Lesson[];
    subunits: Subunit[];
    tag: string;
    previewUrl?: string | null;
}

interface UnitDetailClientProps {
    unit: Unit | null;
    allUnits: { id: string; title: string }[];
    courseId: string;
    courseTitle: string;
}

export default function UnitDetailClient({
    unit,
    allUnits,
    courseId,
    courseTitle,
    courseColor
}: UnitDetailClientProps) {
    const [openPreviewPdf, setOpenPreviewPdf] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string>('');

    const handlePreview = (lesson: Lesson) => {
        if (lesson.previewUrl) {
            setPdfUrl(lesson.previewUrl);
            setOpenPreviewPdf(true);
        } else {
            alert('Preview not available for this lesson');
        }
    };

    if (!unit) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-10 text-center">
                <div className="text-red-500 text-lg">Unit data not found</div>
                <p className="text-gray-500 mt-2">Please try refreshing the page or go back to the course.</p>
            </div>
        );
    }

    const totalPrice = unit.lessons.reduce((acc, l) => acc + parseFloat(l.price || '0'), 0).toFixed(2);

    return (
        <main className="max-w-7xl mx-auto px-6 py-10 font-body text-primary">
            <nav className="mb-4 text-sm text-gray-500">
                <Link href={`/courses/${courseId}`} className="hover:underline transition-colors">
                    <h2 className="flex items-center gap-2 font-semibold tracking-wide text-green-active">
                        {courseTitle}
                        <span className="text-gray-700 mx-1">|</span>
                        <span className="text-gray-700 font-normal">{unit.title}</span>
                    </h2>
                </Link>
            </nav>

            <h1 className="text-3xl md:text-8xl font-bold mb-4 leading-normal text-black">{unit.title}</h1>

            <div className="flex gap-6 border-b border-gray-300 mb-6 overflow-x-auto w-full">
                {allUnits.map((u) => (
                    <Link
                        key={u.id}
                        href={`/courses/${courseId}/unit/${u.id}`}
                        className={`pb-2 border-b-2 whitespace-nowrap transition-colors min-w-max ${u.id === unit.id
                            ? 'border-green-active font-bold text-green-active'
                            : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        {u.title}
                    </Link>
                ))}
            </div>

            <Divider />

            <div className="flex flex-col lg:flex-row gap-20">
                {/* Sidebar */}
                <aside className="w-full lg:w-[420px] pr-6 h-fit">
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">{unit.description}</p>

                    <div className="mb-4">
                        <p className="font-medium mb-1">Total Lessons:</p>
                        <div className="text-lg font-semibold text-gray-700">{unit.lessons.length} lessons</div>
                    </div>

                    <div className="mb-6">
                        <p className="font-medium mb-1">Total Price (All Lessons):</p>
                        <div className="text-2xl font-bold text-primary">${totalPrice}</div>
                    </div>



                    <AnimatedAddToCartButton
                        productId={unit.id}
                        productType="UNIT"
                        itemTitle={unit.title}
                        itemDesc={unit.description}
                        itemImg={unit.imageUrl || '/placeholder.jpg'}
                        itemPrice={parseFloat(unit.price) || 0}
                        size="course"
                        colorButton='#D9C7BF'
                    />

                    <button
                        className="w-full bg-white border border-primary text-primary font-bold py-3 rounded hover:bg-primary hover:text-white transition-colors duration-200 mb-3"
                        onClick={() => {
                            if (unit.previewUrl) {
                                setPdfUrl(unit.previewUrl);
                                setOpenPreviewPdf(true);
                            } else {
                                alert('Preview not available for this unit');
                            }
                        }}
                    >
                        Preview Unit
                    </button>


                    <ModalPreviewPdf
                        open={openPreviewPdf}
                        onClose={() => setOpenPreviewPdf(false)}
                        pdfUrl={pdfUrl}
                        title="Preview"
                    />


                </aside>

                {/* Lessons */}
                <div className="flex-1">
                    {unit.lessons.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-lg mb-2">No lessons found</div>
                            <p className="text-gray-500 text-sm">No lessons available in this section</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {unit.lessons.map((lesson) => (
                                <div key={lesson.id} className="rounded-lg p-4 flex flex-col">
                                    <div className="relative w-full h-48 mb-4 rounded overflow-hidden">
                                        <Image
                                            src={lesson.imageUrl || '/placeholder.jpg'}
                                            alt={lesson.title}
                                            fill
                                            className="object-cover z-0"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/placeholder.jpg';
                                            }}
                                        />
                                        {lesson.previewUrl && (
                                            <div className="absolute inset-0 bg-black/75 z-10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity ease-in duration-200">
                                                <button
                                                    onClick={() => handlePreview(lesson)}
                                                    className="bg-white/20 backdrop-blur-sm text-white px-14 py-3 rounded-lg text-sm font-normal"
                                                >
                                                    See More
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <span className="text-lg font-semibold text-primary ml-2">tag {unit.tag}</span>
                                    <h3 className="text-lg font-bold mb-2 line-clamp-2">{lesson.title}</h3>
                                    <p className="text-sm text-gray-500 flex-1 mb-4 line-clamp-3">{lesson.description}</p>

                                    <div className="flex w-full gap-2 items-stretch mt-auto">
                                        <button
                                            onClick={() => handlePreview(lesson)}
                                            disabled={!lesson.previewUrl}
                                            className={`w-1/2 border px-4 py-2 text-sm rounded transition-colors ${lesson.previewUrl
                                                ? 'border-gray-400 hover:border-gray-600 hover:bg-gray-50'
                                                : 'border-gray-200 text-gray-300 cursor-not-allowed'
                                                }`}
                                        >
                                            Preview
                                        </button>

                                        <div className="w-1/2 ">
                                            <AnimatedAddToCartButton
                                                productId={lesson.id}
                                                productType="LESSON"
                                                itemTitle={lesson.title}
                                                itemDesc={lesson.description}
                                                itemImg={lesson.imageUrl}
                                                itemPrice={parseFloat(lesson.price)}
                                                size="base"
                                                colorButton={courseColor || '#aaaaaa'}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
