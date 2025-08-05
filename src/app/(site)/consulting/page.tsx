'use client';

import Image from 'next/image';
import Link from 'next/link';
import WhoWeWorkWithSection from "../components/consulting/WhoWeWorkWithSection";
import FeaturedProjects from '../components/consulting/FeaturedProjects';
export default function ConsultingPage() {
    const offerItems = [
        {
            title: 'Curriculum & Toolkit Development',
            desc: 'We design engaging, community-based learning tools that center authentic voices, real-world issues, and critical thinking—tailored to your audience and objectives.',
        },

        {
            title: 'Multimedia Storytelling',
            desc: 'Using platforms like Esri Story Maps and custom video guides, we help you turn research, narratives, and program goals into dynamic, interactive learning experiences.',
        },
        {
            title: 'Educator & Facilitator Training',
            desc: 'We lead virtual and in-person training for educators, staff, and facilitators—equipping them to confidently deliver justice-focused and story-driven educational content.',
        },
        {
            title: 'Workshop & Experiential Learning Design',
            desc: 'We design and support the delivery of participatory learning experiences, from school-based simulations to fieldwork and community-based workshops.',
        },
    ];
    return (
        <main className="font-body">
            <section className="bg-white py-4 md:py-16 px-4 md:px-25 max-w-full">
                <div className="mx-auto">
                    {/* HERO JUDUL */}
                    <h1 className="text-4xl md:text-7xl md:text-[5rem] font-bold text-[#222] leading-normal mb-16">
                        BEYOND<br />
                        THE CLASSROOM
                    </h1>

                    {/* 2 GRID BAWAHNYA */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start mb-10">
                        {/* Kiri */}
                        <div className=' max-w-sm'>
                            <h2 className="text-lg font-bold uppercase mb-3 text-black tracking-wider leading-relaxed">
                                Custom Support for Educators, NGOs, and Global Projects
                            </h2>
                            <div className=''>
                                <p className="text-black text-base mb-4 leading-relaxed">
                                    We partner with schools, NGOs, and international organizations to design transformative learning experiences that elevate community knowledge, frontline voices, and justice-centered approaches to education.
                                </p>
                                <p className="text-black text-base leading-relaxed">
                                    Whether you’re developing new curriculum, launching a student program, or building a field-based project, we help turn your bold ideas into clear, compelling, and practical learning tools.
                                </p>
                            </div>
                        </div>
                        {/* Kanan: gambar / placeholder */}
                        <div className="h-full  bg-gray-200 " />
                    </div>
                </div>
            </section>


            {/* What We Offer */}
            <section className="bg-alt2 py-4 md:py-40 px-4 md:px-25 max-w-full">
                <div className=" mx-auto ">
                    <h2 className="text-4xl md:text-7xl font-bold text-primary mb-8 py-14">WHAT WE OFFER</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {offerItems.map((item) => (
                            <div key={item.title} className='border-l-4 border-primary px-4 mb-4'>
                                <h3 className="text-lg font-semibold text-primary mb-2">{item.title}</h3>
                                <p className="text-[#8E8E8E] text-md tracking-wide leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <WhoWeWorkWithSection />


            {/* Why Work With Us */}
            <section className="py-4 md:py-70 px-4 md:px-25 bg-alt2 max-w-full">
                <div className=" mx-auto  grid md:grid-cols-3 gap-12 items-center">
                    <div className='col-span-2'>
                        <h2 className="text-4xl md:text-7xl  font-bold text-primary mb-8">
                            WHY WORK
                        </h2>
                        <h2 className="text-4xl md:text-7xl  font-bold text-primary mb-18">
                            WITH US
                        </h2>
                        <ul className="list-disc list-inside space-y-8 text-primary border-l-4 border-primary px-4 font-semibold">
                            <li>20+ years of classroom and curriculum design experience</li>
                            <li>Deep expertise in human rights, global politics, and climate justice</li>
                            <li>Focused on relevance, clarity, and impact</li>
                            <li>Committed to education that centers real voices and real issues</li>
                        </ul>
                    </div>
                    <div className="h-100 aspect-square bg-gray-100 " />
                </div>
            </section>

            {/* Featured Projects */}
            <FeaturedProjects />

            {/* Let's Collaborate */}
            <section className="py-4 md:py-70 px-4 md:px-25 bg-alt2 max-w-full">
                <div className=" mx-auto  grid md:grid-cols-2 gap-12 items-start">
                    <div>
                        <h2 className="text-4xl md:text-7xl font-bold text-black mb-4 leading-normal">LET’S COLLABORATE</h2>
                        <p className="text-[#8E8E8E] mb-2">
                            Ready to bring your project to life through story-rich, justice-centered learning?{' '}

                        </p>
                        <p className='mb-1 font-bold'>
                            <Link href="#" className="underline text-black">
                                Contact Us
                            </Link>{' '}
                            to discuss your goals and how we can help.
                        </p>
                        <p className="text-[#8E8E8E] text-sm flex items-center gap-2 mt-3">
                            <Image src="/consulting/email-icon.png" alt="Email" width={20} height={20} />
                            aglobalclass@gmail.com
                        </p>
                    </div>
                    <form className="space-y-4 bg-white/80 p-5 rounded-lg ">
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
                            className="w-full py-3 bg-primary text-[#FDFDFD] rounded-lg font-semibold"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </section>
        </main>
    );
}
