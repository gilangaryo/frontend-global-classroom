'use client';

import DashboardTabs from "../../components/DashboardTabs";
import ImageDropZone from "../../components/ImageDropZone";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";

interface CreateFreeLessonData {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
}

export default function AddFreeLessonPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    imageUrl: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Create free lesson function
  const createFreeLesson = async (data: CreateFreeLessonData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/free-lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create free lesson');
      }

      return result.data;
    } catch (error) {
      console.error('Error creating free lesson:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a lesson title');
      return;
    }

    if (formData.title.trim().length < 3) {
      alert('Title must be at least 3 characters long!');
      return;
    }

    if (!formData.description.trim()) {
      alert('Please enter a description');
      return;
    }

    if (!formData.url.trim()) {
      alert('Please enter a URL for the free lesson');
      return;
    }

    if (!formData.imageUrl.trim()) {
      alert('Please upload a cover image');
      return;
    }

    try {
      setLoading(true);

      const freeLessonData: CreateFreeLessonData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        url: formData.url.trim(),
        imageUrl: formData.imageUrl.trim(),
      };

      await createFreeLesson(freeLessonData);
      alert('Free lesson created successfully!');

      // Reset form
      setFormData({
        title: '',
        description: '',
        url: '',
        imageUrl: '',
      });

      router.push('/dashboard/course-manage');

    } catch (error) {
      console.error('Error creating lesson:', error);
      alert(error instanceof Error ? error.message : 'Failed to create lesson');
    } finally {
      setLoading(false);
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

  const isFormValid =
    formData.title.trim().length >= 3 &&
    formData.description.trim() &&
    formData.url.trim() &&
    formData.imageUrl.trim();

  return (
    <div className="p-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Free Lesson Management</h1>
        <p className="text-sm text-gray-500">
          Add a new free lesson.
        </p>
      </header>

      <DashboardTabs />

      <section className="mt-10 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add Free Lesson</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-5">
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
                <p className="text-xs text-gray-500 ml-auto">{formData.title.length}/255</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={6}
                placeholder="Describe what this lesson covers..."
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                className="w-full rounded-md border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            {/* URL Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lesson URL <span className="text-red-500">*</span>
              </label>
              <div className="flex h-12 overflow-hidden rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-sky-400">
                <span className="flex w-12 items-center justify-center text-gray-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </span>
                <input
                  type="url"
                  placeholder="https://example.com/free-lesson"
                  value={formData.url}
                  onChange={(e) => updateField('url', e.target.value)}
                  className={`flex-1 h-full px-4 text-sm placeholder:text-gray-600 outline-none ${!formData.url.trim() ? 'bg-red-50' : ''
                    }`}
                  required
                />
              </div>
              {formData.url.trim() && !isValidUrl(formData.url.trim()) && (
                <p className="text-xs text-red-500 mt-1">Please enter a valid URL</p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Free Lesson Image <span className="text-red-500">*</span>
              </label>
              <ImageDropZone
                currentImageUrl={formData.imageUrl}
                onImageUpload={(url) => updateField('imageUrl', url)}
              />
              {!formData.imageUrl.trim() && (
                <p className="text-xs text-red-500 mt-1">Cover image is required</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Upload an image to represent this lesson
              </p>
            </div>

            {/* Preview Card */}
            {(formData.title || formData.imageUrl) && (
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
                  <p className="text-sm text-blue-600 font-medium mt-1">
                    Free Lesson
                  </p>
                  {formData.description && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                      {formData.description.replace(/<[^>]*>/g, '').substring(0, 80)}...
                    </p>
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
              'Create Free Lesson'
            )}
          </button>
        </div>
      </section>
    </div>
  );
}