import Image from 'next/image';

type ResourceCardProps = {
    img: string;
    title: string;
    subtitle: string;
};

function ResourceCard({ img, title, subtitle }: ResourceCardProps) {
    return (
        <div className="space-y-2">
            <div className="w-full relative rounded-lg overflow-hidden aspect-3/2">
                <Image src={img} alt={title} fill className="object-cover" />
            </div>
            <h4 className="text-lg font-semibold text-primary">{title}</h4>
            <p className="text-sm text-text">{subtitle}</p>
        </div>
    );
}

export default function FeaturedResourcesSection() {
    return (
        <section className="py-16 px-15 bg-white">
            <div className="max-w-full mx-auto">
                <h2 className="text-6xl font-bold text-primary mb-8">Featured Resources</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <ResourceCard
                        img="/landing-page/card.jpg"
                        title="Power and Global Order"
                        subtitle="Analysis activities on power dynamics in world politics"
                    />
                    <ResourceCard
                        img="/landing-page/card.jpg"
                        title="Dialogue Across Borders"
                        subtitle="Scaffolded debates and discussion guides for global citizenship"
                    />
                    <div className="col-span-1 md:col-span-1 flex relative aspect-3/4 ml-6">
                        <Image
                            src="/landing-page/cover-featured.jpg"
                            alt="War Crimes in Ukraine"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}