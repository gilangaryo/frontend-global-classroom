'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ImageDropZone from '@/app/(dashboard)/dashboard/components/ImageDropZone';

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
    const [price, setPrice] = useState<number>(0);
    const [digitalUrl, setDigitalUrl] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [colorButton, setColorButton] = useState('#3E724A');
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch existing course
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

                if (!res.ok) {
                    throw new Error('Failed to fetch course data');
                }

                const data = await res.json();

                if (data.status === 'success' && data.data) {
                    const course = data.data;

                    // Validate that this is actually a COURSE type
                    if (course.type !== 'COURSE') {
                        throw new Error('This product is not a course');
                    }

                    setTitle(course.title || '');
                    setDescription(course.description || '');
                    setPrice(parseFloat(course.price) || 0);
                    setDigitalUrl(course.digitalUrl || '');
                    setPreviewUrl(course.previewUrl || '');
                    setColorButton(course.colorButton || '#3E724A');
                    setImageUrl(course.imageUrl || '');
                    setTags(course.tags || []);
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

        if (courseId) {
            fetchData();
        }
    }, [courseId]);

    const handleAddTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            setTags([...tags, newTag.trim()]);
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleImageUpload = (url: string) => {
        setImageUrl(url);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');

            // Prepare update data
            const updateData = {
                title: title.trim(),
                description: description.trim(),
                price: price,
                digitalUrl: digitalUrl.trim(),
                previewUrl: previewUrl.trim(),
                colorButton,
                imageUrl: imageUrl.trim(),
                tags: tags.filter(tag => tag.trim() !== ''), // Remove empty tags
            };

            // Validate required fields
            if (!updateData.title) {
                throw new Error('Course title is required');
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${courseId}`, {
                method: 'PATCH', // Using PATCH as per your API
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
            setError(err instanceof Error ? err.message : 'Failed to update course');
            alert(err instanceof Error ? err.message : 'Failed to update course');
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
                <p className="text-sm text-gray-500">
                    Edit your course information and settings.
                </p>
            </header>

            <section className="space-y-6">
                <h2 className="text-lg font-semibold">Edit Course</h2>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="md:col-span-2 space-y-5">
                            {/* Course Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Course Title *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter course title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    rows={5}
                                    placeholder="Describe your course content and objectives..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full resize-none rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                                />
                            </div>

                            {/* Tags Management */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Course Tags
                                </label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        placeholder="Add a tag (e.g., javascript, beginner)"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddTag();
                                            }
                                        }}
                                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddTag}
                                        className="px-4 py-2 bg-sky-500 text-white text-sm rounded-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400"
                                    >
                                        Add Tag
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                className="text-gray-500 hover:text-red-500 ml-1"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Color Button */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Button Color Theme
                                </label>
                                <div className="flex items-center gap-4 border border-gray-300 rounded-lg px-4 py-2 h-12">
                                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: colorButton }} />
                                    <label className="text-sm text-gray-600 whitespace-nowrap">
                                        Change Color Template (for button)
                                    </label>
                                    <input
                                        type="color"
                                        value={colorButton}
                                        onChange={(e) => setColorButton(e.target.value)}
                                        className="ml-auto h-6 w-6 border-none cursor-pointer bg-transparent"
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Course Price (USD)
                                </label>
                                <div className="flex h-12 overflow-hidden rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-sky-400">
                                    <div className="flex-shrink-0 flex items-center justify-center border-2 border-sky-500 bg-sky-100 px-4 m-2 rounded-md">
                                        <span className="text-sky-500 text-sm font-bold">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00 (price all units)"
                                        value={price || ''}
                                        onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                                        className="flex-1 px-4 py-2 text-sm placeholder:text-gray-500 outline-none border-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Set to 0 for free course</p>
                            </div>

                            {/* Preview URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Preview Course Content URL
                                </label>
                                <div className="flex h-12 overflow-hidden rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-sky-400">
                                    <span className="flex w-12 items-center justify-center text-gray-700">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </span>
                                    <input
                                        type="url"
                                        placeholder="Preview Course Content URL"
                                        value={previewUrl}
                                        onChange={(e) => setPreviewUrl(e.target.value)}
                                        className="flex-1 h-full px-4 text-sm placeholder:text-gray-600 outline-none"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Link for free preview/demo of your course</p>
                            </div>

                            {/* Digital URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Access Link After Purchase
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://your-course-platform.com/access"
                                    value={digitalUrl}
                                    onChange={(e) => setDigitalUrl(e.target.value)}
                                    className="h-12 w-full rounded-lg border border-gray-300 px-5 text-sm placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-sky-400"
                                />
                                <p className="text-xs text-gray-500 mt-1">Link where students can access the course content after purchase</p>
                            </div>
                        </div>

                        {/* Image Upload Section */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Course Image
                                </label>
                                <ImageDropZone
                                    currentImageUrl={imageUrl}
                                    onImageUpload={handleImageUpload}
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Upload an image for your course. Recommended size: 800x600px
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
                            onClick={() => router.back()}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !title.trim()}
                            className={`px-8 py-2.5 text-sm font-medium transition-colors ${loading || !title.trim()
                                ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                                : 'bg-sky-500 hover:bg-sky-600 text-white focus:outline-none focus:ring-2 focus:ring-sky-400'
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