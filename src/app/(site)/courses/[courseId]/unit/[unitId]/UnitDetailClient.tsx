'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useMemo } from 'react';
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
    tags?: string[];
}

interface Subunit {
    id: string;
    title: string;
    lessons?: Lesson[];
}

interface Unit {
    id: string;
    title: string;
    description: string;
    price: string;
    imageUrl: string;
    lessons: Lesson[];
    subunits: Subunit[];
    tags?: string[];
    previewUrl?: string | null;
}

interface UnitDetailClientProps {
    unit: Unit | null;
    allUnits: { id: string; title: string }[];
    courseId: string;
    courseTitle: string;
    courseColor?: string;
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
    const [currentPage, setCurrentPage] = useState(1);

    const LESSONS_PER_PAGE = 8;

    const unitPrice = parseFloat(unit?.price || '0');

    const totalLessons = unit?.lessons?.length || 0;
    const totalPages = Math.ceil(totalLessons / LESSONS_PER_PAGE);

    const paginatedLessons = useMemo(() => {
        if (!unit?.lessons) return [];
        const startIndex = (currentPage - 1) * LESSONS_PER_PAGE;
        const endIndex = startIndex + LESSONS_PER_PAGE;
        return unit.lessons.slice(startIndex, endIndex);
    }, [unit?.lessons, currentPage]);

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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to lessons section
        document.querySelector('#lessons-section')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

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

                    <AnimatedAddToCartButton
                        productId={unit.id}
                        productType="UNIT"
                        itemTitle={unit.title}
                        itemDesc={unit.description}
                        itemImg={unit.imageUrl || '/placeholder.jpg'}
                        itemPrice={unitPrice}
                        size="course"
                        colorButton='#D9C7BF'
                        buttonText="Buy All Lesson"
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
                <div className="flex-1" id="lessons-section">
                    {totalLessons === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-lg mb-2">No lessons found</div>
                            <p className="text-gray-500 text-sm">No lessons available in this section</p>
                        </div>
                    ) : (
                        <>
                            {/* Pagination Info */}
                            <div className="flex justify-between items-center mb-6">
                                <p className="text-sm text-gray-600">
                                    Showing {((currentPage - 1) * LESSONS_PER_PAGE) + 1} to {Math.min(currentPage * LESSONS_PER_PAGE, totalLessons)} of {totalLessons} lessons
                                </p>
                                <p className="text-sm text-gray-600">
                                    Page {currentPage} of {totalPages}
                                </p>
                            </div>

                            {/* Lessons Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {paginatedLessons.map((lesson) => (
                                    <Link
                                        key={lesson.id}
                                        href={`/lessons/${lesson.id}`}
                                        className="rounded-lg p-4 flex flex-col cursor-pointer transition mb-10"
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <div className="relative w-full h-48 mb-4 rounded overflow-hidden group">
                                            <Image
                                                src={lesson.imageUrl || '/placeholder.jpg'}
                                                alt={lesson.title}
                                                fill
                                                className="object-cover z-0 group-hover:scale-101 transition-transform duration-200 grayscale"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/placeholder.jpg';
                                                }}
                                            />
                                            {lesson.previewUrl && (
                                                <div className=" absolute inset-0 bg-black/50 z-10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity ease-in duration-200">
                                                    <button
                                                        type="button"
                                                        onClick={e => {
                                                            e.preventDefault();
                                                        }}
                                                        className="bg-white/20 backdrop-blur-sm text-white px-14 py-3 rounded-lg text-sm font-normal"
                                                    >
                                                        See More
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {lesson.tags && lesson.tags.length > 0 && (
                                            <span className="text-xs text-text  mb-2">
                                                {lesson.tags.slice(0, 3).join(', ')}
                                                {lesson.tags.length > 3 && '...'}
                                            </span>
                                        )}
                                        <h3 className="text-lg font-bold mb-3 line-clamp-2">{lesson.title}</h3>
                                        <p className="text-sm text-gray-500 flex-1 mb-4 line-clamp-3">{lesson.description}</p>

                                        <div className="flex w-full gap-4 items-stretch mt-auto">
                                            <button
                                                type="button"
                                                onClick={e => {
                                                    e.preventDefault();
                                                    handlePreview(lesson);
                                                }}
                                                disabled={!lesson.previewUrl}
                                                className={`w-1/2 border px-4 py-2 text-sm rounded transition-colors ${lesson.previewUrl
                                                    ? 'border-gray-500 hover:border-gray-700 hover:bg-gray-100'
                                                    : 'border-gray-200 text-gray-300 cursor-not-allowed'
                                                    }`}
                                            >
                                                Preview
                                            </button>
                                            <div className="w-1/2">
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
                                    </Link>
                                ))}
                            </div>



                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2">
                                    {/* Previous Button */}
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                    >
                                        Previous
                                    </button>

                                    {/* Page Numbers */}
                                    {getPageNumbers().map((page, index) => (
                                        <span key={index}>
                                            {page === '...' ? (
                                                <span className="px-3 py-2 text-gray-500">...</span>
                                            ) : (
                                                <button
                                                    onClick={() => handlePageChange(page as number)}
                                                    className={`px-3 py-2 text-sm border rounded-lg transition-colors ${currentPage === page
                                                        ? 'bg-primary text-white border-primary'
                                                        : 'hover:bg-gray-50 border-gray-300'
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            )}
                                        </span>
                                    ))}

                                    {/* Next Button */}
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}