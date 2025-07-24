import LessonList from '../components/lesson-page/LessonList';

async function getCourses() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch courses');
    const json = await res.json();
    return json.data || [];
}

async function getUnits() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/units`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch units');
    const json = await res.json();
    return json.data || [];
}

export default async function LessonsPage() {
    // Fetch data server-side (SSR)
    const initialCourses = await getCourses();
    const initialUnits = await getUnits();

    return <LessonList initialCourses={initialCourses} initialUnits={initialUnits} />;
}
