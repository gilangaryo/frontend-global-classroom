'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Post {
    id: string;
    title: string;
    excerpt: string;
    image: string;
    category: string;
    date: string;
    url: string;
}

const posts: Post[] = [
    {
        id: 'japanese-aesthetics',
        title: 'Global Politics',
        excerpt:
            'Embracing Japanese Aesthetics involves appreciating nature and craftsmanship. The philosophy of Wabi-Sabi teaches us to find…',
        image: '/dummy/sample-product.png',
        category: 'Article',
        date: 'Mar 6, 2025',
        url: '#',
    },
    {
        id: 'digital-curriculum',
        title: 'Digital Curriculum Design',
        excerpt:
            'How to build an engaging, justice-centered digital curriculum for high school Social Studies and beyond…',
        image: '/dummy/sample-product.png',
        category: 'Article',
        date: 'Apr 10, 2025',
        url: '#',
    },
    {
        id: 'case-study-sportswashing',
        title: 'Case Study: Sportswashing',
        excerpt:
            'In this case study, we examine how mega-events shape soft power in the 21st century, from Qatar to the Olympics…',
        image: '/dummy/sample-product.png',
        category: 'Article',
        date: 'May 2, 2025',
        url: '#',
    },
];

export default function BlogPage() {
    return (
        <main className="font-body py-4 md:py-20 px-4 md:px-20 max-w-full mx-auto">
            {/* Heading + Nav */}
            <div className="flex items-center justify-between mb-12">
                <h1 className="md:text-7xl text-4xl font-bold text-black">LATEST NEWS</h1>
                <div className="flex gap-4">
                    <button className="p-2 border rounded-full text-[#363F36] hover:bg-[#EFE9E9]">
                        <ChevronLeft size={24} />
                    </button>
                    <button className="p-2 bg-[#363F36] rounded-full text-[#FDFDFD] hover:bg-[#4E3D34]">
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                {posts.map((post) => (
                    <div key={post.id} className="flex flex-col bg-white overflow-hidden ">
                        <div className="relative w-full aspect-square">
                            <Image src={post.image} alt={post.title} fill className="object-cover aspect-square" />
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="text-sm text-primary mb-2">
                                {post.category} / {post.date}
                            </div>
                            <h2 className="text-lg font-semibold text-[#363F36] mb-2">{post.title}</h2>
                            <p className="text-[#8E8E8E] text-sm flex-1">{post.excerpt}</p>

                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
