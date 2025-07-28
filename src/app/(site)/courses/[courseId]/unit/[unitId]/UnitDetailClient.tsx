'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AnimatedAddToCartButton from '@/app/(site)/components/AnimatedAddToCartButton';

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
}: UnitDetailClientProps) {
    const [selectedSubunit, setSelectedSubunit] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    // ⛔️ Hook tidak boleh setelah early return, jadi semua useMemo tetap dipanggil
    const filteredLessons = useMemo(() => {
        if (!unit?.lessons) return [];
        return unit.lessons.filter((lesson) => {
            const matchSubunit = selectedSubunit ? lesson.subunitId === selectedSubunit : true;
            const matchSearch =
                lesson.title.toLowerCase().includes(search.toLowerCase()) ||
                lesson.description.toLowerCase().includes(search.toLowerCase());
            return matchSubunit && matchSearch;
        });
    }, [unit?.lessons, selectedSubunit, search]);

    const totalPrice = useMemo(() => {
        return (unit?.lessons || [])
            .reduce((acc, l) => acc + parseFloat(l.price || '0'), 0)
            .toFixed(2);
    }, [unit?.lessons]);

    const getSubunitTitle = (subunitId: string | null) => {
        if (!subunitId) return 'General';
        return (unit?.subunits || []).find((s) => s.id === subunitId)?.title || 'Unknown';
    };

    const handlePreview = (lesson: Lesson) => {
        if (lesson.previewUrl) {
            window.open(lesson.previewUrl, '_blank');
        } else {
            alert('Preview not available for this lesson');
        }
    };

    const clearSearch = () => {
        setSearch('');
    };

    // ✅ Kondisi setelah semua hooks terpanggil
    if (!unit) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-10 text-center">
                <div className="text-red-500 text-lg">Unit data not found</div>
                <p className="text-gray-500 mt-2">Please try refreshing the page or go back to the course.</p>
            </div>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-6 py-10 font-body text-primary">
            <nav className="mb-4 text-sm text-gray-500">
                <Link href={`/courses/${courseId}`} className="hover:underline transition-colors">
                    {courseTitle}
                </Link>{' '}
                <span className="mx-1">&gt;</span>
                <span className="text-gray-700">{unit.title}</span>
            </nav>

            <div className="flex gap-6 border-b border-gray-300 mb-6 overflow-x-auto">
                {allUnits.map((u) => (
                    <Link
                        key={u.id}
                        href={`/courses/${courseId}/unit/${u.id}`}
                        className={`pb-2 border-b-2 whitespace-nowrap transition-colors ${u.id === unit.id
                            ? 'border-green-active font-semibold text-primary'
                            : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        {u.title}
                    </Link>
                ))}

                {allUnits.length > 0 && (unit.subunits || []).length > 0 && (
                    <div className="pb-2 flex items-end">
                        <span className="text-gray-300 text-lg">|</span>
                    </div>
                )}

                <button
                    onClick={() => setSelectedSubunit(null)}
                    className={`pb-2 border-b-2 whitespace-nowrap transition-colors ${selectedSubunit === null
                        ? 'border-green-active font-semibold text-primary'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                        }`}
                >
                    All Lessons ({unit.lessons.length})
                </button>
                {(unit.subunits || []).map((sub) => {
                    const lessonCount = unit.lessons.filter((l) => l.subunitId === sub.id).length;
                    return (
                        <button
                            key={sub.id}
                            onClick={() => setSelectedSubunit(sub.id)}
                            className={`pb-2 border-b-2 whitespace-nowrap transition-colors ${selectedSubunit === sub.id
                                ? 'border-green-active font-semibold text-primary'
                                : 'border-transparent text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {sub.title} ({lessonCount})
                        </button>
                    );
                })}
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                <aside className="w-full lg:w-[320px] rounded-lg p-6 h-fit border border-gray-200">
                    <p className="text-sm text-gray-600 mb-4">{unit.description}</p>

                    <div className="mb-4">
                        <p className="font-medium mb-1">Total Lessons:</p>
                        <div className="text-lg font-semibold text-gray-700">{unit.lessons.length} lessons</div>
                    </div>

                    <div className="mb-6">
                        <p className="font-medium mb-1">Total Price (All Lessons):</p>
                        <div className="text-2xl font-bold text-primary">${totalPrice}</div>
                    </div>

                    <button className="w-full bg-alt text-primary font-bold py-3 rounded hover:bg-primary hover:text-white transition-colors duration-200 mb-3">
                        Preview Unit
                    </button>

                    <AnimatedAddToCartButton
                        productId={unit.id}
                        productType="UNIT"
                        itemTitle={unit.title}
                        itemDesc={unit.description}
                        itemImg={unit.imageUrl || '/placeholder.jpg'}
                        itemPrice={parseFloat(unit.price) || 0}
                    />
                </aside>

                <div className="flex-1">
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div className="relative flex-1 max-w-sm">
                            <input
                                type="text"
                                placeholder="Search lessons..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="border border-gray-300 px-4 py-2 rounded-md w-full pr-10 focus:outline-none focus:ring-2 focus:ring-green-active focus:border-transparent"
                            />
                            {search && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    aria-label="Clear search"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        <div className="text-sm text-gray-500">
                            Showing {filteredLessons.length} of {unit.lessons.length} lessons
                        </div>
                    </div>

                    {filteredLessons.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-lg mb-2">No lessons found</div>
                            <p className="text-gray-500 text-sm">
                                {search ? 'Try adjusting your search terms' : 'No lessons available in this section'}
                            </p>
                        </div>
                    )}

                    {filteredLessons.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredLessons.map((lesson) => (
                                <div key={lesson.id} className="border rounded-lg p-4 flex flex-col">
                                    <div className="relative w-full h-48 mb-4 rounded overflow-hidden">
                                        <Image
                                            src={lesson.imageUrl || '/placeholder.jpg'}
                                            alt={lesson.title}
                                            fill
                                            className="object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/placeholder.jpg';
                                            }}
                                        />
                                        {lesson.previewUrl && (
                                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handlePreview(lesson)}
                                                    className="bg-white text-primary px-3 py-1 rounded text-sm font-medium"
                                                >
                                                    Preview
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide">
                                        {getSubunitTitle(lesson.subunitId)}
                                    </div>

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

                                        <div className="w-1/2">
                                            <AnimatedAddToCartButton
                                                productId={lesson.id}
                                                productType="LESSON"
                                                itemTitle={lesson.title}
                                                itemDesc={lesson.description}
                                                itemImg={lesson.imageUrl}
                                                itemPrice={parseFloat(lesson.price)}
                                                size="sm"
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
