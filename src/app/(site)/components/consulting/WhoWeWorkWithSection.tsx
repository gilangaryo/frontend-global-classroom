import Image from "next/image";
import Divider from "../Divider";

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
        <section className="py-4 md:py-70 px-4 md:px-25  bg-white max-w-full ">
            <div className=" mx-auto ">
                <h2 className="text-4xl md:text-7xl font-bold mt-8 md:mt-2  mb-8 tracking-tight md:text-left">
                    WHO WE WORK WITH
                </h2>


                <div className="relative mb-12">
                    <Divider />
                    <div className="absolute left-1/2 top-1/2 bg-white text-[#363F36] font-bold px-2 -translate-x-1/2 -translate-y-1/2 select-none">
                        +
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
                    {cardList.map((item) => (
                        <div
                            key={item.alt}
                            className="bg-alt2 rounded-lg px-6 py-8 flex flex-col items-center w-full max-w-[270px] shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="h-9 w-full rounded-full flex items-center justify-center mb-4 bg-[#EFE9E9]">
                                <Image
                                    src={item.img}
                                    alt={item.alt}
                                    width={50}
                                    height={50}
                                    className="opacity-70"
                                />
                            </div>
                            <p className="text-primary text-[14px] text-center font-semibold ">
                                {item.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
