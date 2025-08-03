// app/(dashboard)/course-manage/products/lesson/[lessonId]/edit/page.tsx
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

interface ParentOption {
    id: string;
    title: string;
    type: string;
    parentId?: string;
    parentTitle?: string;
}

export default function EditLessonPage() {
    const router = useRouter();
    const params = useParams();

    // Debug params - extract lessonId properly
    console.log('🔧 All params:', params);
    console.log('🔧 typeof params:', typeof params);
    console.log('🔧 Object.keys(params):', Object.keys(params));

    // Try different ways to get the lesson ID
    const lessonId = params.lessonId || params.lesson || params.id || (typeof params === 'string' ? params : undefined);
    console.log('🎯 Extracted lessonId:', lessonId);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [digitalUrl, setDigitalUrl] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [colorButton, setColorButton] = useState('#3E724A');
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [parentId, setParentId] = useState('');
    const [isFreeLesson, setIsFreeLesson] = useState(false);

    // Parent options (units and subunits)
    const [parentOptions, setParentOptions] = useState<ParentOption[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch parent options and existing lesson data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('🔍 Starting to fetch lesson data for ID:', lessonId);
                console.log('🔑 Token exists:', !!token);

                // Fetch existing lesson data
                const lessonRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${lessonId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log('📡 Response status:', lessonRes.status);
                console.log('📡 Response ok:', lessonRes.ok);

                if (!lessonRes.ok) {
                    const errorText = await lessonRes.text();
                    console.error('❌ API Error Response:', errorText);
                    throw new Error(`Failed to fetch lesson data: ${lessonRes.status} ${errorText}`);
                }

                const lessonData = await lessonRes.json();
                console.log('📦 Lesson data received:', lessonData);

                if (lessonData.status === 'success' && lessonData.data) {
                    const lesson = lessonData.data;
                    console.log('✅ Processing lesson:', lesson);

                    setTitle(lesson.title || '');
                    setPrice(parseFloat(lesson.price) || 0);
                    setDigitalUrl(lesson.digitalUrl || '');
                    setPreviewUrl(lesson.previewUrl || '');
                    setColorButton(lesson.colorButton || '#3E724A');
                    setImageUrl(lesson.imageUrl || '');
                    setParentId(lesson.parentId || '');
                    setIsFreeLesson(lesson.isFreeLesson || false);

                    // Handle tags and description migration
                    let cleanDescription = lesson.description || '';
                    let extractedTags: string[] = [];

                    // If tags exist in the tags field, use them
                    if (lesson.tags && Array.isArray(lesson.tags) && lesson.tags.length > 0) {
                        extractedTags = lesson.tags;
                        setDescription(cleanDescription);
                        console.log('🏷️ Using existing tags from JSON field:', extractedTags);
                    } else {
                        // Otherwise, try to extract tags from description (legacy data)
                        const tagMatch = cleanDescription.match(/\n\nTags: (.+)$/);
                        if (tagMatch) {
                            const tagString = tagMatch[1];
                            extractedTags = tagString.split(' - ').map((tag: string) => tag.trim()).filter((tag: string) => tag);
                            // Remove tags from description
                            cleanDescription = cleanDescription.replace(/\n\nTags: .+$/, '');
                            console.log('🏷️ Extracted tags from description:', extractedTags);
                        }
                        setDescription(cleanDescription);
                    }

                    setTags(extractedTags);
                } else {
                    console.error('❌ Invalid lesson data format:', lessonData);
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
                    console.log('📚 Units response:', unitsData);

                    // Handle different response structures
                    let unitsList = [];
                    if (unitsData.status === 'success' && unitsData.data) {
                        // If data has pagination structure
                        unitsList = unitsData.data.data || unitsData.data;
                    } else if (Array.isArray(unitsData.data)) {
                        // If data is direct array
                        unitsList = unitsData.data;
                    } else if (Array.isArray(unitsData)) {
                        // If response is direct array
                        unitsList = unitsData;
                    }

                    console.log('📚 Units list:', unitsList);

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
                    console.log('📑 Subunits response:', subunitsData);

                    // Handle different response structures
                    let subunitsList = [];
                    if (subunitsData.status === 'success' && subunitsData.data) {
                        // If data has pagination structure
                        subunitsList = subunitsData.data.data || subunitsData.data;
                    } else if (Array.isArray(subunitsData.data)) {
                        // If data is direct array
                        subunitsList = subunitsData.data;
                    } else if (Array.isArray(subunitsData)) {
                        // If response is direct array
                        subunitsList = subunitsData;
                    }

                    console.log('📑 Subunits list:', subunitsList);

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
                console.log('🏁 Setting loading to false');
                setLoading(false);
            }
        };

        console.log('🚀 useEffect triggered with lessonId:', lessonId);
        if (lessonId) {
            fetchData();
        } else {
            console.log('❌ No lessonId provided');
            setLoading(false);
        }
    }, [lessonId]);

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
                description: description.trim(), // Clean description without tags
                price: price,
                digitalUrl: digitalUrl.trim(),
                previewUrl: previewUrl.trim(),
                colorButton,
                imageUrl: imageUrl.trim(),
                tags: tags.filter(tag => tag.trim() !== ''), // This will go to the JSON tags field
                parentId: parentId || null, // Parent unit/subunit ID
                isFreeLesson,
            };

            // Validate required fields
            if (!updateData.title) {
                throw new Error('Lesson title is required');
            }

            console.log('Updating lesson with data:', updateData); // Debug log

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
            setLoading(false);
        }
    };

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
                <h1 className="text-2xl font-semibold">Lesson Management</h1>
                <p className="text-sm text-gray-500">
                    Edit your lesson information and settings.
                </p>
            </header>

            <section className="space-y-6">
                <h2 className="text-lg font-semibold">Edit Lesson</h2>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="md:col-span-2 space-y-5">
                            {/* Parent Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Parent Unit/Subunit
                                </label>
                                <select
                                    value={parentId}
                                    onChange={(e) => setParentId(e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                                >
                                    <option value="">Select a parent unit or subunit (optional)</option>
                                    {parentOptions.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.type === 'UNIT' ? '📚' : '📑'} {option.title}
                                            {option.parentTitle && ` (in ${option.parentTitle})`}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">Choose which unit or subunit this lesson belongs to</p>
                            </div>

                            {/* Lesson Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Lesson Title *
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter lesson title"
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
                                    placeholder="Describe your lesson content and learning objectives..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full resize-none rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                                />
                            </div>

                            {/* Free Lesson Toggle */}
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="isFreeLesson"
                                    checked={isFreeLesson}
                                    onChange={(e) => setIsFreeLesson(e.target.checked)}
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
                                            : "Type a tag and press Enter or comma"
                                    }
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ',') {
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
                                            {isFreeLesson ? 'Access Free' : 'Buy Now'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Price (only if not free lesson) */}
                            {!isFreeLesson && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Lesson Price (USD)
                                    </label>
                                    <div className="flex h-12 overflow-hidden rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-sky-400">
                                        <div className="flex-shrink-0 flex items-center justify-center border-2 border-sky-500 bg-sky-100 px-4 m-2 rounded-md">
                                            <span className="text-sky-500 text-sm font-bold">$</span>
                                        </div>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            placeholder="0.00 (price for this lesson)"
                                            value={price || ''}
                                            onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                                            className="flex-1 px-4 py-2 text-sm placeholder:text-gray-500 outline-none border-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Individual lesson pricing</p>
                                </div>
                            )}

                            {/* Preview URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Preview Lesson Content URL
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
                                        placeholder="Preview Lesson Content URL"
                                        value={previewUrl}
                                        onChange={(e) => setPreviewUrl(e.target.value)}
                                        className="flex-1 h-full px-4 text-sm placeholder:text-gray-600 outline-none"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Link for free preview/demo of your lesson</p>
                            </div>

                            {/* Digital URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Access Link After Purchase
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://your-platform.com/lesson-access"
                                    value={digitalUrl}
                                    onChange={(e) => setDigitalUrl(e.target.value)}
                                    className="h-12 w-full rounded-lg border border-gray-300 px-5 text-sm placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-sky-400"
                                />
                                <p className="text-xs text-gray-500 mt-1">Link where students can access the lesson content after purchase</p>
                            </div>
                        </div>

                        {/* Image Upload Section */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Lesson Image
                                </label>
                                <ImageDropZone
                                    currentImageUrl={imageUrl}
                                    onImageUpload={handleImageUpload}
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Upload an image for your lesson. Recommended size: 800x600px
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