
import Image from 'next/image';
import Link from 'next/link';

interface Course {
    id: string;
    title: string;
    slug: string;
    description: string;
    imageUrl: string;
}

const headerIncludes = [
    '4–5 thematic units',
    '25+ lessons and study guides',
    'Editable Google Docs for every lesson',
    'In-depth, recent, real-world case studies',
    'Interactive Canva presentations',
    'End-of-unit assessments (essay prompts, source analysis, or project-based tasks)',
    'Podcast summaries for select lessons, created with NotebookLM – useful for teacher prep or student review',
];

export default async function CoursePage() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses`, {
        next: { revalidate: 60 },
    });


    const json = await res.json();
    const courses: Course[] = json.data;

    return (
        <main className="font-body">
            <section className="bg-alt2 py-16 text-primary">
                <div className="px-4 md:px-25 max-w-full mx-auto ">
                    <h1 className="text-5xl md:text-7xl font-bold  mb-8 leading-normal tracking-wider">
                        EXPLORE <br /> COURSES
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 leading-relaxed">
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

            <section className="py-20 md:px-25 px-4 max-w-full mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {courses.map((c) => (
                        <div key={c.id} className="bg-card rounded-lg overflow-hidden flex flex-col ">
                            <div className="relative h-90 w-full">
                                <Image src={c.imageUrl} alt={c.title} fill className="object-cover" />
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
                                    href={`/courses/${c.id}`}
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