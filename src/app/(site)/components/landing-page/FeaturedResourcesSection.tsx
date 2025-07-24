import Image from 'next/image';

type ResourceCardProps = {
    img: string;
    title: string;
    subtitle: string;
    tags?: string[];
    badge?: string;
    badgeColor?: string;
};

function ResourceCard({
    img,
    title,
    subtitle,
    tags = [],
    badge,
    badgeColor = "bg-green-active",
}: ResourceCardProps) {
    return (
        <div className="space-y-2 w-full max-w-[340px] ">
            <div className="w-full relative rounded-lg overflow-hidden aspect-3/2">
                <Image src={img} alt={title} fill className="object-cover" />
                {badge && (
                    <span
                        className={`absolute top-0 left-0 text-white text-xs font-semibold px-4 py-2 rounded ${badgeColor}`}
                    >
                        {badge}
                    </span>
                )}
            </div>
            <div className="flex flex-wrap gap-1 mb-1">
                {tags.length > 0 && (
                    <span className="text-xs text-tag font-medium">
                        {tags.join(', ')}
                    </span>
                )}
            </div>
            <h4 className="text-base font-bold text-primary uppercase">{title}</h4>
            <p className="text-xs text-text">{subtitle}</p>
        </div>
    );
}

export default function FeaturedResourcesSection() {
    return (
        <section className="py-8 md:py-14 px-4 md:px-25 bg-white">
            <div className="mx-auto">
                <div className="grid  grid-cols-1 md:grid-cols-3 md:gap-8 items-stretch min-h-[520px]">
                    {/* Kiri: Judul dan dua card di bawah */}
                    <div className='col-span-2 flex flex-col h-full'>
                        <h2 className="text-4xl md:text-7xl font-bold text-primary mb-8 leading-tight">
                            FEATURED <br />  RESOURCES
                        </h2>
                        <div className="flex gap-6 mt-auto mb-6">
                            <ResourceCard
                                img="/landing-page/card.jpg"
                                title="Power and Global Order"
                                subtitle="Analysis activities on power dynamics in world politics"
                                badge="Bestseller"
                                badgeColor="bg-green-active"
                                tags={["11th - 12th", "Adult Education", "Higher Education"]}
                            />
                            <ResourceCard
                                img="/landing-page/card.jpg"
                                title="The Power of States"
                                subtitle="Torem ipsum dolor sit amet, consectetur adipiscing elit.Torem ipsum dolor sit amet..."
                                badge="New Lesson"
                                badgeColor="bg-green-active"
                                tags={["11th - 12th", "Adult Education", "Higher Education"]}
                            />
                        </div>
                    </div>
                    {/* Kanan: Gambar besar */}
                    <div className="flex justify-center">
                        <div className="w-full max-w-full md:max-w-md aspect-[3/4] relative items-center">
                            <Image
                                src="/landing-page/cover-featured.jpg"
                                alt="War Crimes in Ukraine"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
