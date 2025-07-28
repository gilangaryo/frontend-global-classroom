// File: app/courses/[courseId]/unit/[unitId]/page.tsx

import UnitDetailClient from './UnitDetailClient';


interface SimpleUnit {
    id: string;
    title: string;
}
async function getUnitById(unitId: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/units/${unitId}`, {
            next: { revalidate: 60 },
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data;
    } catch (error) {
        console.error('Error fetching unit:', error);
        return null;
    }
}


async function getCourseData(courseId: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses/${courseId}`, {
            next: { revalidate: 60 },
        });

        if (!res.ok) return { allUnits: [], courseTitle: 'Course' };

        const json = await res.json();
        const units = json?.data?.units || [];

        const allUnits: SimpleUnit[] = units.map((u: unknown) => {
            const unit = u as SimpleUnit;
            return { id: unit.id, title: unit.title };
        });

        const courseTitle = json?.data?.title || 'Course';
        return { allUnits, courseTitle };
    } catch (error) {
        console.error('Error fetching course units:', error);
        return { allUnits: [], courseTitle: 'Course' };
    }
}


// --- Page Component (Perubahan di sini) ---

export default async function Page({ params }: { params: Promise<{ courseId: string; unitId: string }> }) {
    // ✅ Tambahkan 'await' di sini
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
        />
    );
}