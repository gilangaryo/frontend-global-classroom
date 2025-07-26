'use client';

import { Lesson } from './LessonList';
import Image from 'next/image';
import Link from 'next/link';
import AnimatedAddToCartButton from '../../components/AnimatedAddToCartButton';

export default function LessonCard({ lesson }: { lesson: Lesson }) {
    return (
        <div className="border border-[#EFE9E9] rounded-lg overflow-hidden flex flex-col bg-white shadow-sm transition hover:shadow-lg">
            <Link href={`/lessons/${lesson.id}`}>
                <div className="relative h-50 w-full bg-[#EFE9E9] cursor-pointer">
                    <Image
                        src={
                            lesson.imageUrl ||
                            'https://res.cloudinary.com/dla5fna8n/image/upload/v1753368278/lesson_ighmqy.jpg'
                        }
                        alt={lesson.title}
                        width={400}
                        height={500}
                        className="object-cover w-full h-full"
                    />
                </div>
            </Link>

            <div className="p-4 flex-1 flex flex-col">
                {lesson.subunit?.title && (
                    <div className="text-xs text-[#8E8E8E] mb-1">{lesson.tag}</div>
                )}

                <Link href={`/lessons/${lesson.id}`}>
                    <h3 className="font-semibold text-[#363F36] mb-2 text-lg leading-snug hover:underline cursor-pointer">
                        {lesson.title}
                    </h3>
                </Link>

                {lesson.description && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-3">{lesson.description}</p>
                )}

                <div className="mt-auto flex gap-2">
                    <div className="w-1/2">
                        <Link href={`/lessons/${lesson.id}`}>
                            <button className="w-full py-2 border border-[#363F36] rounded text-sm text-[#363F36] bg-white hover:bg-[#EFE9E9] transition focus:outline-none focus:ring-2 focus:ring-[#363F36]">
                                Preview
                            </button>
                        </Link>
                    </div>
                    <div className="w-1/2">
                        <AnimatedAddToCartButton
                            productId={lesson.id}
                            productType="LESSON"
                            itemTitle={lesson.title}
                            itemImg={lesson.imageUrl ?? '/dummy/sample-product.png'}
                            itemDesc={lesson.description ?? ''}
                            itemPrice={parseFloat(lesson.price)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
