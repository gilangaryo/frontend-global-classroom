'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Lesson {
    id: string;
    title: string;
    description: string;
    image: string;
    grade: string;
    price: number;
}

const lessons: Lesson[] = [
    {
        id: 'global-actors',
        title: 'Global Actors and Global Governance',
        description:
            'This lesson introduces students to the concept of global actors and the structures of global governance that shape…',
        image: '/dummy/sample-product.png',
        grade: '11th – 12th, Adult Education, Higher Education',
        price: 15,
    },
    {
        id: 'sportswashing',
        title: 'Case Study: Sportswashing and Qatar’s Quest for Soft Power',
        description:
            'This lesson introduces students to the concept of global actors and the structures of global governance that shape…',
        image: '/dummy/sample-product.png',
        grade: '11th – 12th, Adult Education, Higher Education',
        price: 15,
    },
    {
        id: 'power-in-global-politics',
        title: 'Power in Global Politics',
        description:
            'This lesson introduces students to the concept of global actors and the structures of global governance that shape…',
        image: '/dummy/sample-product.png',
        grade: '11th – 12th, Adult Education, Higher Education',
        price: 15,
    },
    {
        id: 'power-of-states',
        title: 'The Power of States',
        description:
            'This lesson introduces students to the concept of global actors and the structures of global governance that shape…',
        image: '/dummy/sample-product.png',
        grade: '11th – 12th, Adult Education, Higher Education',
        price: 15,
    },
    {
        id: 'the-brics',
        title: 'The BRICS+',
        description:
            'This lesson introduces students to the concept of global actors and the structures of global governance that shape…',
        image: '/dummy/sample-product.png',
        grade: '11th – 12th, Adult Education, Higher Education',
        price: 15,
    },
    {
        id: 'the-power-of-igos',
        title: 'The Power of IGOs',
        description:
            'This lesson introduces students to the concept of global actors and the structures of global governance that shape…',
        image: '/dummy/sample-product.png',
        grade: '11th – 12th, Adult Education, Higher Education',
        price: 15,
    },
];

const tabs = [
    { id: 'power-order', label: 'Power and Global Order' },
    { id: 'foreign-policy', label: 'Foreign Policy in Actions' },
    { id: 'sovereignty', label: 'Sovereignty and Global Challenges' },
    { id: 'legitimacy', label: 'Legitimacy, Fragility, and State Power' },
];

export default function UnitPage() {
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const [search, setSearch] = useState('');
    const [priceSort, setPriceSort] = useState<'asc' | 'desc' | ''>('');
    const [gradeFilter, setGradeFilter] = useState('');

    const filtered = lessons
        .filter((l) =>
            [l.title, l.description, l.grade]
                .join(' ')
                .toLowerCase()
                .includes(search.toLowerCase())
        )
        .filter((l) => (gradeFilter ? l.grade.includes(gradeFilter) : true))
        .sort((a, b) => {
            if (priceSort === 'asc') return a.price - b.price;
            if (priceSort === 'desc') return b.price - a.price;
            return 0;
        });

    return (
        <main className="font-body max-w-7xl mx-auto py-16 px-6">
            {/* Breadcrumb & Title */}
            <div className="text-sm text-gray-600 mb-2">
                FOUNDATIONS OF GLOBAL POLITICS &middot; Unit 01. Power and Global Actors
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8">POWER AND GLOBAL ACTORS</h1>

            {/* Tabs */}
            <nav className="flex border-b mb-8 text-sm">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-2 mr-8 ${activeTab === tab.id
                            ? 'text-green-700 border-b-2 border-green-700'
                            : 'text-gray-400'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>

            {/* Separator + */}
            <div className="relative mb-8">
                <hr className="border-gray-200" />
                <div className="absolute left-1/2 top-1/2 bg-white px-2 text-green-700 font-bold -translate-x-1/2 -translate-y-1/2">
                    +
                </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12">
                <input
                    type="text"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 max-w-md px-4 py-2 border rounded"
                />
                <div className="flex gap-4">
                    <select
                        value={priceSort}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === "asc" || val === "desc" || val === "") setPriceSort(val);
                        }}

                        className="px-4 py-2 border rounded"
                    >
                        <option value="">Price</option>
                        <option value="asc">Lowest to Highest</option>
                        <option value="desc">Highest to Lowest</option>
                    </select>
                    <select
                        value={gradeFilter}
                        onChange={(e) => setGradeFilter(e.target.value)}
                        className="px-4 py-2 border rounded"
                    >
                        <option value="">Grade</option>
                        <option value="11th">11th – 12th</option>
                        <option value="Adult">Adult Education</option>
                        <option value="Higher">Higher Education</option>
                    </select>
                </div>
            </div>

            {/* Content */}
            <div className="grid md:grid-cols-3 gap-12">
                {/* Left description */}
                <div className="space-y-6">
                    <p className="text-gray-700">
                        This unit introduces students to some of the foundational concepts in Global Politics.
                        Lessons explore the roles and influence of global actors (state and non-state) in shaping
                        international governance and power dynamics.
                    </p>
                    <p className="text-gray-700">
                        Through readings, videos, presentations, discussions, quizzes, source analysis, drawing
                        activities, a role play, and writing exercises, students will examine different types of
                        power (hard, soft, smart), global trends such as power diffusion and power transition,
                        and the role of states and intergovernmental organizations in shaping the liberal world
                        order.
                    </p>
                    <p className="text-gray-700">
                        Case studies include a focused look at Qatar’s use of sportswashing to increase its soft
                        power in the lead up to the 2022 FIFA World Cup, the challenges posed by the BRICS+ to
                        the Western-led order, and China’s rise on the global stage.
                    </p>
                    <Link
                        href="#"
                        className="block text-center bg-gray-200 text-gray-800 py-3 rounded font-semibold"
                    >
                        Preview Unit
                    </Link>
                    <Link
                        href="#"
                        className="block text-center bg-green-700 text-white py-3 rounded font-semibold"
                    >
                        Buy All Lessons: $350
                    </Link>
                </div>

                {/* Lesson Cards */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map((l) => (
                        <div key={l.id} className="border rounded overflow-hidden flex flex-col">
                            <Image
                                src={l.image}
                                alt={l.title}
                                width={400}
                                height={250}
                                className="object-cover"
                            />
                            <div className="p-4 flex-1 flex flex-col">
                                <div className="text-xs text-gray-500 mb-2">{l.grade}</div>
                                <h3 className="font-semibold mb-2">{l.title}</h3>
                                <p className="text-gray-600 text-sm flex-1">{l.description}</p>
                                <div className="mt-4 flex gap-2">
                                    <Link
                                        href="#"
                                        className="flex-1 text-center py-2 border rounded text-sm font-medium"
                                    >
                                        Preview
                                    </Link>
                                    <Link
                                        href="#"
                                        className="flex-1 text-center py-2 bg-green-700 text-white rounded text-sm font-medium"
                                    >
                                        Buy Now ${l.price}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
