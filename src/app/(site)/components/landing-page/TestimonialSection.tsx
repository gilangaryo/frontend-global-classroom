
type TestimonialCardProps = {
  quote: string;
  author: string;
};

function TestimonialCard({ quote, author }: TestimonialCardProps) {
  return (
    <div className="bg-alt2 p-6 rounded-lg shadow flex flex-col justify-between h-full">
      <p className="text-black  mb-6">{quote}</p>
      <span className="block text-xl font-medium text-black self-start uppercase">
        <h3 >
          {author}

        </h3>
      </span>
    </div>
  );
}

export default function TestimonialSection() {
  return (
    <section className="py-40 px-4 md:px-20 bg-white">
      <div className="max-w-full mx-auto">
        <h2 className="text-7xl font-semibold text-primary text-left mb-15 leading-snug">
          What <br /> Teachers Are Saying
        </h2>
        <div className="grid md:grid-cols-3 gap-13 mb-2 ">
          <TestimonialCard
            quote="Thank you so much for making awesome resources. I’d really be lost without them."
            author="A Teacher in Australia"
          />
          <TestimonialCard
            quote="I have used a number of materials in my class. All created very lively class discussions and my students were very satisfied. I am very grateful to the author for the intelligent and thought-provoking questions and highly motivating selection of excellent sources. Thank you very, very much!"
            author="A Teacher in Croatia"
          />
          <TestimonialCard
            quote="I am a teacher in a public school with no tests or measurements to enter.  ALL our students are IB students. Thank you for all you have done to make Global Politics accessible to students of all capabilities."
            author="A Teacher in the US"
          />
        </div>
      </div>
    </section>
  );
}
