'use client';

import { useEffect, useState } from "react";
import LessonList, { Course, Unit } from '../components/lesson-page/LessonList';
import FreeLessonsSection from '../components/lesson-page/FreeLessonsSection';
import WhyTeachersLoveSection from '../components/lesson-page/WhyTeachersLoveSection';

export default function LessonsPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            const [cRes, uRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses`).then(r => r.json()),
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/units`).then(r => r.json()),
            ]);
            setCourses(cRes.data || []);
            setUnits(uRes.data || []);
            setLoading(false);
        };
        fetchData();
    }, []);

    return (
        <main className="font-body">
            <section>
                {/* Heading */}
                <div className="mb-10 bg-alt2 px-4 md:px-25 py-16">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-[#363F36] leading-normal tracking-wider ">
                        EXPLORE <br /> LESSONS
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
                <LessonList initialCourses={courses} initialUnits={units} loading={loading} />
            </section>

            <FreeLessonsSection />
            <WhyTeachersLoveSection />
        </main>
    );
}
