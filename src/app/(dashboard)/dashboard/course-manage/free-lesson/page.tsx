'use client';

import DashboardTabs from "../../components/DashboardTabs";
import ImageDropZone from "../../components/ImageDropZone";
import TiptapEditor from '../../components/TiptapEditor';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProducts, useProductActions, CreateProductData } from '../../../../../hooks/useProducts';
import Image from "next/image";
interface CreateLessonData extends CreateProductData {
  tags?: string[];
}

export default function AddLessonPage() {
  const router = useRouter();

  // Using our unified hooks system
  const { createProduct, loading } = useProductActions();
  const { products: units, loading: unitsLoading } = useProducts({ type: 'UNIT' });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    digitalUrl: '',
    previewUrl: '',
    imageUrl: '',
    parentId: '',
    isFreeLesson: false,
  });

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const suggestedTags = [
    "9th", "10th", "11th", "12th",
    "Adult Education", "Higher Education",
    "AP", "IB", "IGCSE",
    "Beginner", "Intermediate", "Advanced",
    "Case Study", "Group Work", "Individual Work",
    "Critical Thinking", "Writing Practice",
    "Geography", "History", "Economics",
    "Mathematics", "Science", "English",
    "Introduction", "Practical", "Theory"
  ];

  const updateField = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
      setTags([...tags, trimmedTag]);
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleSave = async () => {
    if (!formData.parentId) {
      alert('Please select a unit!');
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

    // Create the lesson data - tags go to the tags field, NOT description
    const lessonData: CreateLessonData = {
      ...formData,
      ProductType: 'LESSON',
      tags: tags,
    };

    const result = await createProduct(lessonData);

    if (result) {
      alert('Lesson created successfully!');

      // Reset form
      setFormData({
        title: '',
        description: '',
        price: 0,
        digitalUrl: '',
        previewUrl: '',
        imageUrl: '',
        parentId: '',
        isFreeLesson: false,
      });
      setTags([]);
      setTagInput('');

      router.push('/dashboard/course-manage');
    }
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const isFormValid = formData.parentId !== "" && formData.title.trim().length >= 3;

  return (
    <div className="p-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Lesson Management</h1>
        <p className="text-sm text-gray-500">
          Add a new lesson to your course content.
        </p>
      </header>

      <DashboardTabs />

      <section className="mt-10 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add Lesson</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-5">
            {/* Unit Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Unit <span className="text-red-500">*</span>
              </label>
              {unitsLoading ? (
                <div className="w-full h-12 border border-gray-300 rounded-md flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-sky-500"></div>
                  <span className="ml-2 text-sm text-gray-500">Loading units...</span>
                </div>
              ) : (
                <select
                  value={formData.parentId}
                  onChange={(e) => updateField('parentId', e.target.value)}
                  className={`w-full rounded-md border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400 ${!formData.parentId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  required
                >
                  <option value="">-- Select Unit --</option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.title}
                    </option>
                  ))}
                </select>
              )}
              {!formData.parentId && (
                <p className="text-xs text-red-500 mt-1">Please select a unit</p>
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
              <TiptapEditor
                content={formData.description}
                onChange={(value) => updateField('description', value)}
                placeholder="Describe what this lesson covers..."
              />
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

            {/* Tags Input Section - FIXED VERSION */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Tags (Optional)
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
                      onClick={() => removeTag(tag)}
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
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                disabled={tags.length >= 10}
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />

              {/* Suggested Tags */}
              {suggestedTags.filter(tag => !tags.includes(tag)).length > 0 && tags.length < 10 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">Suggested tags (click to add):</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags.filter(tag => !tags.includes(tag)).slice(0, 15).map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addTag(tag)}
                        className="px-2 py-1 text-xs text-gray-600 bg-gray-200 rounded hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                      >
                        + {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500">
                Tags: {tags.length}/10 | Will be stored in the tags JSON field
              </div>
            </div>

            {/* Price (only if not free lesson) */}
            {!formData.isFreeLesson && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (Optional)
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
                Preview Content URL (Optional)
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
              {formData.previewUrl.trim() && !isValidUrl(formData.previewUrl.trim()) && (
                <p className="text-xs text-red-500 mt-1">Please enter a valid preview URL</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Link to preview content or demo version for users to see before purchasing
              </p>
            </div>

            {/* Digital URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Digital Content URL (Optional)
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
              {formData.digitalUrl.trim() && !isValidUrl(formData.digitalUrl.trim()) && (
                <p className="text-xs text-red-500 mt-1">Please enter a valid digital URL</p>
              )}
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
            {loading ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </span>
            ) : (
              'Create Lesson'
            )}
          </button>
        </div>
      </section>
    </div>
  );
}