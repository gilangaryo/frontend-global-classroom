import Image from 'next/image';
export default function FreeLessonsSection() {
  return (
    <section className="py-16 px-15 bg-alt2">
      <h2 className="text-8xl font-bold text-primary text-center mb-16">Explore Free Lessons</h2>
      <div className="max-w-full mx-auto grid md:grid-cols-2 gap-8 items-center">

        <div className="relative w-full overflow-hidden aspect-16/9">
          <Image src="/landing-page/explore-lesson.jpg" alt="Global Politics" fill className="object-cover" />
        </div>
        <div>
          <h2 className="text-5xl font-bold text-primary tracking-wide mb-4">Foundation of a Global Politics</h2>
          <p className="text-text mb-6">
            Dive into foundational concepts and global case studies to understand how politics shapes our world.
          </p>
          <button className="px-6 py-2 bg-primary text-white rounded">
            Explore Free Lessons →
          </button>
        </div>
      </div>
    </section>
  );
}
