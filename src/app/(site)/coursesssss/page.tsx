'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function CoursePage() {
    return (
        <main className="font-body">
            {/* Header Section */}
            <section className="max-w-full mx-auto px-6 md:px-15 py-16 grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
                <h1 className="col-span-3 text-5xl md:text-9xl font-bold leading-none text-center mb-15">
                    FOUNDATIONS OF <br /> GLOBAL POLITICS
                </h1>

                <div className="space-y-6">
                    <p className=" max-w-70">
                        Foundations of Global Politics is a complete digital curriculum, with over 50 ready-to-go, editable lessons that explore the roles and influence of global actors (state and non-state) in shaping international governance and power dynamics on the global stage.
                        <br />
                        <br />
                        The lessons introduce students to some of the foundational concepts in Global Politics: power, sovereignty, and legitimacy through real-world case studies and critical inquiry.
                    </p>
                    <Link
                        href="#core-units"
                        className="inline-block px-6 py-3 bg-alt  font-medium rounded"
                    >
                        Explore Core Units
                    </Link>
                    <Link
                        href="#core-units"
                        className="inline-block px-6 py-3 bg-[#EFE9E9]  font-medium rounded"
                    >
                        Preview Unit
                    </Link>
                </div>

                <div className="w-full aspect-square relative col-span-2">
                    <Image src="/course/hero-course.jpg" alt="Student" fill className="object-cover rounded" />
                </div>
            </section>


            {/* Core Units Section */}
            <section id="core-units" className="bg-alt py-16 px-15 text-center">
                <h2 className="text-3xl md:text-6xl font-extrabold mb-4">EXPLORE THE FOUR CORE UNITS</h2>
                <button className="mt-4 mb-10 px-10 py-2 bg-primary text-white rounded font-medium">
                    Buy All Unit: $350
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-full mx-auto ">
                    {[
                        {
                            title: '01. POWER AND GLOBAL ORDER',
                            img: '/dummy/sample-product.png',
                        },
                        {
                            title: '02. FOREIGN POLICY IN ACTION',
                            img: '/dummy/sample-product.png',
                        },
                        {
                            title: '03. SOVEREIGNTY AND GLOBAL CHALLENGES',
                            img: '/dummy/sample-product.png',
                        },
                        {
                            title: '04. LEGITIMACY, FRAGILITY, AND STATE POWER',
                            img: '/dummy/sample-product.png',
                        },
                    ].map((unit, i) => (
                        <div key={i} className="text-left">
                            <Image src={unit.img} alt={unit.title} width={400} height={300} className="w-full object-cover mb-3" />
                            <h3 className="text-5xl font-semibold leading-tight">{unit.title}</h3>
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-20 px-6 max-w-7xl mx-auto">
                {/* Heading + description */}
                <div className="grid md:grid-cols-2 gap-8 mb-10">
                    <div>
                        <h2 className="text-4xl font-extrabold mb-4">FREE LESSON</h2>
                        <p>
                            Curious about how our courses work? This free lesson from this course
                        </p>
                    </div>
                </div>

                {/* Garis dengan + tengah */}
                <div className="relative mb-10">
                    <hr className="border-t border-gray-300 " />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-primary font-bold">
                        +
                    </div>
                </div>

                {/* Image + Description */}
                <div className="grid md:grid-cols-2 gap-10 items-end text-primary">
                    <Image
                        src="/course/foundation.jpg"
                        alt="Free Lesson"
                        width={500}
                        height={200}
                        className="rounded w-full h-auto object-cover"
                    />

                    <div className="space-y-2">
                        <h3 className="text-5xl font-bold leading-normal mb-8">
                            FOUNDATION OF A GLOBAL POLITICS
                        </h3>
                        <Link href="#" className="text-sm font-semibold underline">
                            Click Here →
                        </Link>
                    </div>
                </div>
            </section>


        </main>
    );
}
