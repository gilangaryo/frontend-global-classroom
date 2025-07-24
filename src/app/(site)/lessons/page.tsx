'use client';

import { useEffect, useState } from "react";
import LessonList, { Course, Unit } from '../components/lesson-page/LessonList';

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

    // Tetap kirim loading ke LessonList agar hanya grid lesson yang loading, bukan seluruh halaman
    return (
        <LessonList initialCourses={courses} initialUnits={units} loading={loading} />
    );
}
