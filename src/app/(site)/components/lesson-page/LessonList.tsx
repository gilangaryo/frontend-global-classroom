'use client';
import { useState, useEffect } from 'react';
import LessonSidebar from './LessonSidebar';
import LessonCard from './LessonCard';
import FreeLessonsSection from './FreeLessonsSection';
import WhyTeachersLoveSection from './WhyTeachersLoveSection';
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

export type Course = { id: string; title: string; };
export type Unit = { id: string; title: string; };

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

    const [grade, setGrade] = useState('');
    const [curriculum, setCurriculum] = useState('');
    const [activity, setActivity] = useState('');
    const [support, setSupport] = useState('');

    useEffect(() => {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        let url = `${baseUrl}/api/lessons?`;
        if (course) url += `courseId=${course}&`;
        if (unit) url += `unitId=${unit}&`;
        if (search) url += `search=${encodeURIComponent(search)}&`;
        fetch(url)
            .then((res) => res.json())
            .then((json) => setLessons(json.data || []))
            .finally(() => setLoading(false));
    }, [course, unit, search]);

    return (
        <main className="font-body max-w-full mx-auto pb-10 ">

            {/* Heading */}
            <div className="mb-10 bg-alt2 px-4 md:px-25 py-10">
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#363F36] leading-tight mb-2">
                    EXPLORE <br className="block md:hidden" /> LESSONS
                </h1>
                <div className="flex flex-col md:flex-row md:justify-between gap-4">
                    <div className="max-w-lg text-sm text-[#8E8E8E] mt-2">
                        <p className="mb-2 italic">Critical thinking. Real-world relevance. Ready-to-teach.</p>
                        <ul className="list-disc list-inside pl-2 space-y-1">
                            <li>
                                Each lesson is fully digital and delivered as an editable Google Doc, designed for immediate use in your classroom or online learning platform.
                            </li>
                            <li>
                                You can <b>purchase lessons individually</b> or as part of a unit or course bundle.
                            </li>
                            <li>
                                All lessons are part of a carefully sequenced unit.
                            </li>
                        </ul>
                    </div>
                    <div className="text-xs text-[#363F36] mt-2 max-w-sm">
                        <b>All lessons include:</b>
                        <ul className="list-disc list-inside pl-2 space-y-1 mt-1">
                            <li>
                                <b>5-7 Learning Activities per Lesson</b> — case studies, guided discussions, collaborative activities, quizzes, etc.
                            </li>
                            <li>
                                <b>Writing Practice</b> — structured paragraphs, essays, policy memos, source analysis, etc.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Search bar */}
            <LessonSearchBar search={search} setSearch={setSearch} />

            {/* --- Course Tab Horizontal --- */}
            <div className="flex items-center gap-2 border-b border-[#EFE9E9] bg-white px-4 md:px-25 pt-8 pb-2 mb-6 overflow-x-auto">
                <button
                    onClick={() => setCourse('')}
                    className={`
                        px-3 py-1 rounded border transition text-sm
                        ${!course
                            ? 'bg-button2 text-[#3E724A] font-bold border-[#3E724A]'
                            : 'bg-transparent text-[#3E724A] border-transparent hover:border-[#3E724A]'
                        }
                    `}
                    style={{ boxShadow: !course ? '0 0 0 2px #3E724A22' : undefined }}
                >
                    ALL COURSES
                </button>
                {initialCourses.map((c) => (
                    <button
                        key={c.id}
                        onClick={() => setCourse(c.id)}
                        className={`
                            px-3 py-1 rounded border transition text-sm
                            ${course === c.id
                                ? 'bg-button2 text-[#3E724A] font-bold border-[#3E724A]'
                                : 'bg-transparent text-[#3E724A] border-transparent hover:border-[#3E724A]'
                            }
                        `}
                        style={{ boxShadow: course === c.id ? '0 0 0 2px #3E724A22' : undefined }}
                    >
                        {c.title}
                    </button>
                ))}
            </div>


            <div className="grid grid-cols-1 md:grid-cols-4 px-4 md:px-25 gap-8 bg-white">
                {/* Sidebar tanpa course tab */}
                <LessonSidebar
                    initialUnits={initialUnits}
                    unit={unit}
                    setUnit={setUnit}
                    grade={grade}
                    setGrade={setGrade}
                    curriculum={curriculum}
                    setCurriculum={setCurriculum}
                    activity={activity}
                    setActivity={setActivity}
                    support={support}
                    setSupport={setSupport}
                />
                {/* Lesson Grid */}
                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    {loading ? (
                        <>
                            {[...Array(4)].map((_, idx) => (
                                <div key={idx} className="rounded-lg bg-gray-100 animate-pulse h-40" />
                            ))}
                        </>
                    ) : lessons.length === 0 ? (
                        <div className="col-span-3 text-[#888]">No lessons found.</div>
                    ) : (
                        lessons.map((l) => <LessonCard key={l.id} lesson={l} />)
                    )}
                </div>
            </div>

            <FreeLessonsSection />
            <WhyTeachersLoveSection />
        </main>
    );
}
