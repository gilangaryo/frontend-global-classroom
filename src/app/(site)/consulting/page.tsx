'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import WhoWeWorkWithSection from "../components/consulting/WhoWeWorkWithSection";
export default function ConsultingPage() {
    const offerItems = [
        {
            title: 'Curriculum & Toolkit Development',
            desc: 'We design engaging, community-based learning tools that center authentic voices, real-world issues, and critical thinking—tailored to your audience and objectives.',
        },
        {
            title: 'Educator & Facilitator Training',
            desc: 'We lead virtual and in-person training for educators, staff, and facilitators—equipping them to confidently deliver justice-focused and story-driven educational content.',
        },
        {
            title: 'Multimedia Storytelling',
            desc: 'Using platforms like Esri Story Maps and custom video guides, we help you turn research, narratives, and program goals into dynamic, interactive learning experiences.',
        },
        {
            title: 'Workshop & Experiential Learning Design',
            desc: 'We design and support the delivery of participatory learning experiences, from school-based simulations to fieldwork and community-based workshops.',
        },
    ];

    const featured = [
        { id: 'ukraine', title: 'War Crimes in Ukraine', image: '/dummy/sample-product.png' },
        { id: 'refugees', title: 'Refugee Journeys', image: '/dummy/sample-product.png' },
        { id: 'climate', title: 'Climate Justice Stories', image: '/dummy/sample-product.png' },
    ];

    return (
        <main className="font-body">
            <section className="bg-white py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* HERO JUDUL */}
                    <h1 className="text-[2.8rem] md:text-[5rem] font-bold text-[#222] leading-[1.1] mb-8">
                        BEYOND<br />
                        THE CLASSROOM
                    </h1>

                    {/* 2 GRID BAWAHNYA */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                        {/* Kiri */}
                        <div>
                            <h2 className="text-base font-bold uppercase mb-3 text-[#222] tracking-wider">
                                Custom Support for Educators, NGOs, and Global Projects
                            </h2>
                            <p className="text-[#444] text-base mb-4">
                                We partner with schools, NGOs, and international organizations to design transformative learning experiences that elevate community knowledge, frontline voices, and justice-centered approaches to education.
                            </p>
                            <p className="text-[#444] text-base">
                                Whether you’re developing new curriculum, launching a student program, or building a field-based project, we help turn your bold ideas into clear, compelling, and practical learning tools.
                            </p>
                        </div>
                        {/* Kanan: gambar / placeholder */}
                        <div className="w-full aspect-video bg-gray-200 " />
                    </div>
                </div>
            </section>


            {/* What We Offer */}
            <section className="bg-alt2 py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-7xl font-bold text-primary mb-8">WHAT WE OFFER</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {offerItems.map((item) => (
                            <div key={item.title} className='border-l-4 border-primary px-4'>
                                <h3 className="text-lg font-semibold text-[#4E3D34] mb-2">{item.title}</h3>
                                <p className="text-[#8E8E8E] text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <WhoWeWorkWithSection />


            {/* Why Work With Us */}
            <section className="py-16 bg-[#FDFDFD]">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 items-center">
                    <div className='col-span-2'>
                        <h2 className="text-7xl font-bold text-[#363F36] mb-6">WHY WORK WITH US?</h2>
                        <ul className="list-disc list-inside space-y-2 text-[#8E8E8E] border-l-4 border-primary px-4">
                            <li>20+ years of classroom and curriculum design experience</li>
                            <li>Deep expertise in human rights, global politics, and climate justice</li>
                            <li>Focused on relevance, clarity, and impact</li>
                            <li>Committed to education that centers real voices and real issues</li>
                        </ul>
                    </div>
                    <div className="h-100 aspect-square bg-gray-200 " />
                </div>
            </section>

            {/* Featured Projects */}
            <section className="py-16 bg-white ">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl font-bold text-[#363F36] text-center mb-8">FEATURED PROJECTS</h2>
                    <div className="relative">
                        <div className="flex items-center gap-6 overflow-x-auto snap-x pb-4">
                            {featured.map((f) => (
                                <div
                                    key={f.id}
                                    className="snap-start flex-shrink-0 w-80 bg-[#FDFDFD] border border-[#D9C7BF] rounded-lg overflow-hidden"
                                >
                                    <div className="relative h-48 w-full">
                                        <Image src={f.image} alt={f.title} fill className="object-cover" />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-[#363F36] mb-2">{f.title}</h3>
                                        <p className="text-[#8E8E8E] text-sm">
                                            Examine war crimes and crimes against humanity in the Russia-Ukraine conflict.
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 p-2 rounded-full shadow">
                            <ChevronLeft size={20} className="text-[#363F36]" />
                        </button>
                        <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 p-2 rounded-full shadow">
                            <ChevronRight size={20} className="text-[#363F36]" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Let's Collaborate */}
            <section className=" py-16 bg-alt2">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-start">
                    <div>
                        <h2 className="text-4xl font-bold text-black mb-4">LET’S COLLABORATE</h2>
                        <p className="text-[#8E8E8E] mb-2">
                            Ready to bring your project to life through story-rich, justice-centered learning?{' '}

                        </p>
                        <p className='mb-1 font-bold'>
                            <Link href="#" className="underline text-black">
                                Contact Us
                            </Link>{' '}
                            to discuss your goals and how we can help.
                        </p>
                        <p className="text-[#8E8E8E] text-sm flex items-center gap-2">
                            <span>📧</span> aglobalclass@gmail.com
                        </p>
                    </div>
                    <form className="space-y-4 bg-white  p-5 rounded-lg ">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                placeholder="First Name"
                                className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg "
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                className="w-1/2 px-4 py-2 border border-gray-300  rounded-lg "
                            />
                        </div>
                        <input
                            type="email"
                            placeholder="E-mail*"
                            className="w-full px-4 py-2 border border-gray-300  rounded-lg "
                        />
                        <textarea
                            placeholder="Message*"
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300  rounded-lg "
                        />
                        <button
                            type="submit"
                            className="w-full py-3 bg-[#363F36] text-[#FDFDFD] rounded-lg font-semibold"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
}
