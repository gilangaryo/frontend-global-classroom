'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ImageDropZone from '@/app/(dashboard)/dashboard/components/ImageDropZone';

export default function AddPortfolioPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: ''
    });

    const handleSubmit = async () => {
        if (!formData.title || !formData.image) return alert('Title & image are required!');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/portfolios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            router.push('/dashboard/featured-project');
        } else {
            alert('Failed to create portfolio');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                {/* BACK BUTTON */}
                <button
                    onClick={() => router.push('/dashboard/featured-project')}
                    className="text-sm text-gray-500 hover:underline flex items-center mb-2"
                >
                    <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Featured Management
                </button>
                <h1 className="text-xl font-semibold">Add Featured</h1>
            </div>

            <label className="block text-sm font-medium mb-2">Title</label>
            <input
                type="text"
                className="border p-2 rounded w-full mb-4"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
                className="border p-2 rounded w-full mb-4"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <label className="block text-sm font-medium mb-2">Image</label>
            <ImageDropZone
                currentImageUrl={formData.image}
                onImageUpload={(url) => setFormData({ ...formData, image: url })}
            />

            <button
                onClick={handleSubmit}
                className="mt-4 bg-sky-500 text-white px-6 py-2 rounded"
            >
                Save
            </button>
        </div>
    );
}