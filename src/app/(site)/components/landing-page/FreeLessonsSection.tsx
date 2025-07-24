import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";

const products = [
  {
    id: 1,
    image: "/landing-page/explore-lesson.jpg",
    title: "Atrocity Crimes and International Justice",
    description: "Torem ipsum dolor sit amet, consectetur adipiscing elit. Torem ipsum dolor sit amet. consectetur adipiscing elit.",
  },
  {
    id: 2,
    image: "/landing-page/explore-lesson.jpg",
    title: "Foundation of a Global Politics",
    description: "Dive into foundational concepts and global case studies to understand how politics shapes our world.",
  },
  {
    id: 3,
    image: "/landing-page/explore-lesson.jpg",
    title: "World War and Modern Conflicts",
    description: "Explore the roots and consequences of major wars in shaping global order.",
  },
];

export default function FreeLessonsSlider() {
  return (
    <section className="py-16 px-2 md:px-15 bg-alt2">
      <h2 className="text-5xl md:text-8xl font-bold text-primary text-center mb-16">
        Explore Free Lessons
      </h2>
      <div className="max-w-6xl mx-auto">
        <Swiper
          modules={[Pagination]}
          pagination={{
            clickable: true,
            renderBullet: (index, className) =>
              `<span class="${className} custom-bullet"></span>`,
          }}
          slidesPerView={1}
          className="w-full group"
          speed={500}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="grid md:grid-cols-2 gap-10 items-center">
                {/* Image */}
                <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover rounded-lg"
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
                  <button className="px-6 py-2 bg-primary text-white rounded">
                    Explore Curriculum →
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
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
            background: #346046; /* warna primary kamu (ganti sesuai kebutuhan, atau pakai var Tailwind) */
            opacity: 1;
          }
        `}</style>
      </div>
    </section>
  );
}
