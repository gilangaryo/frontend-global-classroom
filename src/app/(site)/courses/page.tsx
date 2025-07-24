'use client';

import Image from 'next/image';
import Link from 'next/link';

interface Course {
    id: string;
    title: string;
    slug: string;
    description: string;
    image: string;
}

const courses: Course[] = [
    {
        id: 'foundations',
        slug: 'foundations-of-global-politics',
        title: 'Foundations of Global Politics',
        description:
            'This course introduces students to core concepts, actors, and power dynamics that shape global governance and international relations today.',
        image: '/dummy/sample-product.png',
    },
    {
        id: 'theories',
        slug: 'theories-of-global-politics',
        title: 'Theories of International Relations',
        description:
            'Students explore major theories of international relations (Realism, Liberalism, Neo-Marxism, and Feminism) through contemporary case studies and critical perspectives on global order.',
        image: '/dummy/sample-product.png',
    },
    {
        id: 'human-rights',
        slug: 'human-rights',
        title: 'Human Rights',
        description:
            'Students investigate the international human rights system, key treaties, and the tension between ideals and enforcement across a range of global issues and case studies.',
        image: '/dummy/sample-product.png',
    },
    {
        id: 'atrocity-crimes',
        slug: 'atrocity-crimes-and-international-justice',
        title: 'Atrocity Crimes and International Justice',
        description:
            'This course explores the causes, consequences, and legal responses to atrocity crimes through case studies and debates on justice and accountability.',
        image: '/dummy/sample-product.png',
    },
    {
        id: 'peace-conflict',
        slug: 'peace-and-conflict',
        title: 'Peace and Conflict',
        description:
            'Explore the principles and practices of peacebuilding, conflict resolution, and advocating for human rights globally.',
        image: '/dummy/sample-product.png',
    },
    {
        id: 'development-disparities',
        slug: 'development-and-global-disparities',
        title: 'Development and Global Disparities',
        description:
            'Analyze development theory, global inequalities, and strategies for addressing poverty, health, and education in a rapidly changing world.',
        image: '/dummy/sample-product.png',
    },
];

const headerIncludes = [
    '4–5 thematic units',
    '25+ lessons and study guides',
    'Editable Google Docs for every lesson',
    'In-depth, recent, real-world case studies',
    'Interactive Canva presentations',
    'End-of-unit assessments (essay prompts, source analysis, or project-based tasks)',
    'Podcast summaries for select lessons, created with NotebookLM – useful for teacher prep or student review',
];


export default function CoursePage() {
    return (
        <main className="font-body">
            {/* Header */}
            <section className="bg-alt2 py-16 text-primary">
                <div className="px-4 md:px-25 max-w-full mx-auto ">
                    <h1 className="text-5xl md:text-7xl font-bold  mb-8 leading-normal tracking-wider">
                        EXPLORE <br /> COURSES
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 leading-relaxed">
                        {/* Left text */}
                        <div className="space-y-4 ">
                            <p>
                                Each course is <strong>fully digital</strong> and includes a complete set of
                                sequential, editable Google Doc lessons designed to guide your teaching from start to
                                finish.
                            </p>
                            <p>
                                Courses follow a <strong>cohesive structure</strong>, with 4–5 thematic units and
                                25+ lessons that scaffold learning to build students’ analytical thinking,
                                conceptual understanding, and clear, effective writing.
                            </p>
                            <p>
                                All units are anchored real-world case studies—detailed, recent, and relevant—that
                                invite students to apply key concepts and theories to authentic global challenges.
                            </p>
                        </div>

                        {/* Right bullets */}
                        <div>
                            <h3 className="mb-4  ">All courses include:</h3>
                            <ul className="list-disc list-inside space-y-2  text-sm">
                                {headerIncludes.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Courses grid */}
            <section className="py-20 md:px-25 px-4 max-w-full mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {courses.map((c) => (
                        <div
                            key={c.slug}
                            className="bg-card rounded-lg overflow-hidden flex flex-col "
                        >
                            <div className="relative h-90 w-full">
                                <Image src={c.image} alt={c.title} fill className="object-cover" />
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="text-4xl font-semibold text-[#363F36] mb-2">{c.title}</h3>
                                <p className="text-[#8E8E8E] text-sm mb-4 flex-1">{c.description}</p>

                                <div className="mb-6">
                                    <p className="font-medium text-[#4E3D34] mb-2">This course includes:</p>
                                    <ul className="list-disc list-inside space-y-1 text-[#8E8E8E] text-sm">
                                        <li>4–5 thematic units</li>
                                        <li>25+ lessons and study guides</li>
                                        <li>Editable Google Docs for every lesson</li>
                                        <li>In-depth, recent, real-world case studies</li>
                                    </ul>
                                </div>

                                <Link
                                    href={`/courses/${c.slug}`}
                                    className="mt-auto block text-center py-2 bg-alt text-[#363F36] font-semibold rounded"
                                >
                                    Explore Course
                                </Link>

                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
