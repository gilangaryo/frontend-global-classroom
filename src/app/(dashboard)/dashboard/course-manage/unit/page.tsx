'use client';

import DashboardTabs from '../../components/DashboardTabs';
import ImageDropZone from '../../components/ImageDropZone';
import FileDropZone from '../../components/FileDropZone';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useProducts, useProductActions, CreateProductData } from '../../../../../hooks/useProducts';

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

export default function AddUnitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCourseId = searchParams.get('courseId') || '';

  const { createProduct, loading } = useProductActions();
  const { products: courses, loading: coursesLoading } = useProducts({ type: 'COURSE' });

  const [formData, setFormData] = useState<FormData>({
    parentId: preselectedCourseId,
    title: '',
    description: '',
    price: 0,
    previewUrl: '',
    digitalUrl: '',
    imageUrl: '',
  });

  const [errors, setErrors] = useState<Partial<Record<FormField, string>>>({});

  function updateField(field: FormField, value: string | number) {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }

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

    const productData: CreateProductData = {
      ...formData,
      ProductType: 'UNIT',
    };

    try {
      const result = await createProduct(productData);
      if (result) {
        alert('Unit created successfully!');
        router.push('/dashboard/course-manage');
      }
    } catch (err) {
      console.error('Error creating unit:', err);
      alert(err instanceof Error ? err.message : 'Failed to create unit');
    }
  }

  const isFormValid =
    !!formData.parentId.trim() &&
    !!formData.title.trim() &&
    !!formData.imageUrl.trim() &&
    !!formData.previewUrl.trim() &&
    !!formData.digitalUrl.trim();

  return (
    <div className="p-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Unit Management</h1>
        <p className="text-sm text-gray-500">
          Add a new unit to organize your course content.
        </p>
      </header>

      <DashboardTabs />

      <section className="mt-10 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add Unit</h2>
          {preselectedCourseId && (
            <div className="text-sm text-gray-500">
              Adding unit to selected course
            </div>
          )}
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
                  className={`w-full rounded-md px-4 py-2.5 text-sm outline-none focus:ring-2 border ${errors.parentId
                    ? 'border-red-300 bg-red-50 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-sky-400'
                    }`}
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
                className={`w-full rounded-md px-4 py-2.5 text-sm outline-none focus:ring-2 border ${errors.title
                  ? 'border-red-300 bg-red-50 focus:ring-red-400'
                  : 'border-gray-300 focus:ring-sky-400'
                  }`}
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
                Description <span className="text-red-500">*</span>
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
                Price <span className="text-red-500">*</span>
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

            {/* Preview URL */}
            <div data-field="previewUrl" className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview Content URL <span className="text-red-500">*</span>
              </label>
              <div className={`flex h-12 overflow-hidden rounded-lg focus-within:ring-2 border ${errors.previewUrl
                ? 'border-red-300 bg-red-50 focus-within:ring-red-400'
                : 'border-gray-300 focus-within:ring-sky-400'
                }`}>
                <span className="flex w-12 items-center justify-center text-gray-700">
                  <svg className="w-4 h-4" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </span>
                <input
                  type="url"
                  placeholder="https://example.com/preview-content"
                  value={formData.previewUrl}
                  onChange={e => updateField('previewUrl', e.target.value)}
                  className="flex-1 px-4 text-sm placeholder-gray-600 outline-none border-none"
                />
              </div>
              {errors.previewUrl && (
                <p className="text-xs text-red-500 mt-1">{errors.previewUrl}</p>
              )}
            </div>

            {/* Digital URL */}
            <div data-field="digitalUrl" className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Digital Content URL <span className="text-red-500">*</span>
              </label>
              <div className={`flex h-12 overflow-hidden rounded-lg focus-within:ring-2 border ${errors.digitalUrl
                ? 'border-red-300 bg-red-50 focus-within:ring-red-400'
                : 'border-gray-300 focus-within:ring-sky-400'
                }`}>
                <span className="flex w-12 items-center justify-center text-gray-700">
                  <svg className="w-4 h-4" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M10.172 13.828a4 4 0 015.656 0l4-4a4 4 0 10-5.656-5.656l-1.102 1.101" />
                  </svg>
                </span>
                <input
                  type="url"
                  placeholder="https://example.com/unit-content"
                  value={formData.digitalUrl}
                  onChange={e => updateField('digitalUrl', e.target.value)}
                  className="flex-1 px-4 text-sm placeholder-gray-600 outline-none border-none"
                />
              </div>
              {errors.digitalUrl && (
                <p className="text-xs text-red-500 mt-1">{errors.digitalUrl}</p>
              )}
            </div>

            {/* Upload Preview File */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Preview File <span className="text-red-500">*</span>
              </label>
              <FileDropZone
                label="Upload preview"
                acceptedTypes="video/*,application/pdf"
                onFileUpload={url => updateField('previewUrl', url)}
              />
            </div>

            {/* Upload Digital File */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Digital File <span className="text-red-500">*</span>
              </label>
              <FileDropZone
                label="Upload digital"
                acceptedTypes="application/zip,application/pdf"
                onFileUpload={url => updateField('digitalUrl', url)}
              />
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
            {loading ? 'Creating...' : 'Create Unit'}
          </button>
        </div>
      </section>
    </div>
  );
}