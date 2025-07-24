import Image from "next/image";
import Link from "next/link";
export default function HeroSection() {
    return (
        <section className="relative h-[calc(100vh-70px)] w-full flex items-end justify-start text-white px-6 sm:px-15">
            {/* Background image */}
            <Image
                src="/hero-section.jpg"
                alt="Hero background"
                fill
                priority
                className="object-cover object-center -z-10"
            />

            {/* Text & Buttons */}
            <div className="max-w-3xl space-y-6 mb-30">
                <h1 className="text-3xl sm:text-6xl font-bold leading-relaxed mb-20">
                    GLOBAL CHALLENGES. <br />
                    LOCAL VOICES. <br />
                    SHARED LEARNING.
                </h1>



                <div className="flex gap-4 flex-wrap">
                    <Link href="#offer" className="px-6 py-3 bg-alt text-black font-semibold rounded">
                        For Teachers
                    </Link>

                    <Link href="#offer" className="px-6 py-3 border border-alt rounded text-alt">
                        Beyond the Classroom
                    </Link>
                </div>
            </div>
        </section>
    );
}
