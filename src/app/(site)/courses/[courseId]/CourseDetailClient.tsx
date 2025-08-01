'use client';

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DividerWithPlus from "../../components/Divider";
import ModalPreviewPdf from "../../components/ModalPreviewPdf";
import LessonPdfThumbnailModal from "../../components/LessonPdfThumbnailModal";
import AnimatedAddToCartButton from '../../components/AnimatedAddToCartButton';

interface Unit {
    id: string;
    title: string;
    slug: string;
    previewUrl: string | null;
    digitalUrl: string | null;
    description: string;
    price: string;
    imageUrl: string | null;
    isActive: boolean;
    courseId: string;
    createdAt: string;
    updatedAt: string;
}

interface Course {
    id: string;
    slug: string;
    title: string;
    description: string;
    price: string;
    imageUrl: string;
    previewUrl: string;
    digitalUrl: string;
    colorButton: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    units: Unit[];
    freeResources?: {
        image: string;
        title: string;
        link: string;
    }[];
}

export default function CourseDetailClient() {
    const params = useParams();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openPreviewPdf, setOpenPreviewPdf] = useState(false);
    const [openThumbnail, setOpenThumbnail] = useState(false);


    const id = typeof params.courseId === "string"
        ? params.courseId
        : Array.isArray(params.courseId)
            ? params.courseId[0]
            : "";

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses/${id}`);
                const json = await res.json();
                setCourse(json.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load course.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCourse();
        }
    }, [id]);

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (error || !course) return notFound();

    const pdfUrl = "https://res.cloudinary.com/dla5fna8n/image/upload/v1753374352/data_desqhr.pdf";
    const imgUrl = "/dummy/sample-product.png";

    return (
        <main className="font-body">
            {/* Hero Section */}
            <section className="bg-white px-4 md:px-20 pt-0 pb-20">
                <h1 className="text-4xl md:text-9xl text-left font-semibold text-black mb-20 leading-tight mt-6 md:mt-12">
                    {course.title}
                </h1>
                <div className="max-w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-40 items-start">
                    <div className="order-1 md:order-2 col-span-2 flex justify-center md:justify-end">
                        <div className="relative w-[320px] md:w-[800px] aspect-[5/6] overflow-hidden shadow-md">
                            <Image
                                src={course.imageUrl}
                                alt={course.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                    <div className="order-2 md:order-1 flex flex-col items-start mt-6 md:mt-0">
                        <p className="mb-6 text-sm md:text-[18px] text-black max-w-md leading-loose ">
                            {course.description}
                        </p>
                        <div className="flex flex-col gap-3 w-full md:flex-col md:gap-4">
                            <button
                                onClick={() => {
                                    const section = document.getElementById("units");
                                    if (section) {
                                        section.scrollIntoView({ behavior: "smooth" });
                                    }
                                }}
                                className="px-6 py-3 rounded-lg bg-alt text-primary font-bold text-base shadow hover:bg-primary hover:text-white transition-colors w-full md:w-50"
                            >
                                Explore Core Units
                            </button>

                            <button
                                onClick={() => setOpenPreviewPdf(true)}
                                className="px-6 py-3 rounded-lg border border-[#363F36] text-[#363F36] font-bold text-base bg-white hover:bg-primary hover:text-white transition-colors w-full md:w-50"
                            >
                                Preview Unit
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
                onPreviewPdf={() => {
                    setOpenThumbnail(false);
                    setOpenPreviewPdf(true);
                }}
            />

            {/* Modal PDF */}
            <ModalPreviewPdf
                open={openPreviewPdf}
                onClose={() => setOpenPreviewPdf(false)}
                pdfUrl={pdfUrl}
                title="Preview Unit"
            />

            {/* Units Section */}
            <section className="bg-alt2 py-40 px-4 md:px-20 " id="units">
                <div className="max-w-full mx-auto">
                    <h2 className="text-3xl md:text-6xl font-bold text-primary mb-16 text-center">
                        EXPLORE THE CORE UNITS
                    </h2>
                    <div className=" text-center mb-6  md:w-1/6 mx-auto text-lg text-black">
                        <AnimatedAddToCartButton
                            productId={course.id}
                            productType="COURSE"
                            itemTitle={course.title}
                            itemImg={course.imageUrl}
                            itemDesc={course.units?.[0]?.title || ''}
                            itemPrice={parseFloat(course.price)}
                            size="course"
                            buttonText="Buy All Units"
                            colorButton={course.colorButton}
                        />
                    </div>

                    <DividerWithPlus />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-15">
                        {course.units.map((unit, index) => {
                            const unitNumber = String(index + 1).padStart(2, '0');
                            return (
                                <Link
                                    key={unit.id}
                                    href={`/courses/${course.id}/unit/${unit.id}`}
                                    className="overflow-hidden flex flex-col"
                                >
                                    <div className="relative w-full h-90">
                                        <Image
                                            src={unit.imageUrl ?? '/dummy/sample-unit.jpg'}
                                            alt={unit.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="mt-6 text-primary font-bold text-4xl">
                                        <h2>{unitNumber}. {unit.title}</h2>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="py-40 px-4 md:px-20 bg-white">
                <div className="max-w-full mx-auto">
                    <h2 className="text-3xl md:text-7xl font-bold text-[#363F36] mb-8">FREE RESOURCE</h2>
                    <div className="mb-4 text-primary text-lg">
                        Curious about this course? Checkout this free resource
                    </div>
                    <DividerWithPlus />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8  items-end ">
                        <div className="relative max-w-full aspect-video ">
                            <Image
                                src={course.freeResources?.[0]?.image ?? '/dummy/sample-product.png'}
                                alt={course.freeResources?.[0]?.title ?? 'Free Resource'}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="p-6 flex flex-col justify-center text-primary">
                            <div className="font-bold  text-4xl mb-4 leading-normal">
                                <h2>{course.freeResources?.[0]?.title ?? 'foundation of a Global Politics'}</h2>
                            </div>
                            <Link
                                href={course.freeResources?.[0]?.link ?? '#'}
                                className=" font-semibold text-base flex items-center gap-1 hover:underline "
                            >
                                <p >
                                    Click Here
                                </p>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
