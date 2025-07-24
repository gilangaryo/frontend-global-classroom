import { Lesson } from './LessonList';
import Image from 'next/image';
export default function LessonCard({ lesson }: { lesson: Lesson }) {
    return (
        <div className="border border-[#EFE9E9] rounded-lg overflow-hidden flex flex-col bg-white shadow-sm transition hover:shadow-lg">
            <div className="relative h-50 w-full bg-[#EFE9E9]">
                <Image
                    src={lesson.imageUrl || '/dummy/sample-product.png'}
                    alt={lesson.title}
                    width={400}
                    height={500}
                    className="object-cover w-full h-full"
                />
            </div>
            <div className="p-4 flex-1 flex flex-col">
                {lesson.subunit?.title && (
                    <div className="text-xs text-[#8E8E8E] mb-1">{lesson.tag}</div>
                )}
                <h3 className="font-semibold text-[#363F36] mb-2 text-lg leading-snug">{lesson.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{lesson.description}</p>
                <div className="mt-auto flex gap-2">
                    <button className="flex-1 py-2 border border-[#363F36] rounded text-sm text-[#363F36] bg-white hover:bg-[#EFE9E9] transition focus:outline-none focus:ring-2 focus:ring-[#363F36]">
                        Preview
                    </button>
                    <button className="flex-1 py-2 bg-[#363F36] text-[#FDFDFD] rounded text-sm font-semibold hover:bg-[#4E3D34] transition focus:outline-none focus:ring-2 focus:ring-[#363F36]">
                        Buy Now ${parseFloat(lesson.price).toFixed(2)}
                    </button>
                </div>
            </div>
        </div>
    );
}
