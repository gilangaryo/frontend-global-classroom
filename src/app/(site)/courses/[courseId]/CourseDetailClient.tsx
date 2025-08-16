'use client';

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DividerWithPlus from "../../components/Divider";
import ModalPreviewPdf from "../../components/ModalPreviewPdf";
import LessonPdfThumbnailModal from "../../components/LessonPdfThumbnailModal";
import AnimatedAddToCartButton from '../../components/AnimatedAddToCartButton';
import { useFreeLessons } from '../../../../hooks/useFreeLessons';
import { Course } from '@/types/course';

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

    const { freeLessons, loading: freeLessonsLoading } = useFreeLessons(id);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${id}`);
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

    const pdfUrl = course.previewUrl;
    const imgUrl = course.imageUrl;

    const featuredFreeLesson = freeLessons?.[0];

    return (
        <main className="font-body">
            {/* Hero Section */}
            <section className="bg-white px-4 md:px-20 pt-0 pb-20">
                <h1 className="text-4xl md:text-9xl text-left font-semibold text-black mb-20 leading-tight mt-2 ">
                    {course.title}
                </h1>
                <div className="max-w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-40 items-start">
                    <div className="order-1 md:order-2 col-span-2 flex justify-center md:justify-end">
                        <div className="relative w-full aspect-[3/4] md:w-[800px] overflow-hidden shadow-md">
                            <Image
                                src={course.imageUrl}
                                alt={course.title}
                                fill
                                className="object-cover "
                                priority
                            />
                        </div>
                    </div>
                    <div className="order-2 md:order-1 flex flex-col items-start mt-6 md:mt-0">
                        <p
                            className="mb-6 text-sm md:text-[18px] text-black max-w-md leading-loose whitespace-pre-wrap"
                        >
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

            <ModalPreviewPdf
                open={openPreviewPdf}
                onClose={() => setOpenPreviewPdf(false)}
                pdfUrl={pdfUrl}
                title="Preview Unit"
            />

            {/* Units Section */}
            <section className="bg-alt2 py-40 px-4 md:px-20 " id="units">
                <div className="max-w-full mx-auto">
                    <h2 className="text-3xl md:text-6xl font-bold text-primary mb-18 text-center">
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
                                    className="overflow-hidden flex flex-col group"
                                >
                                    <div className="relative w-full h-90">
                                        <Image
                                            src={unit.imageUrl && unit.imageUrl.trim() !== '' ? unit.imageUrl : '/dummy/sample-product.png'}
                                            alt={unit.title}
                                            fill
                                            className="object-cover transition duration-300 group-hover:brightness-50 grayscale"
                                        />

                                        {/* Overlay on Hover */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-500 ">
                                            <span className="backdrop-blur-xs bg-white/30 text-white px-12 py-3 rounded-lg font-semibold shadow">
                                                See Unit
                                            </span>

                                        </div>
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

            {/* FREE RESOURCE Section */}
            <section className="py-40 px-4 md:px-20 bg-white">
                <div className="max-w-full mx-auto">
                    <h2 className="text-3xl md:text-8xl font-bold text-black mb-8">FREE RESOURCE</h2>
                    <div className="mb-4 text-primary text-lg">
                        Curious about this course? Checkout this free resource
                    </div>
                    <DividerWithPlus />

                    {freeLessonsLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <span className="ml-3 text-primary">Loading free resources...</span>
                        </div>
                    ) : featuredFreeLesson ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                            <div className="relative max-w-full aspect-video">
                                <Image
                                    src={featuredFreeLesson.imageUrl || '/dummy/sample-product.png'}
                                    alt={featuredFreeLesson.title}
                                    fill
                                    className="object-cover grayscale"
                                    onError={(e) => {
                                        e.currentTarget.src = '/dummy/sample-product.png';
                                    }}
                                />
                            </div>
                            <div className="p-6 flex flex-col justify-center text-primary">
                                <div className="font-bold text-5xl mb-4 leading-normal">
                                    <h2>{featuredFreeLesson.title}</h2>
                                </div>

                                <Link
                                    href={featuredFreeLesson.digitalUrl || featuredFreeLesson.previewUrl || '#'}
                                    target={featuredFreeLesson.digitalUrl || featuredFreeLesson.previewUrl ? '_blank' : '_self'}
                                    rel={featuredFreeLesson.digitalUrl || featuredFreeLesson.previewUrl ? 'noopener noreferrer' : ''}
                                    className="font-semibold text-base flex items-center gap-1 hover:underline"
                                    onClick={(e) => {
                                        const pdfUrl = featuredFreeLesson.digitalUrl || featuredFreeLesson.previewUrl;
                                        if (!pdfUrl) {
                                            e.preventDefault();
                                            alert('PDF not available for this lesson');
                                        }
                                    }}
                                >
                                    <p>Click Here</p>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <p>No free resources available for this course</p>
                        </div>
                    )}

                    {/* Show additional free lessons if available */}
                    {/* {freeLessons.length > 1 && (
                        <div className="mt-12">
                            <h3 className="text-2xl font-bold text-primary mb-6">More Free Resources:</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {freeLessons.slice(1, 4).map((lesson) => (
                                    <Link
                                        key={lesson.id}
                                        href={`/lessons/${lesson.id}`}
                                        className="group bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        <div className="relative w-full h-48">
                                            <Image
                                                src={lesson.imageUrl || '/dummy/sample-product.png'}
                                                alt={lesson.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-semibold text-primary group-hover:underline">
                                                {lesson.title}
                                            </h4>
                                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                                {lesson.description}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )} */}
                </div>
            </section>
        </main>
    );
}