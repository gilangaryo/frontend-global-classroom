'use client';

import DashboardTabs from "../../components/DashboardTabs";
import ImageDropZone from "../../components/ImageDropZone";
import TiptapEditor from '../../components/TiptapEditor';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useProducts, useProductActions, CreateProductData } from '../../hooks/useProducts';
import Image from "next/image";

export default function AddUnitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCourseId = searchParams.get('courseId');

  const { createProduct, loading } = useProductActions();
  const { products: courses, loading: coursesLoading } = useProducts({ type: 'COURSE' });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    digitalUrl: '',
    previewUrl: '',
    imageUrl: '',
    parentId: preselectedCourseId || '',
  });

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.parentId) {
      alert('Please select a course!');
      return;
    }

    if (!formData.title.trim()) {
      alert('Please enter a unit title');
      return;
    }

    const productData: CreateProductData = {
      ...formData,
      ProductType: 'UNIT',
    };

    const result = await createProduct(productData);

    if (result) {
      alert('Unit created successfully!');
      router.push('/dashboard/course-manage');
    }
  };

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
          <div className="md:col-span-2 space-y-5">
            {/* Course Selection */}
            <div>
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
                  onChange={(e) => updateField('parentId', e.target.value)}
                  className={`w-full rounded-md border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400 ${!formData.parentId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  required
                >
                  <option value="">-- Select Course --</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              )}
              {!formData.parentId && (
                <p className="text-xs text-red-500 mt-1">Please select a course</p>
              )}
            </div>

            {/* Unit Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter unit title"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                className={`w-full rounded-md border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400 ${!formData.title.trim() ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                required
                maxLength={255}
              />
              <div className="flex justify-between items-center mt-1">
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
                placeholder="Describe what this unit covers..."
              />
            </div>

            {/* Price */}
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
                Leave as 0 if this unit should be free
              </p>
            </div>

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
                  placeholder="https://example.com/preview-content"
                  value={formData.previewUrl}
                  onChange={(e) => updateField('previewUrl', e.target.value)}
                  className="flex-1 h-full px-4 text-sm placeholder:text-gray-600 outline-none"
                />
              </div>

              <p className="p-4 flex items-center">
                https://res.cloudinary.com/dla5fna8n/image/upload/v1754141514/PREVIEW_bzgt9b.pdf
                <button
                  type="button"
                  className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => {
                    navigator.clipboard.writeText('https://res.cloudinary.com/dla5fna8n/image/upload/v1754141514/PREVIEW_bzgt9b.pdf');
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002-2v1h2a2 2 0 002 2h-1V5m-1 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
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
                  placeholder="https://example.com/unit-content"
                  value={formData.digitalUrl}
                  onChange={(e) => updateField('digitalUrl', e.target.value)}
                  className="flex-1 h-full px-4 text-sm placeholder:text-gray-600 outline-none"
                />
              </div>
              <p className="p-4 flex items-center">
                https://res.cloudinary.com/dla5fna8n/image/upload/v1754141513/ASLI_q4cik2.pdf
                <button
                  type="button"
                  className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => {
                    navigator.clipboard.writeText('https://res.cloudinary.com/dla5fna8n/image/upload/v1754141513/ASLI_q4cik2.pdf');
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002-2v1h2a2 2 0 002 2h-1V5m-1 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </p>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit Cover Image
              </label>
              <ImageDropZone
                currentImageUrl={formData.imageUrl}
                onImageUpload={(url) => updateField('imageUrl', url)}
              />
              <p className="text-xs text-gray-500 mt-2">
                Upload an image to represent this unit
              </p>
            </div>

            {/* Preview Card */}
            {(formData.title || formData.imageUrl) && (
              <div className="bg-gray-50 border rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Preview:</h3>
                <div className="bg-white rounded-lg border p-3 shadow-sm">
                  {formData.imageUrl && (
                    <Image
                      src={formData.imageUrl}
                      alt="Unit preview"
                      className="w-full h-32 object-cover rounded mb-3"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                      width={400}
                      height={200}
                    />
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
            disabled={loading || !formData.title.trim() || !formData.parentId}
            className={`rounded-md px-8 py-2 text-sm font-medium transition-colors ${loading || !formData.title.trim() || !formData.parentId
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
              'Create Unit'
            )}
          </button>
        </div>
      </section>
    </div>
  );
}