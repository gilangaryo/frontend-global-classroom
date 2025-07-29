'use client';

import DashboardTabs from "../../components/DashboardTabs";
import ImageDropZone from "../../components/ImageDropZone";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Category = {
  id: number;
  name: string;
};

export default function AddCoursePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [digitalUrl, setDigitalUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [colorButton, setColorButton] = useState('#3E724A');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/categories`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        const data = await res.json();
        setCategories(data.data || []);
      } catch {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);


  const handleSave = async () => {
    if (!categoryId) {
      alert("Please select a category!");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          categoryId,
          description,
          price,
          digitalUrl,
          imageUrl,
          colorButton,
        }),
      });

      if (res.ok) {
        alert('Course created!');
        router.push('/dashboard/course-manage');
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to create course.');
      }
    } catch (err) {
      alert('Something went wrong.');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="p-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Course Management</h1>
        <p className="text-sm text-gray-500">
          Add/Edit your course, unit, sub‑unit, and lesson.
        </p>
      </header>

      <DashboardTabs />

      <section className="mt-10 space-y-6">
        <h2 className="text-lg font-semibold">Add Course</h2>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="Name Course"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
              />

              <select
                value={categoryId}
                onChange={e => setCategoryId(Number(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
              >
                <option value="">-- Product Category --</option>
                {categories.map(cat => (
                  <option value={cat.id} key={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <textarea
              rows={5}
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
            />

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

            <div className="flex h-12 overflow-hidden rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-sky-400">
              <div className="flex-shrink-0 flex items-center justify-center border-2 border-sky-500 bg-sky-100 px-4 m-2 rounded-md">
                <span className="text-sky-500 text-sm font-bold">$</span>
              </div>

              <input
                type="number"
                placeholder="0.00 (price all units)"
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                className="flex-1 px-4 py-2 text-sm placeholder:text-gray-500 outline-none border-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>

            <input
              type="text"
              placeholder="Link Product After Purchase"
              value={digitalUrl}
              onChange={(e) => setDigitalUrl(e.target.value)}
              className="h-12 w-full rounded-lg border border-gray-300 px-5 text-sm placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          <ImageDropZone onImageUpload={(url) => setImageUrl(url)} />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => router.push('/dashboard/course-manage')}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md bg-sky-500 px-8 py-2 text-sm font-medium text-white hover:bg-sky-600"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </section>
    </div>
  );
}
