'use client';

import ImageDropZone from '@/app/(dashboard)/dashboard/components/ImageDropZone';
import FileDropZone from '@/app/(dashboard)/dashboard/components/FileDropZone';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from "next/image";

interface Course {
    id: string;
    title: string;
}

interface FormData {
    parentId: string;
    title: string;
    description: string;
    price: number;
    previewUrl: string;
    digitalUrl: string;
    imageUrl: string;
}

type FormField = keyof FormData;

export default function EditUnitPage() {
    const router = useRouter();
    const { unitId } = useParams<{ unitId: string }>();

    const [formData, setFormData] = useState<FormData>({
        parentId: '',
        title: '',
        description: '',
        price: 0,
        previewUrl: '',
        digitalUrl: '',
        imageUrl: '',
    });

    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [coursesLoading, setCoursesLoading] = useState(true);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState<Partial<Record<FormField, string>>>({});

    function updateField(field: FormField, value: string | number) {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                setCoursesLoading(true);

                // Fetch unit data
                const unitRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${unitId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!unitRes.ok) {
                    throw new Error('Failed to fetch unit data');
                }

                const unitData = await unitRes.json();

                if (unitData.status === 'success' && unitData.data) {
                    const unit = unitData.data;

                    if (unit.type !== 'UNIT') {
                        throw new Error('This product is not a unit');
                    }

                    setFormData({
                        parentId: unit.parentId || '',
                        title: unit.title || '',
                        description: unit.description || '',
                        price: parseFloat(unit.price) || 0,
                        previewUrl: unit.previewUrl || '',
                        digitalUrl: unit.digitalUrl || '',
                        imageUrl: unit.imageUrl || '',
                    });
                } else {
                    throw new Error(unitData.message || 'Invalid response format');
                }

                // Fetch available courses for parent selection
                const coursesRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products?type=COURSE&isActive=true`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (coursesRes.ok) {
                    const coursesData = await coursesRes.json();
                    console.log('Courses data:', coursesData); // Debug log
                    if (coursesData.status === 'success' && coursesData.data) {
                        const coursesList = coursesData.data.data || coursesData.data || [];
                        console.log('Courses list:', coursesList); // Debug log
                        setCourses(coursesList);
                    }
                } else {
                    console.error('Failed to fetch courses:', coursesRes.status);
                }

            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err instanceof Error ? err.message : 'Failed to load unit data');
            } finally {
                setLoading(false);
                setCoursesLoading(false);
            }
        };

        if (unitId) {
            fetchData();
        }
    }, [unitId]);

    function validateForm(): boolean {
        const newErrors: Partial<Record<FormField, string>> = {};

        if (!formData.parentId.trim()) {
            newErrors.parentId = 'Please select a course';
        }
        if (!formData.title.trim()) {
            newErrors.title = 'Unit title is required';
        }
        if (!formData.imageUrl.trim()) {
            newErrors.imageUrl = 'Cover image is required';
        }
        if (!formData.previewUrl.trim()) {
            newErrors.previewUrl = 'Preview URL or file is required';
        }
        if (!formData.digitalUrl.trim()) {
            newErrors.digitalUrl = 'Digital URL or file is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSave() {
        if (!validateForm()) {
            return;
        }

        setSaving(true);
        setError('');

        try {
            const token = localStorage.getItem('token');

            const updateData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                price: formData.price,
                digitalUrl: formData.digitalUrl.trim(),
                previewUrl: formData.previewUrl.trim(),
                imageUrl: formData.imageUrl.trim(),
                parentId: formData.parentId, // This is the course ID
            };

            console.log('Updating unit with data:', updateData); // Debug log

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${unitId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updateData),
            });

            const data = await res.json();

            if (res.ok && data.status === 'success') {
                alert('Unit updated successfully!');
                router.push('/dashboard/course-manage/');
            } else {
                throw new Error(data.message || 'Failed to update unit');
            }
        } catch (err) {
            console.error('Error updating unit:', err);
            setError(err instanceof Error ? err.message : 'Failed to update unit');
            alert(err instanceof Error ? err.message : 'Failed to update unit');
        } finally {
            setSaving(false);
        }
    }

    const isFormValid =
        !!formData.parentId.trim() &&
        !!formData.title.trim() &&
        !!formData.imageUrl.trim() &&
        !!formData.previewUrl.trim() &&
        !!formData.digitalUrl.trim();

    if (loading) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading unit data...</p>
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
                <h1 className="text-2xl font-semibold">Unit Management</h1>
                <p className="text-sm text-gray-500">
                    Edit your unit information and settings.
                </p>
            </header>

            <section className="mt-10 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Edit Unit</h2>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Main Form */}
                    <div className="md:col-span-2 space-y-5">
                        {/* Select Course */}
                        <div data-field="parentId" className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Course <span className="text-red-500">*</span>
                            </label>
                            {coursesLoading ? (
                                <div className="w-full h-12 border border-gray-300 rounded-md flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-sky-500"></div>
                                    <span className="ml-2 text-sm text-gray-500">Loading courses...</span>
                                </div>
                            ) : (
                                <select
                                    value={formData.parentId}
                                    onChange={e => updateField('parentId', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                                >
                                    <option value="">-- Select Course --</option>
                                    {courses?.map(course => (
                                        <option key={course.id} value={course.id}>
                                            {course.title}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {errors.parentId && (
                                <p className="text-xs text-red-500 mt-1">{errors.parentId}</p>
                            )}
                        </div>

                        {/* Unit Title */}
                        <div data-field="title" className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Unit Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter unit title"
                                value={formData.title}
                                onChange={e => updateField('title', e.target.value)}
                                maxLength={255}
                                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                            />
                            <div className="flex justify-between items-center mt-1">
                                {errors.title && (
                                    <p className="text-xs text-red-500">{errors.title}</p>
                                )}
                                <p className="text-xs text-gray-500 ml-auto">
                                    {formData.title.length}/255
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        <div data-field="description" className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                rows={4}
                                placeholder="Describe what this unit covers..."
                                value={formData.description}
                                onChange={e => updateField('description', e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                            />
                        </div>

                        {/* Price */}
                        <div data-field="price" className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price
                            </label>
                            <div className="flex h-12 overflow-hidden rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-sky-400">
                                <div className="flex items-center justify-center bg-sky-500 px-4">
                                    <span className="text-white text-sm font-medium">$</span>
                                </div>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={formData.price === 0 ? '' : formData.price}
                                    min={0}
                                    step={0.01}
                                    onChange={e => updateField('price', parseFloat(e.target.value) || 0)}
                                    className="flex-1 px-4 py-2 text-sm placeholder-gray-500 outline-none border-none"
                                />
                            </div>
                        </div>

                        {/* Upload Preview File */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Preview File <span className="text-red-500">*</span>
                            </label>
                            <FileDropZone
                                label="Upload preview"
                                acceptedTypes="application/pdf"
                                onFileUpload={url => updateField('previewUrl', url)}
                            />
                            {formData.previewUrl && (
                                <p className="text-xs text-gray-500 mt-2 break-all">
                                    Current: {formData.previewUrl}
                                </p>
                            )}
                            {errors.previewUrl && (
                                <p className="text-xs text-red-500 mt-1">{errors.previewUrl}</p>
                            )}
                        </div>

                        {/* Upload Digital File */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Digital File <span className="text-red-500">*</span>
                            </label>
                            <FileDropZone
                                label="Upload digital"
                                acceptedTypes="application/pdf"
                                onFileUpload={url => updateField('digitalUrl', url)}
                            />
                            {formData.digitalUrl && (
                                <p className="text-xs text-gray-500 mt-2 break-all">
                                    Current: {formData.digitalUrl}
                                </p>
                            )}
                            {errors.digitalUrl && (
                                <p className="text-xs text-red-500 mt-1">{errors.digitalUrl}</p>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Cover Image */}
                        <div data-field="imageUrl">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Unit Cover Image <span className="text-red-500">*</span>
                            </label>
                            <ImageDropZone
                                currentImageUrl={formData.imageUrl}
                                onImageUpload={url => updateField('imageUrl', url)}
                            />
                            {errors.imageUrl && (
                                <p className="text-xs text-red-500 mt-1">{errors.imageUrl}</p>
                            )}
                        </div>

                        {/* Live Preview */}
                        {(formData.title || formData.imageUrl) && (
                            <div className="bg-gray-50 border rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Preview:</h3>
                                <div className="bg-white rounded-lg border p-3 shadow-sm">
                                    {formData.imageUrl && (
                                        <div className="relative w-full h-32 mb-3">
                                            <Image
                                                src={formData.imageUrl}
                                                alt="Unit preview"
                                                fill
                                                className="object-cover rounded"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}
                                    <h4 className="font-medium text-gray-900 text-sm">
                                        {formData.title || 'Unit Title'}
                                    </h4>
                                    {formData.price > 0 && (
                                        <p className="text-sm text-green-600 font-medium mt-1">
                                            ${formData.price.toFixed(2)}
                                        </p>
                                    )}
                                    {formData.description && (
                                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                                            {formData.description.replace(/<[^>]*>/g, '').substring(0, 80)}
                                            {formData.description.length > 80 && '...'}
                                        </p>
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
                        disabled={saving}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving || !isFormValid}
                        className={`rounded-md px-8 py-2 text-sm font-medium transition-colors ${saving || !isFormValid
                            ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                            : 'bg-sky-500 hover:bg-sky-600 text-white'
                            }`}
                    >
                        {saving ? 'Updating...' : 'Update Unit'}
                    </button>
                </div>
            </section>
        </div>
    );
}