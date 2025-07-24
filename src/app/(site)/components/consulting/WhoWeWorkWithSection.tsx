import Image from "next/image";

const cardList = [
    {
        alt: "Education",
        text: "Schools and international education programs",
        img: "/consulting/who-we-work.png",
    },
    {
        alt: "NGOs",
        text: "NGOs and human rights organizations",
        img: "/consulting/who-we-work.png",
    },
    {
        alt: "Climate",
        text: "Climate and sustainability initiatives",
        img: "/consulting/who-we-work.png",
    },
    {
        alt: "Research",
        text: "Research centers and field study programs",
        img: "/consulting/who-we-work.png",
    },
];

export default function WhoWeWorkWithSection() {
    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h2 className="text-6xl font-bold text-primary mb-8 tracking-tight">
                    WHO WE WORK WITH
                </h2>
                <div className="relative mb-12">
                    <hr className="border-[#D9C7BF]" />
                    <div className="absolute left-1/2 top-1/2 bg-white text-[#363F36] font-bold px-2 -translate-x-1/2 -translate-y-1/2 select-none">
                        +
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
                    {cardList.map((item) => (
                        <div
                            key={item.alt}
                            className="bg-alt2 rounded-lg px-6 py-8 w-56 flex flex-col items-center "
                        >
                            <div className="h-9 w-9 rounded-full flex items-center justify-center mb-4 bg-[#EFE9E9]">
                                <Image
                                    src={item.img}
                                    alt={item.alt}
                                    width={50}
                                    height={50}
                                    className="opacity-70"
                                />
                            </div>
                            <p className="text-[#363F36] text-[15px] text-center">
                                {item.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
