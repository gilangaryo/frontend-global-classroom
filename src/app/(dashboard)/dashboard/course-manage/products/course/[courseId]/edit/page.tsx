'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ImageDropZone from '@/app/(dashboard)/dashboard/components/ImageDropZone';
import TiptapEditor from '@/app/(dashboard)/dashboard/components/TiptapEditor'; // pastikan path ini sesuai

function isColorDark(hex: string): boolean {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
}

export default function EditCoursePage() {
    const router = useRouter();
    const { courseId } = useParams<{ courseId: string }>();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [courseIncluded, setCourseIncluded] = useState(''); // ← NEW
    const [price, setPrice] = useState<number>(0);
    const [digitalUrl, setDigitalUrl] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [colorButton, setColorButton] = useState('#3E724A');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${courseId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!res.ok) throw new Error('Failed to fetch course data');

                const data = await res.json();

                if (data.status === 'success' && data.data) {
                    const course = data.data;

                    if (course.type !== 'COURSE') {
                        throw new Error('This product is not a course');
                    }

                    setTitle(course.title || '');
                    setDescription(course.description || '');
                    setCourseIncluded(course.courseIncluded || ''); // ← NEW
                    setPrice(parseFloat(course.price) || 0);
                    setDigitalUrl(course.digitalUrl || '');
                    setPreviewUrl(course.previewUrl || '');
                    setColorButton(course.colorButton || '#3E724A');
                    setImageUrl(course.imageUrl || '');
                } else {
                    throw new Error(data.message || 'Invalid response format');
                }
            } catch (err) {
                console.error('Error fetching course:', err);
                setError(err instanceof Error ? err.message : 'Failed to load course');
            } finally {
                setLoading(false);
            }
        };

        if (courseId) fetchData();
    }, [courseId]);

    const handleImageUpload = (url: string) => {
        setImageUrl(url);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');

            const updateData = {
                title: title.trim(),
                description: description.trim(),
                courseIncluded: courseIncluded.trim(), // ← NEW
                price,
                digitalUrl: digitalUrl.trim(),
                previewUrl: previewUrl.trim(),
                colorButton,
                imageUrl: imageUrl.trim(),
            };

            if (!updateData.title) throw new Error('Course title is required');

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${courseId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updateData),
            });

            const data = await res.json();

            if (res.ok && data.status === 'success') {
                alert('Course updated successfully!');
                router.push('/dashboard/course-manage/');
            } else {
                throw new Error(data.message || 'Failed to update course');
            }
        } catch (err) {
            console.error('Error updating course:', err);
            const message = err instanceof Error ? err.message : 'Failed to update course';
            setError(message);
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading course data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md mx-auto">
                    <div className="text-red-600 text-lg font-semibold mb-2">Error</div>
                    <p className="text-red-700 mb-4">{error}</p>
                    <button
                        onClick={() => router.back()}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <header className="space-y-1 mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={() => router.push('/dashboard/course-manage')}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Course Management
                    </button>
                </div>
                <h1 className="text-2xl font-semibold">Course Management</h1>
                <p className="text-sm text-gray-500">Edit your course information and settings.</p>
            </header>

            <section className="space-y-6">
                <h2 className="text-lg font-semibold">Edit Course</h2>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="md:col-span-2 space-y-5">
                            {/* Course Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                                />
                            </div>

                            {/* Course Included */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Whats Included in This Course
                                </label>
                                <TiptapEditor
                                    content={courseIncluded}
                                    onChange={setCourseIncluded}
                                    placeholder="List what students will get (e.g., videos, guides, certificates)..."
                                />
                            </div>

                            {/* Color */}
                            {/* Color */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Button Color Theme</label>
                                <div className="flex items-center gap-4 border border-gray-300 rounded-lg px-4 py-2 h-12">
                                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: colorButton }} />
                                    <label className="text-sm text-gray-600">Change Color Template</label>
                                    <input
                                        type="color"
                                        value={colorButton}
                                        onChange={(e) => setColorButton(e.target.value)}
                                        className="ml-auto h-6 w-6 cursor-pointer bg-transparent"
                                    />
                                </div>

                                {/* Live Button Preview */}
                                <div className="pt-2">
                                    <label className="text-sm text-gray-600">Live Button Preview:</label>
                                    <div className="mt-2">
                                        <button
                                            type="button"
                                            className={`px-8 py-3 rounded-lg font-semibold hover:opacity-90 ${isColorDark(colorButton) ? 'text-white' : 'text-black'
                                                }`}
                                            style={{ backgroundColor: colorButton }}
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>


                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Course Price (USD)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={price}
                                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                                    className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                                />
                            </div>

                            {/* Preview URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Preview URL</label>
                                <input
                                    type="url"
                                    value={previewUrl}
                                    onChange={(e) => setPreviewUrl(e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                                />
                            </div>

                            {/* Digital URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Access Link</label>
                                <input
                                    type="url"
                                    value={digitalUrl}
                                    onChange={(e) => setDigitalUrl(e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                                />
                            </div>
                        </div>

                        {/* Image */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Course Image</label>
                                <ImageDropZone currentImageUrl={imageUrl} onImageUpload={handleImageUpload} />
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !title.trim()}
                            className={`px-8 py-2.5 text-sm font-medium transition-colors ${loading || !title.trim()
                                ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                                : 'bg-sky-500 hover:bg-sky-600 text-white'
                                } rounded-md`}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}
