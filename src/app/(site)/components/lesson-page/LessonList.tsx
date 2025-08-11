'use client';
import { useState, useEffect } from 'react';
import LessonSidebar from './LessonSidebar';
import LessonCard from './LessonCard';
import LessonSearchBar from './LessonSearchBar';

export type Lesson = {
    id: string;
    title: string;
    grade?: string;
    imageUrl?: string | null;
    price: string | number;
    subunit?: { title: string } | null;
    previewUrl?: string;
    tag?: string;
    description?: string | null;
    tags?: string[];
    unit?: { id: string; title: string } | null;
    course?: { id: string; title: string } | null;
};

export type Course = {
    id: string;
    title: string;
    colorButton?: string;
    isActive?: boolean;
};

export type Unit = {
    id: string;
    title: string;
    slug?: string;
    previewUrl?: string | null;
    digitalUrl?: string | null;
    description?: string | null;
    price?: string | number;
    imageUrl?: string | null;
    isActive?: boolean;
    parentId?: string;
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
};

type LessonApi = {
    id: string;
    title: string;
    imageUrl?: string | null;
    price: string | number;
    description?: string | null;
    // backend bisa kirim string[] atau {name?:string|null}[]
    tags?: Array<string | { name?: string | null }> | null;
    subunit?: { title: string } | null;
    unit?: { id: string; title: string } | null;
    course?: { id: string; title: string } | null;
    previewUrl?: string | null;
};

