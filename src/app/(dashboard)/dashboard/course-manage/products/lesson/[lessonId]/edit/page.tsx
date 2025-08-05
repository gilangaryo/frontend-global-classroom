'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ImageDropZone from '@/app/(dashboard)/dashboard/components/ImageDropZone';
// import DashboardTabs from "../../components/DashboardTabs";
import TiptapEditor from "../../../../../components/TiptapEditor";
import Image from "next/image";

function isColorDark(hex: string): boolean {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
}

interface ParentOption {
    id: string;
    title: string;
    type: string;
    parentId?: string;
    parentTitle?: string;
}

interface LessonMetadata {
    learningActivities?: string;
    [key: string]: string | undefined;
}

interface FormData {
    title: string;
    description: string;
    price: number;
    digitalUrl: string;
    previewUrl: string;
    colorButton: string;
    imageUrl: string;
    parentId: string;
    isFreeLesson: boolean;
    learningActivities: string;
}

type FormField = keyof FormData;
type FormValue = string | number | boolean;

export default function EditLessonPage() {
    const router = useRouter();
    const { lessonId } = useParams<{ lessonId: string }>();

    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        price: 0,
        digitalUrl: '',
        previewUrl: '',
        colorButton: '#3E724A',
        imageUrl: '',
        parentId: '',
        isFreeLesson: false,
        learningActivities: '',
    });

    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');

    // Parent options (units and subunits)
    const [parentOptions, setParentOptions] = useState<ParentOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [parentOptionsLoading, setParentOptionsLoading] = useState(true);
    const [error, setError] = useState('');

    const updateField = (field: FormField, value: FormValue) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Fetch parent options and existing lesson data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                setParentOptionsLoading(true);

                // Fetch existing lesson data
                const lessonRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${lessonId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!lessonRes.ok) {
                    throw new Error(`Failed to fetch lesson data: ${lessonRes.status}`);
                }

                const lessonData = await lessonRes.json();
                console.log('📦 Lesson data received:', lessonData);

                if (lessonData.status === 'success' && lessonData.data) {
                    const lesson = lessonData.data;

                    if (lesson.type !== 'LESSON') {
                        throw new Error('This product is not a lesson');
                    }

                    // Parse metadata JSON for learningActivities
                    let metadata: LessonMetadata = {};
                    try {
                        if (lesson.metadata && typeof lesson.metadata === 'string') {
                            metadata = JSON.parse(lesson.metadata) as LessonMetadata;
                        } else if (lesson.metadata && typeof lesson.metadata === 'object') {
                            metadata = lesson.metadata as LessonMetadata;
                        }
                    } catch (e) {
                        console.warn('Failed to parse metadata JSON:', e);
                        metadata = {};
                    }

                    setFormData({
                        title: lesson.title || '',
                        description: lesson.description || '',
                        price: parseFloat(lesson.price) || 0,
                        digitalUrl: lesson.digitalUrl || '',
                        previewUrl: lesson.previewUrl || '',
                        colorButton: lesson.colorButton || '#3E724A',
                        imageUrl: lesson.imageUrl || '',
                        parentId: lesson.parentId || '',
                        isFreeLesson: lesson.isFreeLesson || false,
                        learningActivities: metadata.learningActivities || '',
                    });

                    // Handle tags
                    let extractedTags: string[] = [];
                    if (lesson.tags && Array.isArray(lesson.tags) && lesson.tags.length > 0) {
                        extractedTags = lesson.tags;
                    } else {
                        // Try to extract tags from description (legacy data)
                        const tagMatch = lesson.description?.match(/\n\nTags: (.+)$/);
                        if (tagMatch) {
                            const tagString = tagMatch[1];
                            extractedTags = tagString.split(' - ').map((tag: string) => tag.trim()).filter((tag: string) => tag);
                        }
                    }
                    setTags(extractedTags);
                } else {
                    throw new Error(lessonData.message || 'Invalid response format');
                }

                // Fetch available units and subunits for parent selection
                const [unitsRes, subunitsRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products?type=UNIT&isActive=true`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products?type=SUBUNIT&isActive=true`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    })
                ]);

                const options: ParentOption[] = [];

                // Add units
                if (unitsRes.ok) {
                    const unitsData = await unitsRes.json();
                    let unitsList = [];
                    if (unitsData.status === 'success' && unitsData.data) {
                        unitsList = unitsData.data.data || unitsData.data;
                    } else if (Array.isArray(unitsData.data)) {
                        unitsList = unitsData.data;
                    } else if (Array.isArray(unitsData)) {
                        unitsList = unitsData;
                    }

                    unitsList.forEach((unit: {
                        id: string;
                        title: string;
                        parentTitle?: string;
                    }) => {
                        options.push({
                            id: unit.id,
                            title: unit.title,
                            type: 'UNIT',
                            parentTitle: unit.parentTitle || 'No Course'
                        });
                    });
                }

                // Add subunits
                if (subunitsRes.ok) {
                    const subunitsData = await subunitsRes.json();
                    let subunitsList = [];
                    if (subunitsData.status === 'success' && subunitsData.data) {
                        subunitsList = subunitsData.data.data || subunitsData.data;
                    } else if (Array.isArray(subunitsData.data)) {
                        subunitsList = subunitsData.data;
                    } else if (Array.isArray(subunitsData)) {
                        subunitsList = subunitsData;
                    }

                    subunitsList.forEach((subunit: {
                        id: string;
                        title: string;
                        parentId?: string;
                        parentTitle?: string;
                    }) => {
                        options.push({
                            id: subunit.id,
                            title: subunit.title,
                            type: 'SUBUNIT',
                            parentId: subunit.parentId,
                            parentTitle: subunit.parentTitle || 'Unknown Unit'
                        });
                    });
                }

                console.log('🔗 Final parent options:', options);
                setParentOptions(options);

            } catch (err) {
                console.error('💥 Error fetching data:', err);
                setError(err instanceof Error ? err.message : 'Failed to load lesson data');
            } finally {
                setLoading(false);
                setParentOptionsLoading(false);
            }
        };

        if (lessonId) {
            fetchData();
        }
    }, [lessonId]);

    const handleAddTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 10) {
            setTags([...tags, newTag.trim()]);
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSave = async () => {
        if (!formData.parentId) {
            alert('Please select a parent unit or subunit!');
            return;
        }

        if (!formData.title.trim()) {
            alert('Please enter a lesson title');
            return;
        }

        if (formData.title.trim().length < 3) {
            alert('Title must be at least 3 characters long!');
            return;
        }

        setSaving(true);
        setError('');

        try {
            const token = localStorage.getItem('token');

            // Prepare metadata object with proper typing
            const metadata: LessonMetadata = {
                learningActivities: formData.learningActivities
            };

            const updateData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                price: formData.price,
                digitalUrl: formData.digitalUrl.trim(),
                previewUrl: formData.previewUrl.trim(),
                colorButton: formData.colorButton,
                imageUrl: formData.imageUrl.trim(),
                tags: tags.filter(tag => tag.trim() !== ''),
                parentId: formData.parentId,
                isFreeLesson: formData.isFreeLesson,
                metadata: JSON.stringify(metadata), // Send as JSON string
            };

            console.log('Updating lesson with data:', updateData);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${lessonId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updateData),
            });

            const data = await res.json();

            if (res.ok && data.status === 'success') {
                alert('Lesson updated successfully!');
                router.push('/dashboard/course-manage/');
            } else {
                throw new Error(data.message || 'Failed to update lesson');
            }
        } catch (err) {
            console.error('Error updating lesson:', err);
            setError(err instanceof Error ? err.message : 'Failed to update lesson');
            alert(err instanceof Error ? err.message : 'Failed to update lesson');
        } finally {
            setSaving(false);
        }
    };

    const isFormValid = formData.parentId !== "" && formData.title.trim().length >= 3;

    if (loading) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading lesson data...</p>
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
            <header className="space-y-1">
                <h1 className="text-2xl font-semibold">Lesson Management</h1>
                <p className="text-sm text-gray-500">
                    Edit your lesson information and settings.
                </p>
            </header>

            {/* <DashboardTabs /> */}

            <section className="mt-10 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Edit Lesson</h2>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-5">
                        {/* Parent Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Parent Unit/Subunit <span className="text-red-500">*</span>
                            </label>
                            {parentOptionsLoading ? (
                                <div className="w-full h-12 border border-gray-300 rounded-md flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-sky-500"></div>
                                    <span className="ml-2 text-sm text-gray-500">Loading parent options...</span>
                                </div>
                            ) : (
                                <select
                                    value={formData.parentId}
                                    onChange={(e) => updateField('parentId', e.target.value)}
                                    className={`w-full rounded-md border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400 ${!formData.parentId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                        }`}
                                    required
                                >
                                    <option value="">-- Select Parent Unit/Subunit --</option>
                                    {parentOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.type === 'UNIT' ? '📚' : '📑'} {option.title}
                                            {option.parentTitle && ` (in ${option.parentTitle})`}
                                        </option>
                                    ))}
                                </select>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                                {formData.parentId
                                    ? `This lesson belongs to: ${parentOptions.find(p => p.id === formData.parentId)?.title || 'Selected parent'}`
                                    : 'Choose which unit or subunit this lesson belongs to'
                                }
                            </p>
                            {!formData.parentId && (
                                <p className="text-xs text-red-500 mt-1">Please select a parent unit or subunit</p>
                            )}
                        </div>

                        {/* Lesson Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Lesson Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter lesson title (minimum 3 characters)"
                                value={formData.title}
                                onChange={(e) => updateField('title', e.target.value)}
                                className={`w-full rounded-md border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400 ${formData.title.trim().length > 0 && formData.title.trim().length < 3
                                    ? 'border-red-300 bg-red-50'
                                    : !formData.title.trim()
                                        ? 'border-red-300 bg-red-50'
                                        : 'border-gray-300'
                                    }`}
                                required
                                maxLength={255}
                            />
                            <div className="flex justify-between items-center mt-1">
                                {formData.title.trim().length > 0 && formData.title.trim().length < 3 && (
                                    <p className="text-xs text-red-500">Title must be at least 3 characters</p>
                                )}
                                {!formData.title.trim() && (
                                    <p className="text-xs text-red-500">Title is required</p>
                                )}
                                <p className="text-xs text-gray-500 ml-auto">{formData.title.length}/255</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                rows={5}
                                placeholder="Describe your lesson content and learning objectives..."
                                value={formData.description}
                                onChange={(e) => updateField('description', e.target.value)}
                                className="w-full resize-none rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                            />
                        </div>

                        {/* Learning Activities with TiptapEditor */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Learning Activities
                            </label>
                            <TiptapEditor
                                content={formData.learningActivities}
                                onChange={(value) => updateField('learningActivities', value)}
                                placeholder="Write the learning activities using formatting..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                You can format lists, bold, links, etc. for learning activities
                            </p>
                        </div>

                        {/* Free Lesson Toggle */}
                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                id="isFreeLesson"
                                checked={formData.isFreeLesson}
                                onChange={(e) => updateField('isFreeLesson', e.target.checked)}
                                className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isFreeLesson" className="text-sm font-medium text-gray-700">
                                This is a free lesson
                            </label>
                        </div>

                        {/* Tags Management */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Lesson Tags
                            </label>

                            {/* Tags Display */}
                            <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border border-gray-300 rounded-md bg-gray-50">
                                {tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-sky-700 bg-sky-100 rounded-full animate-in fade-in duration-200"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="ml-1 text-sky-500 hover:text-sky-700 hover:bg-sky-200 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                                            title="Remove tag"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                                {tags.length === 0 && (
                                    <span className="text-gray-400 text-sm">No tags added yet</span>
                                )}
                            </div>

                            {/* Tag Input */}
                            <input
                                type="text"
                                placeholder={
                                    tags.length >= 10
                                        ? "Maximum 10 tags reached"
                                        : "Type a tag and press Enter "
                                }
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddTag();
                                    } else if (e.key === 'Backspace' && newTag === '' && tags.length > 0) {
                                        handleRemoveTag(tags[tags.length - 1]);
                                    }
                                }}
                                disabled={tags.length >= 10}
                                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />

                            {/* Suggested Tags */}
                            {tags.length < 10 && (
                                <div className="space-y-2">
                                    <p className="text-xs text-gray-500">Suggested tags (click to add):</p>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            "Beginner", "Intermediate", "Advanced",
                                            "Introduction", "Practical", "Theory",
                                            "Hands-on", "Case Study", "Exercise",
                                            "Quiz", "Review", "Summary"
                                        ].filter(tag => !tags.includes(tag)).slice(0, 12).map((tag) => (
                                            <button
                                                key={tag}
                                                type="button"
                                                onClick={() => {
                                                    if (tags.length < 10 && !tags.includes(tag)) {
                                                        setTags([...tags, tag]);
                                                    }
                                                }}
                                                className="px-2 py-1 text-xs text-gray-600 bg-gray-200 rounded hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                                            >
                                                + {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="text-xs text-gray-500">
                                Tags: {tags.length}/10 | Tags will be stored in the tags field (JSON)
                            </div>
                        </div>

                        {/* Color Button */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Button Color Theme
                            </label>
                            <div className="flex items-center gap-4 border border-gray-300 rounded-lg px-4 py-2 h-12">
                                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: formData.colorButton }} />
                                <label className="text-sm text-gray-600 whitespace-nowrap">
                                    Change Color Template (for button)
                                </label>
                                <input
                                    type="color"
                                    value={formData.colorButton}
                                    onChange={(e) => updateField('colorButton', e.target.value)}
                                    className="ml-auto h-6 w-6 border-none cursor-pointer bg-transparent"
                                />
                            </div>

                            {/* Live Button Preview */}
                            <div className="pt-2">
                                <label className="text-sm text-gray-600">Live Button Preview:</label>
                                <div className="mt-2">
                                    <button
                                        type="button"
                                        className={`px-8 py-3 rounded-lg font-semibold hover:opacity-90 ${isColorDark(formData.colorButton) ? 'text-white' : 'text-black'
                                            }`}
                                        style={{ backgroundColor: formData.colorButton }}
                                    >
                                        {formData.isFreeLesson ? 'Access Free' : 'Buy Now'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Price (only if not free lesson) */}
                        {!formData.isFreeLesson && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price
                                </label>
                                <div className="flex h-12 overflow-hidden rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-sky-400">
                                    <div className="flex-shrink-0 flex items-center justify-center bg-sky-500 px-4">
                                        <span className="text-white text-sm font-medium">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.price || ''}
                                        min="0"
                                        step="0.01"
                                        onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)}
                                        className="flex-1 px-4 py-2 text-sm placeholder:text-gray-500 outline-none border-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Leave as 0 if this lesson should be free
                                </p>
                            </div>
                        )}

                        {/* Preview URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Preview Content URL
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
                                    placeholder="https://example.com/lesson-preview"
                                    value={formData.previewUrl}
                                    onChange={(e) => updateField('previewUrl', e.target.value)}
                                    className="flex-1 h-full px-4 text-sm placeholder:text-gray-600 outline-none"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Link to preview content or demo version for users to see before purchasing
                            </p>
                        </div>

                        {/* Digital URL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Digital Content URL
                            </label>
                            <div className="flex h-12 overflow-hidden rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-sky-400">
                                <span className="flex w-12 items-center justify-center text-gray-700">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                </span>
                                <input
                                    type="url"
                                    placeholder="https://example.com/lesson-content"
                                    value={formData.digitalUrl}
                                    onChange={(e) => updateField('digitalUrl', e.target.value)}
                                    className="flex-1 h-full px-4 text-sm placeholder:text-gray-600 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Lesson Cover Image
                            </label>
                            <ImageDropZone
                                currentImageUrl={formData.imageUrl}
                                onImageUpload={(url) => updateField('imageUrl', url)}
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Upload an image to represent this lesson
                            </p>
                        </div>

                        {/* Preview Card */}
                        {(formData.title || formData.imageUrl || tags.length > 0) && (
                            <div className="bg-gray-50 border rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Preview:</h3>
                                <div className="bg-white rounded-lg border p-3 shadow-sm">
                                    {formData.imageUrl && (
                                        <div className="relative w-full h-32 mb-3">
                                            <Image
                                                src={formData.imageUrl}
                                                alt="Lesson preview"
                                                fill
                                                className="object-cover rounded"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}
                                    <h4 className="font-medium text-gray-900 text-sm">
                                        {formData.title || 'Lesson Title'}
                                    </h4>
                                    {!formData.isFreeLesson && formData.price > 0 && (
                                        <p className="text-sm text-green-600 font-medium mt-1">
                                            ${formData.price.toFixed(2)}
                                        </p>
                                    )}
                                    {formData.isFreeLesson && (
                                        <p className="text-sm text-blue-600 font-medium mt-1">
                                            Free Lesson
                                        </p>
                                    )}
                                    {formData.description && (
                                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                                            {formData.description.replace(/<[^>]*>/g, '').substring(0, 80)}...
                                        </p>
                                    )}
                                    {tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {tags.slice(0, 3).map((tag, index) => (
                                                <span key={index} className="px-2 py-1 text-xs bg-sky-100 text-sky-700 rounded">
                                                    {tag}
                                                </span>
                                            ))}
                                            {tags.length > 3 && (
                                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded">
                                                    +{tags.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    {formData.learningActivities && (
                                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                                            <strong>Learning Activities:</strong>
                                            <div
                                                className="mt-1 text-gray-600"
                                                dangerouslySetInnerHTML={{
                                                    __html: formData.learningActivities.substring(0, 100) + '...'
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 pt-6 border-t">
                    <button
                        type="button"
                        className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => router.push('/dashboard/course-manage')}
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
                        {saving ? (
                            <span className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Saving...
                            </span>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </section>
        </div>
    );
}