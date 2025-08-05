'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ImageDropZone from '@/app/(dashboard)/dashboard/components/ImageDropZone';

interface FreeLesson {
    id: string;
    title: string;
    imageUrl: string | null;
    url: string;
}

export default function EditFreeLessonPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [form, setForm] = useState<FreeLesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/free-lessons/${id}`)
            .then((res) => res.json())
            .then((json) => {
                setForm(json?.data || null);
                setLoading(false);
            });
    }, [id]);

    const handleChange = (field: keyof FreeLesson, value: string | null) => {
        if (!form) return;
        setForm({ ...form, [field]: value });
    };

    const handleSubmit = async () => {
        if (!form) return;
        setSubmitting(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/free-lessons/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error('Failed to update');

            router.push('/dashboard/course-manage');
        } catch (error) {
            console.error(error); // ✅ gunakan error agar tidak dianggap unused
            alert('Failed to update free lesson.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || !form) return <p className="text-gray-500">Loading...</p>;

    return (
        <div className="p-8 max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Edit Free Lesson</h1>
                <Link href="/dashboard/course-manage" className="text-sm text-sky-600 hover:underline">
                    ← Back
                </Link>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        className="w-full border rounded px-3 py-2 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">PDF URL</label>
                    <input
                        type="text"
                        value={form.url}
                        onChange={(e) => handleChange('url', e.target.value)}
                        className="w-full border rounded px-3 py-2 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Image</label>
                    <ImageDropZone
                        currentImageUrl={form.imageUrl || ''}
                        onImageUpload={(url) => handleChange('imageUrl', url)}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t">
                <button
                    type="button"
                    className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => router.push('/dashboard/course-manage')}
                    disabled={submitting}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className={`rounded-md px-8 py-2 text-sm font-medium transition-colors ${submitting
                        ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                        : 'bg-sky-500 hover:bg-sky-600 text-white'
                        }`}
                >
                    {submitting ? (
                        <span className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                        </span>
                    ) : (
                        'Save Changes'
                    )}
                </button>
            </div>
        </div>
    );
}
