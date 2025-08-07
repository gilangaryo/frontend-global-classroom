'use client';

import FileDropZone from '@/app/(dashboard)/dashboard/components/FileDropZone';
import ButtonColorPicker from '@/app/(dashboard)/dashboard/components/ButtonColorPicker';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ImageDropZone from '@/app/(dashboard)/dashboard/components/ImageDropZone';
import TiptapEditor from '@/app/(dashboard)/dashboard/components/TiptapEditor';
import Image from 'next/image';

interface UpdateCourseData {
    title: string;
    description: string;
    courseIncluded: string;
    price: number;
    previewUrl: string;
    digitalUrl: string;
    imageUrl: string;
    colorButton: string;
}

export default function EditCoursePage() {
    const router = useRouter();
    const { courseId } = useParams<{ courseId: string }>();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState<UpdateCourseData>({
        title: '',
        description: '',
        courseIncluded: '',
        price: 0,
        previewUrl: '',
        digitalUrl: '',
        imageUrl: '',
        colorButton: '#3E724A',
    });

    const updateField = (field: keyof UpdateCourseData, value: string | number) => {
        setFormData((prev: UpdateCourseData) => ({ ...prev, [field]: value }));
    };

    // Fetch existing course data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setInitialLoading(true);
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

                    setFormData({
                        title: course.title || '',
                        description: course.description || '',
                        courseIncluded: course.courseIncluded || '',
                        price: parseFloat(course.price) || 0,
                        previewUrl: course.previewUrl || '',
                        digitalUrl: course.digitalUrl || '',
                        imageUrl: course.imageUrl || '',
                        colorButton: course.colorButton || '#3E724A',
                    });
                } else {
                    throw new Error(data.message || 'Invalid response format');
                }
            } catch (err) {
                console.error('Error fetching course:', err);
                setError(err instanceof Error ? err.message : 'Failed to load course');
            } finally {
                setInitialLoading(false);
            }
        };

        if (courseId) fetchData();
    }, [courseId]);

    const updateCourse = async (data: UpdateCourseData) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${courseId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Failed to update course');
        return result.data;
    };

    const handleSave = async () => {
        // Validation
        if (!formData.title.trim()) { alert('Title is required'); return; }
        if (!formData.description.trim()) { alert('Description is required'); return; }
        if (!formData.courseIncluded.trim()) { alert('What&apos;s Included is required'); return; }
        if (formData.price <= 0) { alert('Price must be greater than 0'); return; }
        if (!formData.previewUrl.trim()) { alert('Preview file is required'); return; }
        if (!formData.digitalUrl.trim()) { alert('Digital file is required'); return; }
        if (!formData.imageUrl.trim()) { alert('Course image is required'); return; }
        if (!/^#[0-9A-Fa-f]{6}$/.test(formData.colorButton)) { alert('Button color is invalid'); return; }

        try {
            setLoading(true);
            await updateCourse(formData);
            alert('Course updated successfully!');
            router.push('/dashboard/course-manage');
        } catch (err) {
            console.error(err);
            alert(err instanceof Error ? err.message : 'Failed to update course');
        } finally {
            setLoading(false);
        }
    };

    const isFormValid =
        formData.title.trim() &&
        formData.description.trim() &&
        formData.courseIncluded.trim() &&
        formData.price > 0 &&
        formData.previewUrl.trim() &&
        formData.digitalUrl.trim() &&
        formData.imageUrl.trim() &&
        /^#[0-9A-Fa-f]{6}$/.test(formData.colorButton);

    // Loading state
    if (initialLoading) {
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

    // Error state
    if (error) {
        return (
            <div className="p-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md mx-auto">
                    <div className="text-red-600 text-lg font-semibold mb-2">Error</div>
                    <p className="text-red-700 mb-4">{error}</p>
                    <button
                        onClick={() => router.push('/dashboard/course-manage')}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    >
                        Back to Course Management
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <header className="space-y-1">
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

            <section className="mt-10 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Edit Course</h2>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-5">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Course Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter course title"
                                value={formData.title}
                                onChange={e => updateField('title', e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows={6}
                                placeholder="Add course description..."
                                value={formData.description}
                                onChange={e => updateField('description', e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                                required
                            />
                        </div>

                        {/* What's Included */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                What&apos;s Included <span className="text-red-500">*</span>
                            </label>
                            <div className="rounded-md bg-white">
                                <TiptapEditor
                                    content={formData.courseIncluded}
                                    onChange={value => updateField('courseIncluded', value)}
                                    placeholder="List what's included..."
                                />
                            </div>
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price <span className="text-red-500">*</span>
                            </label>
                            <div className="flex h-12 overflow-hidden rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-sky-400">
                                <div className="flex items-center justify-center border-2 border-sky-500 bg-sky-100 px-4 m-2 rounded-md">
                                    <span className="text-sky-500 text-sm font-bold">$</span>
                                </div>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={formData.price === 0 ? '' : formData.price}
                                    onChange={e => updateField('price', parseFloat(e.target.value) || 0)}
                                    className="flex-1 px-4 py-2 text-sm placeholder:text-gray-500 outline-none border-none"
                                    min={0}
                                    step={0.01}
                                    required
                                />
                            </div>
                        </div>

                        {/* Button Color */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Button Color <span className="text-red-500">*</span>
                            </label>
                            <ButtonColorPicker
                                value={formData.colorButton}
                                onChange={value => updateField('colorButton', value)}
                            />
                        </div>

                        {/* Preview File */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Preview File <span className="text-red-500">*</span>
                            </label>
                            <FileDropZone
                                label="Preview File"
                                onFileUpload={url => updateField('previewUrl', url)}
                                acceptedTypes="video/*,application/pdf"
                            />
                            {formData.previewUrl && (
                                <p className="text-xs text-gray-500 mt-2 break-all">
                                    Current: {formData.previewUrl}
                                </p>
                            )}
                        </div>

                        {/* Digital File */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Digital File <span className="text-red-500">*</span>
                            </label>
                            <FileDropZone
                                label="Digital File"
                                onFileUpload={url => updateField('digitalUrl', url)}
                                acceptedTypes="application/zip,application/pdf"
                            />
                            {formData.digitalUrl && (
                                <p className="text-xs text-gray-500 mt-2 break-all">
                                    Current: {formData.digitalUrl}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Course Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Course Image <span className="text-red-500">*</span>
                            </label>
                            <ImageDropZone
                                currentImageUrl={formData.imageUrl}
                                onImageUpload={url => updateField('imageUrl', url)}
                            />
                        </div>

                        {/* Preview Card */}
                        {(formData.title || formData.imageUrl) && (
                            <div className="bg-gray-50 border rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Preview:</h3>
                                <div className="bg-white rounded-lg border p-3 shadow-sm">
                                    {/* Image */}
                                    {formData.imageUrl && (
                                        <div className="relative w-full h-40 mb-3">
                                            <Image
                                                src={formData.imageUrl}
                                                alt="Course preview"
                                                fill
                                                className="object-cover rounded"
                                                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}

                                    {/* Title */}
                                    <h4 className="font-medium text-gray-900 text-sm">
                                        {formData.title || 'Course Title'}
                                    </h4>

                                    {/* Price */}
                                    {formData.price > 0 && (
                                        <p className="text-sm text-green-600 font-medium mt-1">
                                            ${formData.price.toFixed(2)}
                                        </p>
                                    )}

                                    {/* Description */}
                                    {formData.description && (
                                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                                            {formData.description.replace(/<[^>]*>/g, '').substring(0, 80)}
                                            {formData.description.length > 80 && '...'}
                                        </p>
                                    )}

                                    {/* What's Included Preview */}
                                    {formData.courseIncluded.trim() && (
                                        <div
                                            className="text-xs text-gray-500 mt-2 prose prose-sm max-w-none line-clamp-3"
                                            dangerouslySetInnerHTML={{ __html: formData.courseIncluded }}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 pt-6 border-t">
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/course-manage')}
                        className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={loading || !isFormValid}
                        className={`rounded-md px-8 py-2 text-sm font-medium transition-colors ${loading || !isFormValid
                            ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                            : 'bg-sky-500 hover:bg-sky-600 text-white'
                            }`}
                    >
                        {loading ? 'Updating...' : 'Update Course'}
                    </button>
                </div>
            </section>
        </div>
    );
}