const teacherLove = {
    left: [
        {
            title: 'Educator Expertise',
            desc: 'Designed by experienced Social Studies and IB Global Politics educators',
        },
        {
            title: 'Fully Developed and Classroom-Ready',
            desc: 'No gaps to fill—every lesson includes the materials, structure, and guidance you need for high-impact teaching.',
        },
        {
            title: 'Timely and Relevant',
            desc: 'Updated regularly with current data, global trends, and accessible, student-friendly analysis.',
        },
        {
            title: 'Real-World Case Studies',
            desc: 'Students engage with timely, complex global issues—not hypotheticals—to apply what they learn.',
        },
        {
            title: 'Scaffolded Learning',
            desc: 'Lessons build progressively—from foundational concepts to critical thinking, analysis, and writing.',
        },
    ],
    right: [
        {
            title: 'Interactive Technology',
            desc: 'Canva slide decks and Nearpods support dynamic instruction and diverse learning styles.',
        },
        {
            title: 'Standards-Aligned',
            desc: 'All lessons are aligned with IB Global Politics and Common Core standards for seamless integration.',
        },
        {
            title: 'Interactive and Flexible',
            desc: 'Includes role plays, discussions, multimedia, and source analysis—easily adapted to your teaching style and students’ needs.',
        },
        {
            title: 'Writing-Focused',
            desc: 'Lessons provide regular practice with defining concepts, evaluating claims, comparing sources, and writing essays, memos, and reflections.',
        },
        {
            title: 'Authentic Sources',
            desc: 'Engage students with real-world materials: readings, interviews, maps, podcasts, infographics, videos, and more.',
        },
    ],
};

export default function WhyTeachersLoveSection() {
    return (
        <section className="py-20 px-6 max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-[#363F36] mb-8 text-center">
                WHY TEACHERS LOVE OUR MATERIALS
            </h2>
            <div className="relative mb-12">
                <hr className="border-gray-200" />
                <div className="absolute left-1/2 top-1/2 bg-[#D9C7BF] text-[#363F36] px-2 font-bold -translate-x-1/2 -translate-y-1/2">
                    +
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
                <ul className="space-y-6">
                    {teacherLove.left.map((item) => (
                        <li key={item.title}>
                            <h3 className="font-semibold text-[#4E3D34]">{item.title}</h3>
                            <p className="text-[#8E8E8E] text-sm">{item.desc}</p>
                        </li>
                    ))}
                </ul>
                <ul className="space-y-6">
                    {teacherLove.right.map((item) => (
                        <li key={item.title}>
                            <h3 className="font-semibold text-[#4E3D34]">{item.title}</h3>
                            <p className="text-[#8E8E8E] text-sm">{item.desc}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
