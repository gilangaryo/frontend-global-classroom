"use client";
import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import Divider from "../Divider";

interface Portfolio {
    id: string;
    title: string;
    description: string;
    image: string;
}

export default function FeaturedProjects() {
    const [featured, setFeatured] = useState<Portfolio[]>([]);
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);

    const [navReady, setNavReady] = useState(false);
    const [swiperKey, setSwiperKey] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/portfolios`);
                const json = await res.json();
                if (json.success) setFeatured(json.data);
            } catch (err) {
                console.error("Failed to load featured projects:", err);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        setNavReady(true);
        setSwiperKey((k) => k + 1);
    }, []);

    const getCleanDescription = (htmlString: string, maxLength: number = 120): string => {
        if (!htmlString) return '';

        const cleanText = htmlString.replace(/<[^>]*>/g, '');

        if (cleanText.length > maxLength) {
            return cleanText.substring(0, maxLength) + '...';
        }

        return cleanText;
    };

    return (
        <section className="py-8 md:py-40 px-4 md:px-20  max-w-full">
            <div className="mx-auto">
                <h2 className="text-4xl md:text-8xl font-bold text-black text-center mb-20">
                    FEATURED PROJECTS
                </h2>
                <Divider />
                <div className="max-w-5xl mx-auto relative">
                    {/* Tombol panah */}
                    <button
                        ref={prevRef}
                        className="absolute left-15 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow border border-[#D9C7BF] transition"
                        aria-label="Prev"
                        style={{ marginLeft: "-40px" }}
                    >
                        <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
                            <path d="M15 19l-7-7 7-7" stroke="#363F36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button
                        ref={nextRef}
                        className="absolute right-15 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow border border-[#D9C7BF] transition"
                        aria-label="Next"
                        style={{ marginRight: "-40px" }}
                    >
                        <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
                            <path d="M9 5l7 7-7 7" stroke="#363F36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    <Swiper
                        key={swiperKey}
                        modules={[Navigation, Autoplay]}
                        navigation={navReady ? { prevEl: prevRef.current, nextEl: nextRef.current } : undefined}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        loop={true}
                        spaceBetween={24}
                        slidesPerView={1.25}
                        centeredSlides
                        breakpoints={{
                            768: { slidesPerView: 2.5 },
                        }}
                        className="group"
                    >
                        {featured.map((item) => (
                            <SwiperSlide key={item.id}>
                                <div className="relative flex flex-col items-center">
                                    <div className="relative w-[300px] h-[390px] md:w-[340px] md:h-[440px] overflow-hidden shadow border border-[#D9C7BF] bg-[#fdfdfd] group/card cursor-pointer">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover transition-all duration-300 group-hover/card:scale-102"
                                        />

                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                                            <div className="text-center text-white transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300">
                                                <h3 className="text-xl md:text-2xl font-bold mb-3 text-white">
                                                    {item.title}
                                                </h3>
                                                <p className="text-xs md:text-sm text-gray-200 leading-relaxed">
                                                    {getCleanDescription(item.description)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}