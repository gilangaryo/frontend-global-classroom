import UnitDetailClient from './UnitDetailClient';

interface SimpleUnit {
    id: string;
    title: string;
}

interface Unit {
    id: string;
    title: string;
}

// Update the PageProps interface to match Next.js 15 expectations
interface PageProps {
    params: Promise<{ courseId: string; unitId: string }>;
}

async function getUnitById(unitId: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/unit/${unitId}`, {
        next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
}

async function getCourseData(courseId: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${courseId}`, {
        next: { revalidate: 60 },
    });
    if (!res.ok) return { allUnits: [], courseTitle: 'Course', colorCourse: '#3E724A' };
    const json = await res.json();
    const units = json?.data?.units || [];
    const allUnits: SimpleUnit[] = units.map((u: Unit) => ({ id: u.id, title: u.title }));
    const courseTitle = json?.data?.title || 'Course';
    const colorCourse = json?.data?.colorButton || '#3E724A';
    return { allUnits, courseTitle, colorCourse };
}

export default async function Page({ params }: PageProps) {
    // Await params before destructuring (Next.js 15 requirement)
    const { courseId, unitId } = await params;

    const [unit, courseData] = await Promise.all([
        getUnitById(unitId),
        getCourseData(courseId),
    ]);

    if (!unit) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-10 text-center">
                <p className="text-red-500 text-lg">Unit Not Found</p>
                <p className="text-gray-500 mt-2">The unit you are looking for does not exist. Please check the link or go back.</p>
            </div>
        );
    }

    return (
        <UnitDetailClient
            unit={unit}
            allUnits={courseData.allUnits}
            courseId={courseId}
            courseTitle={courseData.courseTitle}
            courseColor={courseData.colorCourse}
        />
    );
}