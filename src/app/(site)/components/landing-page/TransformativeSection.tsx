import Image from 'next/image';
export default function TransformativeSection() {
  return (
    <section className="py-20 px-15 bg-white">
      <div className="max-w-full mx-auto grid lg:grid-cols-5 gap-2 items-center">
        <div className='col-span-3'>
          <h2 className="text-5xl text-primary mb-10 leading-relaxed">
            Transformative Learning Through Justice, Story, and Collaboration
          </h2>
          <p className="text-lg font-semibold tracking-wider">
            A Global Classroom creates justice-centered curriculum and learning experiences that help students make sense of the world and their place in it.
          </p>
          <p className="text-lg  text-navbar ml-10 my-8 border-l-3 pl-4">
            We design digital lessons that are intellectually rigorous, rooted in real-world issues, and built for the realities of today’s high school classrooms.
          </p>
          <p className="text-lg  text-text">
            We also partner with schools, NGOs, and frontline communities to create field-based learning programs that connect students and educators directly to global struggles for human rights and climate justice.
          </p>
        </div>
        <div className="relative w-full col-span-2 aspect-square overflow-hidden">
          <Image
            src="/landing-page/transformative.png"
            alt="Transformative learning"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}