'use client';

import DashboardTabs from "../../components/DashboardTabs";
import ImageDropZone from "../../components/ImageDropZone";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProducts, useProductActions, CreateProductData } from '../../../../../hooks/useProducts';
import Image from "next/image";
import TiptapEditor from "../../components/TiptapEditor";
import FileDropZone from "../../components/FileDropZone";
import TagsInput from "../../components/form/TagsInput";

interface CreateLessonData extends CreateProductData {
  tags?: string[];
}

export default function AddLessonPage() {
  const router = useRouter();

  const { createProduct, loading } = useProductActions();
  const { products: units, loading: unitsLoading } = useProducts({ type: 'UNIT' });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    studyGuideUrl: '',
    digitalUrl: '',
    previewUrl: '',
    imageUrl: '',
    parentId: '',
    isFreeLesson: false,
    learningActivities: '',
  });

  const [tags, setTags] = useState<string[]>([]);

  const updateField = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.parentId) {
      alert('Please select a unit!');
      return false;
    }

    if (!formData.title.trim()) {
      alert('Please enter a lesson title');
      return false;
    }

    if (formData.title.trim().length < 3) {
      alert('Title must be at least 3 characters long!');
      return false;
    }

    if (!formData.description.trim()) {
      alert('Please enter a lesson description');
      return false;
    }

    if (!formData.learningActivities.trim()) {
      alert('Please enter learning activities');
      return false;
    }

    if (!formData.studyGuideUrl.trim()) {
      alert('Please upload a study guide PDF');
      return false;
    }

    if (!formData.previewUrl.trim()) {
      alert('Please upload a preview PDF');
      return false;
    }

    if (!formData.digitalUrl.trim()) {
      alert('Please upload a digital PDF');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
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
          studyGuideUrl: '',
          digitalUrl: '',
          previewUrl: '',
          imageUrl: '',
          parentId: '',
          isFreeLesson: false,
          learningActivities: '',
        });
        setTags([]);

        router.push('/dashboard/course-manage');
      }
    } catch (err) {
      console.error('Error creating lesson:', err);
      alert(err instanceof Error ? err.message : 'Failed to create lesson');
    }
  };

  const isFormValid =
    !!formData.parentId &&
    !!formData.title.trim() &&
    formData.title.trim().length >= 3 &&
    !!formData.description.trim() &&
    !!formData.learningActivities.trim() &&
    !!formData.studyGuideUrl.trim() &&
    !!formData.previewUrl.trim() &&
    !!formData.digitalUrl.trim();

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
                  className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                  required
                >
                  <option value="">-- Select Unit --</option>
                  {units?.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.title}
                    </option>
                  ))}
                </select>
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
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                required
                maxLength={255}
              />
              <div className="flex justify-between items-center mt-1">
                <div className="flex-1">
                  {formData.title.trim().length > 0 && formData.title.trim().length < 3 && (
                    <p className="text-xs text-red-500">Title must be at least 3 characters</p>
                  )}

                </div>
                <p className="text-xs text-gray-500">{formData.title.length}/255</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={5}
                placeholder="Describe what this lesson covers..."
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                className="w-full resize-none rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
                required
              />
            </div>

            {/* Learning Activities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Learning Activities <span className="text-red-500">*</span>
              </label>
              <TiptapEditor
                content={formData.learningActivities}
                onChange={(value) => updateField('learningActivities', value)}
                placeholder="Write the learning activities using formatting..."
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

            {/* Tags Input */}
            <TagsInput
              tags={tags}
              onTagsChange={setTags}
              maxTags={10}
              label="Tags"
              placeholder="Type a tag and press Enter"
              suggestedTags={[
                "9th", "10th", "11th", "12th", "ESL,EFL and ELL",
                "Online Courses", "Vocational Training",
                "Adult Education", "Higher Education",
                "AP", "IB", "IGCSE",
                "Beginner", "Intermediate", "Advanced",
                "Case Study", "Group Work", "Individual Work",
                "Critical Thinking", "Writing Practice",
                "Geography", "History", "Economics",
                "Mathematics", "Science", "English",
                "Introduction", "Practical", "Theory",
              ]}
              disabled={loading}
            />

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
                    value={formData.price === 0 ? '' : formData.price}
                    min="0"
                    step="0.01"
                    onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)}
                    className="flex-1 px-4 py-2 text-sm placeholder:text-gray-500 outline-none border-none focus:ring-0"
                    style={{ appearance: 'textfield' }}
                  />
                </div>
              </div>
            )}

            {/* Study Guide PDF Upload */}
            <div data-field="studyGuideUrl" className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Study Guide PDF <span className="text-red-500">*</span>
              </label>
              <FileDropZone
                label="Upload Study Guide PDF"
                acceptedTypes="application/pdf"
                onFileUpload={(url) => updateField('studyGuideUrl', url)}
              />
              {formData.studyGuideUrl && (
                <p className="text-xs text-gray-500 mt-2 break-all">
                  URL: {formData.studyGuideUrl}
                </p>
              )}
            </div>

            {/* Preview PDF Upload */}
            <div data-field="previewUrl" className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Preview PDF <span className="text-red-500">*</span>
              </label>
              <FileDropZone
                label="Upload Preview PDF"
                acceptedTypes="application/pdf"
                onFileUpload={(url) => updateField('previewUrl', url)}
              />
              {formData.previewUrl && (
                <p className="text-xs text-gray-500 mt-2 break-all">
                  URL: {formData.previewUrl}
                </p>
              )}
            </div>

            {/* Digital PDF Upload */}
            <div data-field="digitalUrl" className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Digital PDF <span className="text-red-500">*</span>
              </label>
              <FileDropZone
                label="Upload Digital PDF"
                acceptedTypes="application/pdf"
                onFileUpload={(url) => updateField('digitalUrl', url)}
              />
              {formData.digitalUrl && (
                <p className="text-xs text-gray-500 mt-2 break-all">
                  URL: {formData.digitalUrl}
                </p>
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
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2 mb-2">
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
                      {formData.description.replace(/<[^>]*>/g, '').substring(0, 80)}
                      {formData.description.length > 80 && '...'}
                    </p>
                  )}

                  {/* What’s Included Preview */}
                  {formData.learningActivities.trim() && (
                    <div
                      className="text-xs text-gray-500 mt-2 prose prose-sm max-w-none line-clamp-7"
                      dangerouslySetInnerHTML={{ __html: formData.learningActivities }}
                    />
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
            className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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