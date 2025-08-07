'use client';

import { useEffect, useState } from 'react';
import LessonList, { Course, Unit } from '../components/lesson-page/LessonList';
import FreeLessonsSection from '../components/landing-page/FreeLessonsSection';

import WhyTeachersLoveSection from '../components/lesson-page/WhyTeachersLoveSection';

export default function LessonsPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [units, setUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const coursesRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products?type=COURSE&isActive=true`
                );
                const coursesJson = await coursesRes.json();

                const unitsRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products?type=UNIT&isActive=true`
                );
                const unitsJson = await unitsRes.json();

                setCourses(coursesJson.data || []);
                setUnits(unitsJson.data || []);
            } catch (error) {
                console.error('Failed to fetch courses or units:', error);
                setCourses([]);
                setUnits([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <main className="font-body">
            <section>
                <div className="mb-10 bg-alt2 px-4 md:px-24 pt-10 md:pt-30 pb-10 md:pb-40">

                    <h1 className="text-5xl md:text-7xl font-extrabold text-primary leading-normal tracking-wider ">
                        EXPLORE <br /> LESSONS
                    </h1>
                    <div className="flex flex-col md:flex-row md:justify-between gap-4 leading-relaxed mt-4">
                        <div className="max-w-xl text-md text-black mt-2">
                            <p className="mb-6 italic">
                                Critical thinking. Real-world relevance. Ready-to-teach.
                            </p>
                            <ul className="list-disc list-inside pl-2 space-y-4">
                                <li>
                                    Each lesson is fully digital and delivered as an editable
                                    Google Doc, designed for immediate use in your classroom or
                                    online learning platform.
                                </li>
                                <li>
                                    You can <b>purchase lessons individually</b> or as part of a
                                    unit or course bundle.
                                </li>
                                <li>All lessons are part of a carefully sequenced unit.</li>
                            </ul>
                        </div>
                        <div className=" max-w-2xl text-md text-black mt-2 ">
                            <p className="mb-4 font-semibold">All lessons include:</p>
                            <ul className="list-disc list-inside pl-2 space-y-4 mt-1">
                                <li>
                                    <b>5-7 Learning Activities per Lesson</b> including Canva
                                    presentations, source-based questions, readings, explainers,
                                    case studies, guided discussions, collaborative activities,
                                    investigations, inquiry-based tasks, videos, multimedia and
                                    Nearpod activities, graphic organizers, writing scaffolds,
                                    quizzes, role plays and podcasts
                                </li>
                                <li>
                                    <b>Writing Practice</b> including short responses,
                                    structured paragraphs, define and apply concepts, justify and
                                    evaluate claims, compare and contrast writing, essays, policy
                                    memos, source analysis and position papers
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            <LessonList
                initialCourses={courses}
                initialUnits={units}
                loading={loading}
            />
            <FreeLessonsSection />
            {/* FreeLessonsSection */}

            <WhyTeachersLoveSection />
        </main>
    );
}