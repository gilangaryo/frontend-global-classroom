'use client';

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import DividerWithPlus from "../../components/Divider";
import { useState } from "react";
import ModalPreviewPdf from "../../components/ModalPreviewPdf";
import LessonPdfThumbnailModal from "../../components/LessonPdfThumbnailModal";

const courses = [
    {
        id: 'foundations',
        slug: 'foundations-of-global-politics',
        title: 'Foundations of Global Politics',
        description: 'Foundations of Global Politics is a complete digital curriculum, with over 50 ready-to-go, editable lessons that explore the roles and influence of global actors (state and non-state) in shaping international governance and power dynamics on the global stage. The lessons introduce students to some of the foundational concepts in Global Politics: power, sovereignty, and legitimacy through real- world case studies and critical inquiry.',
        heroImage: 'https://res.cloudinary.com/dla5fna8n/image/upload/v1753368277/course_u3alrf.jpg',
        units: [
            {
                id: 1,
                image: 'https://res.cloudinary.com/dla5fna8n/image/upload/v1753368090/unit-1_sedafz.jpg',
                title: '01. Power and Global Order',
            },
            {
                id: 2,
                image: 'https://res.cloudinary.com/dla5fna8n/image/upload/v1753368090/unit-2_u6bzl0.jpg',
                title: '02. Foreign Policy in Action',
            },
            {
                id: 3,
                image: 'https://res.cloudinary.com/dla5fna8n/image/upload/v1753368090/unit-3_opgxcm.jpg',
                title: '03. Sovereignty and Global Challenges',
            },
            {
                id: 4,
                image: 'https://res.cloudinary.com/dla5fna8n/image/upload/v1753368090/unit-4_e78jvh.jpg',
                title: '04. Legitimacy, Fragility, and State Power',
            },
        ],
        freeResources: [
            {
                image: 'https://res.cloudinary.com/dla5fna8n/image/upload/v1753370638/free-resources_znpcwj.jpg',
                title: 'Foundation of a Global Politics',
                link: '#',
            },
        ],
    },
];

export default function CourseDetailPage() {
    const params = useParams();
    // State untuk modal
    const [openPreviewPdf, setOpenPreviewPdf] = useState(false);
    const [openThumbnail, setOpenThumbnail] = useState(false);

    const slug = typeof params.slug === "string" ? params.slug : Array.isArray(params.slug) ? params.slug[0] : "";
    const course = courses.find(c => c.slug === slug);
    if (!course) return notFound();

    const pdfUrl = "https://res.cloudinary.com/dla5fna8n/image/upload/v1753374352/data_desqhr.pdf";
    const imgUrl = "/dummy/sample-product.png";
    return (
        <main className="font-body">
            {/* Hero Section */}
            <section className="bg-white px-4 md:px-25 pt-0 pb-20">
                <h1 className="text-4xl md:text-7xl text-center font-extrabold text-[#363F36] mb-12 leading-tight mt-6 md:mt-12">
                    {course.title}
                </h1>
                <div className="
          max-w-full mx-auto 
          grid grid-cols-1 md:grid-cols-3 
          gap-10 md:gap-20
          items-start
        ">
                    {/* IMAGE: mobile order first, desktop order last */}
                    <div className="order-1 md:order-2 col-span-2 flex justify-center md:justify-end">
                        <div className="relative w-[320px] md:w-[800px] aspect-[5/6] overflow-hidden shadow-md">
                            <Image
                                src={course.heroImage}
                                alt={course.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                    {/* CONTENT */}
                    <div className="order-2 md:order-1 flex flex-col items-start mt-6 md:mt-0">
                        <p className="mb-6 text-sm md:text-lg text-[#363F36] max-w-md leading-relaxed">
                            {course.description}
                        </p>
                        <div className="flex flex-col gap-3 w-full md:flex-row md:gap-4">
                            <button
                                className="px-6 py-3 rounded-lg bg-alt text-primary font-bold text-base shadow hover:bg-primary hover:text-white transition-colors w-full md:w-auto"
                                onClick={() => setOpenThumbnail(true)}
                            >
                                Preview Lesson Overview
                            </button>
                            <button
                                onClick={() => setOpenPreviewPdf(true)}
                                className="px-6 py-3 rounded-lg border border-[#363F36] text-[#363F36] font-bold text-base bg-white hover:bg-primary hover:text-white transition-colors w-full md:w-auto"
                            >
                                Preview Full PDF
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal Thumbnail */}
            <LessonPdfThumbnailModal
                open={openThumbnail}
                onClose={() => setOpenThumbnail(false)}
                imgUrl={imgUrl}
                onPreviewPdf={() => { setOpenThumbnail(false); setOpenPreviewPdf(true); }}
            />

            {/* Modal PDF */}
            <ModalPreviewPdf
                open={openPreviewPdf}
                onClose={() => setOpenPreviewPdf(false)}
                pdfUrl={pdfUrl}
                title="Preview Unit"
            />

            {/* Units Section */}
            <section className="bg-alt2 py-16 px-4 md:px-25">
                <div className="max-w-full mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 text-center ">
                        EXPLORE THE FOUR CORE UNITS
                    </h2>
                    <div className="text-center mb-6">
                        <button className="px-12 py-3 bg-primary text-white rounded-lg text-md">
                            Buy All Unit $250
                        </button>
                    </div>
                    <DividerWithPlus />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-15">
                        {course.units.map((unit) => (
                            <div key={unit.id} className="overflow-hidden flex flex-col">
                                <div className="relative w-full h-90">
                                    <Image src={unit.image} alt={unit.title} fill className="object-cover" />
                                </div>
                                <div className="mt-6 text-primary font-bold text-4xl">
                                    <h2>
                                        {unit.title}
                                    </h2>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Free Resources Section */}
            <section className="py-20 px-4 md:px-25 bg-white">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-7xl font-bold text-[#363F36] mb-8">FREE RESOURCE</h2>
                    <div className="mb-4 text-[#363F36] text-lg">
                        Curious about this course? Checkout this free resource
                    </div>
                    <DividerWithPlus />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="relative max-w-full aspect-video">
                            <Image src={course.freeResources[0].image} alt={course.freeResources[0].title} fill className="object-cover" />
                        </div>
                        <div className="p-6 flex flex-col justify-center">
                            <div className="font-bold text-[#363F36] text-4xl mb-4 leading-normal">
                                <h2>
                                    {course.freeResources[0].title}
                                </h2>
                            </div>
                            <Link href={course.freeResources[0].link} className="text-[#346046] font-medium text-base flex items-center gap-1 hover:underline">
                                Click Here →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
