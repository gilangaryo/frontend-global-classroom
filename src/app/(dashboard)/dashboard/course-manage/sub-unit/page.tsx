'use client';

import DashboardTabs from "../../components/DashboardTabs";
import ImageDropZone from "../../components/ImageDropZone";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
type Unit = {
  id: number;
  title: string;
};

export default function AddUnitPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [unitId, setUnitId] = useState<number | "">("");
  const [units, setUnits] = useState<Unit[]>([]);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [digitalUrl, setDigitalUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch units on mount
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/units`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        const data = await res.json();
        setUnits(data.data || []);
      } catch {
        setUnits([]);
      }
    };
    fetchUnits();
  }, []);


  const handleSave = async () => {
    if (!unitId) {
      alert("Please select a unit!");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/subunits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          unitId, // <-- pakai id!
          description,
          price,
          digitalUrl,
          imageUrl,
        }),
      });

      if (res.ok) {
        alert('Sub Unit created!');
        router.push('/dashboard/course-manage');
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to create unit.');
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
        <h1 className="text-2xl font-semibold">Sub Unit Management</h1>
        <p className="text-sm text-gray-500">
          Add/Edit your course, unit, sub‑unit, and lesson.
        </p>
      </header>

      <DashboardTabs />

      <section className="mt-10 space-y-6">
        <h2 className="text-lg font-semibold">Add Sub Unit</h2>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <div className="grid gap-4 md:grid-cols-1">
              <select
                value={unitId}
                onChange={e => setUnitId(Number(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
              >
                <option value="">-- Select Unit --</option>
                {units.map(cat => (
                  <option value={cat.id} key={cat.id}>{cat.title}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Name Sub Unit"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
              />


            </div>

            <textarea
              rows={5}
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
            />

            <div className="flex h-12 overflow-hidden rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-sky-400">
              <div className="flex-shrink-0 flex items-center justify-center bg-sky-400 px-4 m-2 rounded-md">
                <span className="text-white text-sm font-medium">$</span>
              </div>

              <input
                type="number"
                placeholder="0.00"
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                className="flex-1 px-4 py-2 text-sm placeholder:text-gray-500 outline-none border-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>


            <div className="flex h-12 overflow-hidden rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-sky-400">
              <span className="flex w-12 items-center justify-center text-sm text-gray-700 ">
                <Image src="/dashboard/link-icon.png" alt="Digital" width={15} height={15} />
              </span>
              <input
                type="text"
                placeholder="Link Preview"
                value={digitalUrl}
                onChange={(e) => setDigitalUrl(e.target.value)}
                className="h-12 w-full rounded-lg border-none  px-5 text-sm placeholder:text-gray-600 outline-none focus:ring-0 focus:ring-sky-400"
              />
            </div>
            <div className="flex h-12 overflow-hidden rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-sky-400">
              <span className="flex w-12 items-center justify-center text-sm text-gray-700 ">
                <Image src="/dashboard/link-icon.png" alt="Digital" width={15} height={15} />
              </span>
              <input
                type="text"
                placeholder="Link Product After Purchase"
                value={digitalUrl}
                onChange={(e) => setDigitalUrl(e.target.value)}
                className="h-12 w-full rounded-lg px-5 text-sm placeholder:text-gray-600 outline-none focus:ring-0 focus:ring-sky-400"
              />
            </div>
          </div>

          <div className="w-full" >
            <ImageDropZone onImageUpload={(url) => setImageUrl(url)} />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => router.push('/dashboard/unit-manage')}
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
