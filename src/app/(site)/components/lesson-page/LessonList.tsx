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
    price: string;
    subunit?: { title: string } | null;
    tag?: string;
    description?: string;
};

export type Course = { id: string; title: string };
export type Unit = { id: string; title: string };

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

    // Optional filters
    const [grade, setGrade] = useState('');
    const [curriculum, setCurriculum] = useState('');
    const [activity, setActivity] = useState('');
    const [support, setSupport] = useState('');

    useEffect(() => {
        const controller = new AbortController();
        const timeout = setTimeout(() => setLoading(true), 50); // smooth transition loading

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        let url = `${baseUrl}/api/lessons?page=${page}&limit=6`;
        if (course) url += `&courseId=${course}`;
        if (unit) url += `&unitId=${unit}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;

        fetch(url, { signal: controller.signal })
            .then((res) => res.json())
            .then((json) => {
                setLessons(json.data || []);
                setTotalPages(json.pagination?.totalPages || 1);
            })
            .catch((err) => {
                if (err.name !== 'AbortError') {
                    console.error("Fetch error:", err);
                }
            })
            .finally(() => {
                clearTimeout(timeout);
                setLoading(false);
            });

        return () => {
            controller.abort();
            clearTimeout(timeout);
        };
    }, [course, unit, search, page]);


    return (
        <main className="font-body max-w-full mx-auto pb-10">
            <LessonSearchBar search={search} setSearch={setSearch} />

            <div className="flex items-center gap-2 border-b border-[#EFE9E9] bg-white px-4 md:px-25 pt-8 pb-2 mb-6 overflow-x-auto">
                <button
                    onClick={() => {
                        setCourse('');
                        setPage(1);
                    }}
                    className={`px-3 py-1 rounded border transition text-sm ${!course
                        ? 'bg-button2 text-[#3E724A] font-bold border-[#3E724A]'
                        : 'bg-transparent text-[#3E724A] border-transparent hover:border-[#3E724A]'
                        }`}
                    style={{ boxShadow: !course ? '0 0 0 2px #3E724A22' : undefined }}
                >
                    ALL COURSES
                </button>
                {initialCourses.map((c) => (
                    <button
                        key={c.id}
                        onClick={() => {
                            setCourse(c.id);
                            setPage(1);
                        }}
                        className={`px-3 py-1 rounded border transition text-sm ${course === c.id
                            ? 'bg-button2 text-[#3E724A] font-bold border-[#3E724A]'
                            : 'bg-transparent text-[#3E724A] border-transparent hover:border-[#3E724A]'
                            }`}
                        style={{ boxShadow: course === c.id ? '0 0 0 2px #3E724A22' : undefined }}
                    >
                        {c.title}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-4 px-4 md:px-25 gap-20 bg-white">
                <LessonSidebar
                    initialUnits={initialUnits}
                    unit={unit}
                    setUnit={(id) => {
                        setUnit(id);
                        setPage(1);
                    }}
                    grade={grade}
                    setGrade={setGrade}
                    curriculum={curriculum}
                    setCurriculum={setCurriculum}
                    activity={activity}
                    setActivity={setActivity}
                    support={support}
                    setSupport={setSupport}
                />

                <div className="md:col-span-3 flex flex-col gap-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 relative min-h-[420px]">
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
                            <div className="col-span-3 text-[#888]">No lessons found.</div>
                        ) : (
                            lessons.map((l) => <LessonCard key={l.id} lesson={l} />)
                        )}
                    </div>

                    {!loading && totalPages > 1 && (
                        <div className="flex justify-center gap-4 pt-6">
                            <button
                                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                disabled={page === 1}
                                className="px-4 py-2 border rounded disabled:opacity-40"
                            >
                                Prev
                            </button>
                            <span className="px-4 py-2">{page} / {totalPages}</span>
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
