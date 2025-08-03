"use client";
import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules"; // ← tambahkan Autoplay di sini
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";

const featuredDummy = [
    {
        id: "1",
        image: "/consulting/featured-project.jpg",
        title: "WAR CRIMES IN UKRAINE",
        description: "Examine war crimes and crimes against humanity in the Russia-Ukraine conflict. Lesson includes a Canva presentation explaining the four categories of atrocity crimes.",
    },
    {
        id: "2",
        image: "/consulting/featured-project.jpg",
        title: "PEACE BUILDING",
        description: "Explore strategies of peace-building in conflict areas.",
    },
    {
        id: "3",
        image: "/consulting/featured-project.jpg",
        title: "MODERN GLOBAL MOVEMENTS",
        description: "Discover how global activism is changing the world.",
    },
    {
        id: "4",
        image: "/consulting/featured-project.jpg",
        title: "MODERN GLOBAL MOVEMENTS",
        description: "Discover how global activism is changing the world.",
    },
    {
        id: "5",
        image: "/consulting/featured-project.jpg",
        title: "MODERN GLOBAL MOVEMENTS",
        description: "Discover how global activism is changing the world.",
    },
];

export default function FeaturedProjects() {
    const [featured] = useState(featuredDummy);
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);

    // Untuk re-mount Swiper setelah ref tombol ready
    const [navReady, setNavReady] = useState(false);
    const [swiperKey, setSwiperKey] = useState(0);

    useEffect(() => {
        setNavReady(true);
        setSwiperKey((k) => k + 1); // force re-render agar ref tidak undefined
    }, []);

    return (
        <section className="py-8 md:py-32 px-4 md:px-20 bg-white max-w-full">
            <div className="mx-auto">
                <h2 className="text-4xl md:text-7xl font-bold text-black text-center mb-20">
                    FEATURED PROJECTS
                </h2>
                <div className="max-w-5xl mx-auto relative">
                    {/* Tombol panah di luar Swiper (absolute) */}
                    <button
                        ref={prevRef}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#fdfdfd] bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow border border-[#D9C7BF] group-hover:scale-110 transition"
                        aria-label="Prev"
                        style={{ marginLeft: "-40px" }}
                    >
                        <svg width="26" height="26" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="#363F36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    <button
                        ref={nextRef}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#fdfdfd] bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow border border-[#D9C7BF] group-hover:scale-110 transition"
                        aria-label="Next"
                        style={{ marginRight: "-40px" }}
                    >
                        <svg width="26" height="26" fill="none" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="#363F36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>
                    {/* Swiper harus diberi key agar re-mount ketika tombol sudah ready */}
                    <Swiper
                        key={swiperKey}
                        modules={[Navigation, Autoplay]}
                        navigation={
                            navReady
                                ? { prevEl: prevRef.current, nextEl: nextRef.current }
                                : undefined
                        }
                        autoplay={{
                            delay: 3000, // 3 detik
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
                        {featured.map((f) => (
                            <SwiperSlide key={f.id}>
                                <div className="relative flex flex-col items-center">
                                    <div className="relative w-[300px] h-[390px] md:w-[340px] md:h-[440px] overflow-hidden shadow border border-[#D9C7BF] bg-[#fdfdfd]">
                                        <Image src={f.image} alt={f.title} fill className="object-cover" />
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
