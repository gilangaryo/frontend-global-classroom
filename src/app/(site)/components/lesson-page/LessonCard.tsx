'use client';

import { Lesson } from './LessonList';
import Image from 'next/image';
import Link from 'next/link';
import AnimatedAddToCartButton from '../../components/AnimatedAddToCartButton';
import ModalPreviewPdf from "../../components/ModalPreviewPdf";
import { useState } from "react";


export default function LessonCard({
    lesson,
    colorClass = '#3E724A',
}: {
    lesson: Lesson;
    colorClass?: string;
}) {
    const [openPreviewPdf, setOpenPreviewPdf] = useState(false);

    const pdfUrl = "https://res.cloudinary.com/dla5fna8n/image/upload/v1753374352/data_desqhr.pdf"

    return (
        <div className=" rounded-lg overflow-hidden flex flex-col bg-white  transition ">
            <Link href={`/lessons/${lesson.id}`}>
                <div className="relative h-55 w-full bg-[#EFE9E9] cursor-pointer">
                    <Image
                        src={
                            lesson.imageUrl ||
                            'https://res.cloudinary.com/dla5fna8n/image/upload/v1753368278/lesson_ighmqy.jpg'
                        }
                        alt={lesson.title}
                        width={400}
                        height={900}
                        className="object-cover w-full h-full rounded-lg"
                    />
                </div>
            </Link>

            <div className="py-4 flex-1 flex flex-col">
                {lesson.subunit?.title && (
                    <div className="text-xs text-[#8E8E8E] mb-1">{lesson.tag}</div>
                )}

                <Link href={`/lessons/${lesson.id}`}>
                    <h3 className="font-semibold text-black mb-2 text-lg leading-snug hover:underline cursor-pointer">
                        {lesson.title}
                    </h3>
                </Link>

                {lesson.description && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-3">{lesson.description}</p>
                )}

                <div className="mt-auto grid grid-cols-2 gap-4">
                    <div className="w-full h-full">

                        <button
                            onClick={() => setOpenPreviewPdf(true)}
                            className="h-full rounded-md border border-[#363F36] text-[#363F36] font-bold text-base bg-white hover:bg-primary hover:text-white transition-colors w-full"
                        >
                            Preview Unit
                        </button>

                    </div>
                    <div>

                        <AnimatedAddToCartButton
                            productId={lesson.id}
                            productType="LESSON"
                            itemTitle={lesson.title}
                            itemImg={lesson.imageUrl ?? '/dummy/sample-product.png'}
                            itemDesc={lesson.description ?? ''}
                            itemPrice={parseFloat(lesson.price)}
                            colorButton={colorClass}
                        />
                    </div>


                    <ModalPreviewPdf
                        open={openPreviewPdf}
                        onClose={() => setOpenPreviewPdf(false)}
                        pdfUrl={pdfUrl}
                        title="Preview Unit"
                    />
                </div>
            </div>
        </div>
    );
}
