"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules"; // Tambah Autoplay
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/pagination";

interface FreeLesson {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  slug?: string;
}

export default function FreeLessonsSlider() {
  const [products, setProducts] = useState<FreeLesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/free-lessons`)
      .then((res) => res.json())
      .then((json) => {
        setProducts(json.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 px-4 md:px-25 bg-alt2">
      <h2 className="text-5xl md:text-7xl font-bold text-primary text-left mb-16">
        Free Lessons
      </h2>
      <div className="max-w-full mx-auto">
        {loading ? (
          <div className="text-center text-gray-500 py-20">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500 py-20">No free lessons found.</div>
        ) : (
          <Swiper
            modules={[Pagination, Autoplay]} // ← Tambahkan Autoplay di sini
            pagination={{
              clickable: true,
              renderBullet: (index, className) =>
                `<span class="${className} custom-bullet"></span>`,
            }}
            slidesPerView={1}
            className="w-full group"
            speed={1000}
            autoplay={{
              delay: 7000,
              disableOnInteraction: false,
            }}
            loop={true} // Optional: biar muter terus
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <div className="grid md:grid-cols-2 gap-10 items-center">
                  {/* Image */}
                  <div className="relative w-full aspect-[16/9] overflow-hidden">
                    <Image
                      src={product.imageUrl || "/landing-page/explore-lesson.jpg"}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {/* Content */}
                  <div>
                    <h3 className="text-3xl md:text-5xl font-bold text-primary tracking-wide mb-4">
                      {product.title}
                    </h3>
                    <p className="text-lg text-text mb-6">
                      {product.description}
                    </p>
                    <Link href={product.slug ? `/lessons/${product.slug}` : `/free-course`}>
                      Explore Free Lesson →
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
        <style jsx global>{`
          .swiper-pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 0.2rem;
            margin-top: 2rem;
            position: static;
          }
          .custom-bullet {
            display: inline-block;
            width: 20px;
            height: 3px;
            border-radius: 9999px;
            background: #bbb;
            opacity: 0.5;
            transition: background 0.2s, opacity 0.2s;
          }
          .swiper-pagination-bullet-active.custom-bullet {
            background: #346046;
            opacity: 1;
          }
        `}</style>
      </div>
    </section>
  );
}
