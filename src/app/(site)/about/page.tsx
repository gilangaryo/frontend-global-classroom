'use client';

import Image from 'next/image';

export default function AboutPage() {
    return (
        <main className="font-body">
            {/* About Intro */}
            <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Text */}
                <div className="space-y-6">
                    <h1 className="text-5xl md:text-7xl font-bold text-[#363F36]">
                        ABOUT A GLOBAL<br />CLASSROOM
                    </h1>
                    <h2 className="text-[#4E3D34] font-semibold uppercase">
                        Rooted in justice. Guided by story. Grounded in practice.
                    </h2>
                    <p className="text-[#8E8E8E]">
                        A Global Classroom creates interdisciplinary, justice-centered curriculum for high school
                        Social Studies and Humanities classrooms and university-level courses. Grounded in rigorous,
                        interactive pedagogy, our lessons use source-based inquiry, perspective-taking, and scaffolded
                        writing tasks to challenge students to rethink familiar narratives, write with clarity,
                        and engage meaningfully with real-world case studies.
                    </p>
                    <p className="text-[#8E8E8E]">
                        Unlike many platforms that offer generic or trend-driven materials, all of our resources are
                        thoughtfully designed by experienced Social Studies educators. They are grounded in substance
                        and clarity, and built to meet the demands of the curriculum and the realities of today’s classrooms.
                    </p>
                    <blockquote className="border-l-4 border-[#4E3D34] pl-4 italic text-[#363F36]">
                        Our materials are especially useful for teachers and students of IB Global Politics, AP
                        Social Studies courses, and introductory university-level classes exploring global issues,
                        human rights, development, and international relations.
                    </blockquote>
                    <p className="text-[#8E8E8E]">
                        In addition to curriculum development, A Global Classroom partners with schools, NGOs, and
                        international organizations to design and facilitate field-based learning programs that
                        connect students and educators directly with frontline communities engaged in human rights
                        and climate justice work.
                    </p>
                </div>

                {/* Image */}
                <div className="relative h-64 md:h-96 bg-[#EFE9E9] rounded-lg overflow-hidden">
                    <Image
                        src="/about/hero.jpg"
                        alt="Classroom discussion"
                        fill
                        className="object-cover"
                    />
                </div>
            </section>

            {/* Meet the Team */}
            <section className="bg-[#EFE9E9] py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-7xl font-bold text-[#363F36] mb-12">MEET THE TEAM</h2>

                    {/* Abby */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start mb-16">
                        <div className="flex flex-col items-start">
                            <div className="relative w-full h-150 overflow-hidden mb-2">
                                <Image
                                    src="/about/abby.jpg"
                                    alt="Abby MacPhail"
                                    fill
                                    className="object-cover "
                                />
                            </div>
                            <h3 className="text-3xl font-bold text-[#363F36] w-full text-left ">ABBY MACPHAIL</h3>
                        </div>
                        <div className="space-y-4 text-[#8E8E8E] text-base leading-relaxed">
                            <p>
                                Abby MacPhail is an educator, curriculum designer, and founder of A Global Classroom.
                                She specializes in Social Studies, Global Politics, Peace and Conflict, Development and
                                Human Rights education.
                            </p>
                            <p>
                                She has over 20 years of teaching experience in Canada, the United States, Italy,
                                Croatia, France, South Africa and Kenya. She is currently in Indonesia, where she is
                                collaborating with local environmentalists, activists and artists to co-develop curriculum
                                that centers climate justice, indigenous knowledge, and community-based climate adaptation
                                strategies.
                            </p>
                            <p>
                                Abby holds a Master of Education with Distinction from the University of Cape Town, a
                                Master of Arts in Conflict Transformation from SIT Graduate Institute, a Bachelor of
                                Education from the Ontario Institute for Studies in Education at the University of Toronto,
                                and a Bachelor of Arts with Honors in French from Dalhousie University.
                            </p>
                        </div>
                    </div>

                    {/* Separator */}
                    <div className="relative mb-16">
                        <hr className="border-[#B9B7B7]" />
                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#EFE9E9] text-[#8E8E8E] text-3xl px-4 font-bold select-none">
                            +
                        </span>
                    </div>

                    {/* Naila */}
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-10 items-center">
                        {/* Deskripsi kiri */}
                        <div className="flex flex-col justify-center">
                            <div className="space-y-4 text-[#363F36] text-base leading-relaxed">
                                <p>
                                    Naila Madina is a communications strategist and sustainability advocate based in Indonesia.
                                    With a background in communications and a passion for environmental and cultural preservation,
                                    she brings a unique perspective to educational content development.
                                </p>
                                <p>
                                    Naila has worked with organizations promoting Indonesia’s natural heritage and traditional
                                    knowledge that highlight grassroots sustainability efforts.
                                </p>
                                <p>
                                    Her expertise in digital storytelling, community engagement, and cross-cultural communication
                                    enhances A Global Classroom’s mission to provide globally relevant and culturally grounded
                                    educational resources. She plays a key role in shaping the project’s brand, voice, outreach
                                    strategy, and local collaborations in Indonesia.
                                </p>
                            </div>
                        </div>
                        {/* Foto & nama kanan */}
                        <div className="flex flex-col items-center ">
                            <div className="relative w-full h-70 ">
                                <Image
                                    src="/about/naila.jpg"
                                    alt="Naila Madina"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h3 className="text-2xl font-bold text-[#363F36] w-full text-left mt-4">NAILA MADINA</h3>
                        </div>
                    </div>

                </div>
            </section>
        </main>
    );
}
