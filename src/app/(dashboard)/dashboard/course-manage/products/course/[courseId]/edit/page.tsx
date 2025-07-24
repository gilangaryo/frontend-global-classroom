// app/(dashboard)/course-manage/products/course/[courseId]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditCoursePage() {
    const router = useRouter();
    const { courseId } = useParams<{ courseId: string }>();
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // fetch data existing
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses/${courseId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => res.json())
            .then(data => {
                setTitle(data.data.title);
                setLoading(false);
            });
    }, [courseId]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses/${courseId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ title })
            }
        );
        router.push('/dashboard/course-manage/products/course');
    };

    if (loading) return <p>Loading…</p>;

    return (
        <div className="p-8 max-w-lg mx-auto">
            <h1 className="text-2xl font-semibold mb-6">Edit Course</h1>
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                {/* Tambahkan field lain sesuai schema */}
                <button
                    type="submit"
                    className="mt-4 bg-sky-500 text-white px-4 py-2 rounded"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}
