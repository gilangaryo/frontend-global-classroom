import Image from 'next/image';
import Link from 'next/link';

export default function FreeLessonsSection() {
    return (
        <section className="bg-[#EFE9E9] py-20 mt-16 rounded-xl">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-4xl font-bold text-[#363F36] mb-8">FREE LESSONS</h2>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="relative h-48 w-full bg-black/10 rounded-lg overflow-hidden">
                        <Image
                            src="/dummy/sample-product.png"
                            alt="Free Lesson"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-2xl font-semibold text-[#363F36]">
                            FOUNDATION OF A GLOBAL POLITICS
                        </h3>
                        <p className="text-[#8E8E8E] text-sm">
                            Explore our free lesson to see how our interactive, inquiry-based approach works in practice.
                        </p>
                        <Link href="#" className="text-sm font-semibold text-[#363F36] underline">
                            Explore Free Lessons →
                        </Link>
                        <div className="flex gap-2">
                            <span className="block h-1 w-6 bg-[#363F36] rounded"></span>
                            <span className="block h-1 w-6 bg-[#8E8E8E] rounded"></span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
