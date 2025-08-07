'use client';

import DashboardTabs from '../../components/DashboardTabs';
import TiptapEditor from '../../components/TiptapEditor';
import FileDropZone from '../../components/FileDropZone';
import ImageDropZone from '../../components/ImageDropZone';
import ButtonColorPicker from '../../components/ButtonColorPicker';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
interface CreateCourseData {
  title: string;
  description: string;
  courseIncluded: string;
  price: number;
  previewUrl: string;
  digitalUrl: string;
  imageUrl: string;
  colorButton: string;
  type: string;
}

export default function AddCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<CreateCourseData>({
    title: '',
    description: '',
    courseIncluded: '',
    price: 0,
    previewUrl: '',
    digitalUrl: '',
    imageUrl: '',
    colorButton: '#3E724A',
    type: 'COURSE',
  });

  const updateField = (field: keyof CreateCourseData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const createCourse = async (data: CreateCourseData) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Failed to create course');
    return result.data;
  };


  const handleSave = async () => {
    // Validation
    if (!formData.title.trim()) { alert('Title is required'); return; }
    if (!formData.description.trim()) { alert('Description is required'); return; }
    if (!formData.courseIncluded.trim()) { alert('What’s Included is required'); return; }
    if (formData.price <= 0) { alert('Price must be greater than 0'); return; }
    if (!formData.previewUrl.trim()) { alert('Preview file is required'); return; }
    if (!formData.digitalUrl.trim()) { alert('Digital file is required'); return; }
    if (!formData.imageUrl.trim()) { alert('Course image is required'); return; }
    if (!/^#[0-9A-Fa-f]{6}$/.test(formData.colorButton)) { alert('Button color is invalid'); return; }

    try {
      setLoading(true);
      await createCourse(formData);
      alert('Course created successfully!');
      router.push('/dashboard/course-manage');
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Failed to create course');
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
  return (
    <div className="p-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Course Management</h1>
        <p className="text-sm text-gray-500">Add a new course.</p>
      </header>

      <DashboardTabs />

      <section className="mt-10 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add Course</h2>
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
                className={`w-full rounded-md border px-4 py-2.5 text-sm outline-none 
                  focus:ring-2 focus:ring-sky-400 
                  ${'border-gray-300'}`}
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
                className={`w-full rounded-md border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400 ${!formData.description.trim()
                  ? 'border-gray-300 bg-gray-50'
                  : 'border-gray-300'
                  }`}
                required
              />
            </div>

            {/* What’s Included */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What’s Included <span className="text-red-500">*</span>
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
              <div className={`flex h-12 overflow-hidden rounded-lg border focus-within:ring-2 ${formData.price <= 0
                ? 'border-gray-300 focus-within:ring-sky-400'
                : 'border-gray-300 focus-within:ring-sky-400'
                }`}
              >
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
              {!formData.imageUrl.trim() && <p className="text-xs text-red-500 mt-1">Image is required</p>}
            </div>



            {/* Preview Card */}
            {(formData.title || formData.imageUrl) && (
              <div className="bg-gray-50 border rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Preview:</h3>
                <div className="bg-white rounded-lg border p-3 shadow-sm">
                  {/* Gambar */}
                  {formData.imageUrl && (
                    <div className="relative w-full h-50 mb-3">
                      <Image
                        src={formData.imageUrl}
                        alt="Course preview"
                        fill
                        className="object-cover rounded"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                  )}

                  {/* Judul */}
                  <h4 className="font-medium text-gray-900 text-sm">
                    {formData.title || 'Course Title'}
                  </h4>

                  {/* Deskripsi */}
                  {formData.description && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                      {formData.description.replace(/<[^>]*>/g, '').substring(0, 80)}...
                    </p>
                  )}

                  {/* What’s Included Preview */}
                  {formData.courseIncluded.trim() && (
                    <div
                      className="text-xs text-gray-500 mt-2 prose prose-sm max-w-none line-clamp-7"
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
            className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
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
            {loading ? 'Creating...' : 'Create Course'}
          </button>
        </div>
      </section>
    </div>
  );
}