function hexToRgba(hex: string, alpha = 1): string {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// normalize apa saja → string[]
const toStringTags = (tags: LessonApi['tags']): string[] => {
    if (!Array.isArray(tags)) return [];
    const out: string[] = [];
    for (const t of tags) {
        if (typeof t === 'string') {
            const s = t.trim();
            if (s) out.push(s);
        } else if (t && typeof t === 'object' && 'name' in t) {
            const name = (t as { name?: string | null }).name ?? '';
            const s = String(name).trim();
            if (s) out.push(s);
        }
    }
    return out;
};

export default function LessonList({
    initialCourses = [],
    initialUnits = [],
    loading: initialLoading = false,
}: {
    initialCourses: Course[];
    initialUnits: Unit[];
    loading?: boolean;
}) {
    const [search, setSearch] = useState('');
    const [course, setCourse] = useState('');
    const [unit, setUnit] = useState('');
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(initialLoading);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [tag, setTag] = useState('');

    const [allLessonTags, setAllLessonTags] = useState<string[]>([]);
    const [tagsLoading, setTagsLoading] = useState(false);

    // fetch daftar tag (sekali per perubahan course)
    useEffect(() => {
        const fetchTags = async () => {
            setTagsLoading(true);
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
                let tagsUrl = `${baseUrl}/api/products/tags?type=LESSON`;
                if (course) tagsUrl += `&courseId=${course}`;

                const response = await fetch(tagsUrl, { cache: 'no-store' });
                const data: {
                    status: string;
                    data?: { tags?: string[]; count?: number };
                    message?: string;
                } = await response.json();

                if (data.status === 'success') {
                    setAllLessonTags(data.data?.tags ?? []);
                } else {
                    setAllLessonTags([]);
                }
            } catch {
                setAllLessonTags([]);
            } finally {
                setTagsLoading(false);
            }
        };

        fetchTags();
    }, [course]);

    const filteredUnits = course
        ? initialUnits.filter((u) => String(u.parentId) === String(course))
        : [];

    useEffect(() => {
        setUnit('');
        setPage(1);
    }, [course]);

    useEffect(() => {
        setPage(1);
    }, [search, unit, tag]);

    // fetch lessons
    useEffect(() => {
        const controller = new AbortController();
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';

        const run = async () => {
            const loadingDelay = setTimeout(() => setLoading(true), 60);
            try {
                let url = `${baseUrl}/api/products/lessons?page=${page}&limit=6`;
                if (course) url += `&courseId=${course}`;
                if (unit) url += `&unitId=${unit}`;
                if (search) url += `&search=${encodeURIComponent(search)}`;
                if (tag) url += `&tag=${encodeURIComponent(tag)}`;

                const res = await fetch(url, { signal: controller.signal, cache: 'no-store' });
                const json: {
                    status?: string;
                    data?: LessonApi[];
                    pagination?: { totalPages?: number };
                } = await res.json();

                const mapped: Lesson[] = (json.data ?? []).map((l) => {
                    const tagNames = toStringTags(l.tags);
                    return {
                        id: l.id,
                        title: l.title,
                        imageUrl: l.imageUrl ?? null,
                        price: l.price,
                        description: l.description ?? null,
                        tags: tagNames,
                        tag: tagNames[0] || undefined,
                        subunit: l.subunit ?? null,
                        unit: l.unit ?? null,
                        course: l.course ?? null,
                        grade: undefined,
                        previewUrl: l.previewUrl ?? undefined,
                    };
                });

                setLessons(mapped);
                setTotalPages(json.pagination?.totalPages ?? 1);
            } catch (e) {
                if ((e as Error).name !== 'AbortError') {
                    console.error('Fetch lessons failed:', e);
                }
            } finally {
                clearTimeout(loadingDelay);
                setLoading(false);
            }
        };

        run();
        return () => controller.abort();
    }, [course, unit, search, page, tag]);

    const handleTagSearch = (searchTerm: string) => {
        setTag(searchTerm);
        setPage(1);
    };

    const clearAllFilters = () => {
        setSearch('');
        setTag('');
        setUnit('');
        setPage(1);
    };

    const activeFiltersCount = [search, tag, unit].filter(Boolean).length;

    return (
        <main className="font-body max-w-full mx-auto pb-10">
            <LessonSearchBar search={search} setSearch={setSearch} />

            <div className="flex items-center gap-4 border-b border-[#EFE9E9] bg-white px-4 md:px-25 pt-8 pb-2 mb-6 overflow-x-auto">
                <button
                    onClick={() => {
                        setCourse('');
                        setPage(1);
                    }}
                    className={`px-3 py-1 rounded border transition text-sm ${!course
                        ? 'bg-button2 text-[#3E724A] font-bold border-[#3E724A]'
                        : 'bg-transparent text-[#3E724A] border-transparent hover:border-[#3E724A]'
                        }`}
                    style={{ boxShadow: !course ? '0 0 0 0px #3E724A22' : undefined }}
                >
                    <h2>ALL COURSES</h2>
                </button>

                {initialCourses.map((c) => {
                    const isSelected = course === c.id;
                    const isInactive = c.isActive === false;
                    const color = c.colorButton || '#3E724A';

                    const backgroundColor = isSelected ? hexToRgba(color, 0.1) : 'transparent';
                    const borderColor = isSelected ? color : 'transparent';

                    let textColor = '#6b7280';
                    if (isSelected) textColor = color;
                    if (isInactive) textColor = '#9ca3af';

                    return (
                        <button
                            key={c.id}
                            onClick={() => {
                                if (isInactive) return;
                                setCourse(c.id);
                            }}
                            className={`px-4 py-2 rounded border transition text-sm font-bold tracking-wide ${isInactive ? 'cursor-not-allowed opacity-60' : 'hover:opacity-80'
                                }`}
                            style={{ backgroundColor, color: textColor, borderColor }}
                        >
                            {c.title}
                        </button>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 px-4 md:px-25 gap-10 bg-white">
                <LessonSidebar
                    initialUnits={filteredUnits}
                    unit={unit}
                    setUnit={(id) => {
                        setUnit(id);
                        setPage(1);
                    }}
                    colorClass={initialCourses.find((c) => c.id === course)?.colorButton || '#3E724A'}
                    tag={tag}
                    setTag={setTag}
                    allLessonTags={allLessonTags}
                    onTagSearch={handleTagSearch}
                />

                <div className="md:col-span-3 md:col-start-3 flex flex-col gap-6">
                    {activeFiltersCount > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 w-full mb-2">
                                <span className="text-sm text-gray-600 font-medium">
                                    Active filters ({activeFiltersCount}):
                                </span>
                                <button
                                    onClick={clearAllFilters}
                                    className="text-xs text-red-600 hover:text-red-800 underline"
                                >
                                    Clear all
                                </button>
                            </div>

                            {search && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Search: &ldquo;{search}&rdquo;
                                    <button onClick={() => setSearch('')} className="ml-1 text-blue-600 hover:text-blue-800">
                                        ×
                                    </button>
                                </span>
                            )}

                            {tag && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Tag: {tag}
                                    <button onClick={() => setTag('')} className="ml-1 text-green-600 hover:text-green-800">
                                        ×
                                    </button>
                                </span>
                            )}

                            {unit && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    Unit: {initialUnits.find((u) => u.id === unit)?.title || unit}
                                    <button onClick={() => setUnit('')} className="ml-1 text-purple-600 hover:text-purple-800">
                                        ×
                                    </button>
                                </span>
                            )}
                        </div>
                    )}

                    {tagsLoading && <div className="text-sm text-gray-500 mb-2">Loading...</div>}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 relative min-h-[420px]">
                        {loading && (
                            <div className="absolute inset-0 bg-white/80 z-10 flex flex-wrap gap-4 p-2">
                                {[...Array(6)].map((_, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-lg bg-gray-100 animate-pulse h-[180px] w-full sm:w-[calc(50%-0.75rem)]"
                                    />
                                ))}
                            </div>
                        )}

                        {!loading && lessons.length === 0 ? (
                            <div className="col-span-2 text-black text-center py-8">
                                <p className="text-lg mb-2">No lessons found.</p>
                                <p className="text-sm text-gray-500 mb-4">Try adjusting your filters or search terms.</p>
                                {activeFiltersCount > 0 && (
                                    <button
                                        onClick={clearAllFilters}
                                        className="text-blue-600 hover:text-blue-800 underline text-sm"
                                    >
                                        Clear all filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            lessons.map((l) => (
                                <LessonCard
                                    key={l.id}
                                    lesson={l}
                                    colorClass={initialCourses.find((c) => c.id === course)?.colorButton || '#363F36'}
                                    onTagClick={(t) => {
                                        setTag(t);
                                        setPage(1);
                                        // scroll up dikit biar kelihatan filter aktif
                                        if (typeof window !== 'undefined') {
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }
                                    }}
                                />
                            ))
                        )}
                    </div>

                    {!loading && totalPages > 1 && (
                        <div className="flex justify-center gap-4 pt-6">
                            <button
                                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                disabled={page === 1}
                                className="px-6 py-2 border rounded disabled:opacity-40 hover:bg-gray-100"
                            >
                                Prev
                            </button>
                            <span className="px-4 py-2 text-sm">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                                disabled={page === totalPages}
                                className="px-6 py-2 border rounded-lg disabled:opacity-40 hover:bg-gray-100"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
