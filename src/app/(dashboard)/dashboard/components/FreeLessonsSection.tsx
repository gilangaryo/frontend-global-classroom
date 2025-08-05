'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type FreeLesson = {
    id: string;
    title: string;
    isActive: boolean;
};

export default function FreeLessonsSection() {
    const [freeLessons, setFreeLessons] = useState<FreeLesson[]>([]);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/free-lessons`)
            .then((res) => res.json())
            .then((json) => setFreeLessons(json.data || []));
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this free lesson?')) return;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/free-lessons/${id}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            setFreeLessons(prev => prev.filter((l) => l.id !== id));
        } else {
            alert('Failed to delete.');
        }
    };

    return (
        <section className="mt-12">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">Free Lessons</h2>
                <Link
                    href="/dashboard/course-manage/free-lesson"
                    className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                    Add Free Lesson
                </Link>
            </div>

            {freeLessons.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="mb-4 text-gray-600">No Free Lessons added yet.</p>
                    <Link href="/dashboard/course-manage/free-lesson" className="inline-block bg-sky-500 text-white px-4 py-2 rounded">
                        Add Free Lesson
                    </Link>
                </div>
            ) : (
                <div className="rounded-lg border">
                    <div className="grid grid-cols-12 bg-sky-500 text-white font-semibold text-sm">
                        <div className="col-span-6 px-4 py-3">Lesson</div>
                        <div className="col-start-11 px-4 py-3 text-center">Actions</div>
                    </div>
                    {freeLessons.map((item) => (
                        <div key={item.id} className="grid grid-cols-12 items-center border-t hover:bg-gray-50 ">
                            <div className="col-span-6 px-4 py-3">
                                <div className="font-medium text-gray-900">{item.title}</div>
                            </div>

                            <div className="col-start-11 px-4 py-3 flex justify-center gap-2 ">
                                <Link
                                    href={`/dashboard/course-manage/products/free-lesson/${item.id}/edit`}
                                    className="px-3 py-1 bg-sky-500 hover:bg-sky-600 text-white text-sm rounded transition-colors"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="px-3 py-1 border border-red-300 text-red-600 hover:bg-red-50 text-sm rounded transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
