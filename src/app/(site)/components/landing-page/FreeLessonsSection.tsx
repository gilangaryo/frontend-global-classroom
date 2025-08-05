'use client';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
interface SimpleFreeLesson {
  id: string;
  title: string;
  description: string;
  url: string;
}

export default function FreeLessonsSlider() {
  const [lessons, setLessons] = useState<SimpleFreeLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/free-lessons`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setLessons(json.data || []);
        } else {
          setError(json.error || 'Failed to load lessons');
        }
      })
      .catch((err) => {
        console.error('Error fetching free lessons:', err);
        setError('Failed to load lessons');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-8 md:py-40 px-4 md:px-20 bg-alt2">
      <h2 className="text-5xl md:text-8xl font-bold text-primary text-center mb-20">
        Explore Free Lessons
      </h2>
      <div className="relative max-w-6xl mx-auto">
        {loading ? (
          <div className="text-center text-gray-500 py-20">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-20">{error}</div>
        ) : lessons.length === 0 ? (
          <div className="text-center text-gray-500 py-20">No free lessons found.</div>
        ) : (
          <>
            {/* Navigation arrows */}
            {/* Navigation arrows */}
            <div className="swiper-button-prev-custom absolute -left-20 top-1/2 -translate-y-1/2 z-10 
  text-primary h-55 w-16 flex items-center justify-center cursor-pointer">
              <ChevronLeft size={64} strokeWidth={2} />
            </div>

            <div className="swiper-button-next-custom absolute -right-20 top-1/2 -translate-y-1/2 z-10 
  text-primary h-55 w-16 flex items-center justify-center cursor-pointer">
              <ChevronRight size={64} strokeWidth={2} />
            </div>


            <Swiper
              modules={[Autoplay, Navigation]}
              slidesPerView={1}
              speed={1000}
              autoplay={{ delay: 7000, disableOnInteraction: false }}
              loop={true}
              navigation={{
                prevEl: '.swiper-button-prev-custom',
                nextEl: '.swiper-button-next-custom',
              }}
              className="w-full group"
            >
              {lessons.map((lesson) => (
                <SwiperSlide key={lesson.id}>
                  <div className="grid md:grid-cols-2 gap-10 items-end">
                    <div className="relative w-full aspect-[16/9] overflow-hidden">
                      <Image
                        src="/landing-page/explore-lesson.jpg"
                        alt="Free lesson"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col items-start justify-end">
                      <h3 className="text-3xl md:text-5xl font-bold text-primary tracking-wide mb-4 leading-snug">
                        {lesson.title}
                      </h3>
                      <p className="text-lg text-text mb-6 max-w-md">{lesson.description}</p>
                      <Link
                        href={lesson.url}
                        className="text-xl py-2 text-primary font-semibold rounded hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Explore Free Lessons &rarr;
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        )}
      </div>
    </section>
  );
}
