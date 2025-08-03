'use client';

import DashboardTabs from "../../components/DashboardTabs";
import ImageDropZone from "../../components/ImageDropZone";
import TiptapEditor from '../../components/TiptapEditor';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCourseActions, CreateCourseData } from '../../hooks/useProducts';

function isColorDark(hex: string): boolean {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}

interface FormData {
  title: string;
  description: string;
  courseIncluded: string;
  price: number;
  digitalUrl: string;
  previewUrl: string;
  imageUrl: string;
  colorButton: string;
}

type FormField = keyof FormData;
type FormValue = string | number;

export default function AddCoursePage() {
  const router = useRouter();
  const { createCourse, loading } = useCourseActions();

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    courseIncluded: '',
    price: 0,
    digitalUrl: '',
    previewUrl: '',
    imageUrl: '',
    colorButton: '#3E724A',
  });

  const updateField = (field: FormField, value: FormValue) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a course title');
      return;
    }

    const courseData: CreateCourseData = {
      ...formData,
      ProductType: 'COURSE',
    };

    const result = await createCourse(courseData);

    if (result) {
      alert('Course created successfully!');
      router.push('/dashboard/course-manage');
    }
  };

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
        <p className="text-sm text-gray-500">
          Add/Edit your course, unit, sub‑unit, and lesson.
        </p>
      </header>

      <DashboardTabs />

      <section className="mt-10 space-y-6">
        <h2 className="text-lg font-semibold">Add Course</h2>

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
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Description
              </label>
              <TiptapEditor
                content={formData.description}
                onChange={(value) => updateField('description', value)}
                placeholder="Add course description and content..."
              />
            </div>

            {/* Course Included */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's Included in This Course
              </label>
              <TiptapEditor
                content={formData.courseIncluded}
                onChange={(value) => updateField('courseIncluded', value)}
                placeholder="List what students will get (e.g., videos, exercises, certificates)..."
              />
            </div>

            {/* Color Theme */}
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
                    className={`mb-4 px-8 py-3 rounded-lg font-semibold hover:opacity-90 ${isColorDark(formData.colorButton) ? 'text-white' : 'text-black'
                      }`}
                    style={{ backgroundColor: formData.colorButton }}
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
                  placeholder="0.00 (price for all units)"
                  value={formData.price || ''}
                  onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)}
                  className="flex-1 px-4 py-2 text-sm placeholder:text-gray-500 outline-none border-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="0"
                  step="0.01"
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
                  value={formData.previewUrl}
                  onChange={(e) => updateField('previewUrl', e.target.value)}
                  className="flex-1 h-full px-4 text-sm placeholder:text-gray-600 outline-none"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Link for free preview/demo of your course</p>
            </div>

            {/* Digital Product URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Link After Purchase
              </label>
              <input
                type="url"
                placeholder="https://your-course-platform.com/access"
                value={formData.digitalUrl}
                onChange={(e) => updateField('digitalUrl', e.target.value)}
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
                currentImageUrl={formData.imageUrl}
                onImageUpload={(url) => updateField('imageUrl', url)}
              />
              <p className="text-xs text-gray-500 mt-2">
                Upload an image for your course. Recommended size: 800x600px
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
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
            disabled={loading || !formData.title.trim()}
            className={`rounded-md px-8 py-2 text-sm font-medium transition-colors ${loading || !formData.title.trim()
              ? 'bg-gray-400 cursor-not-allowed text-gray-200'
              : 'bg-sky-500 hover:bg-sky-600 text-white'
              }`}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </section>
    </div>
  );
}