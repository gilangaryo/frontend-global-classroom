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

type Subunit = {
  id: number;
  title: string;
  unitId: number;
};

type LessonPayload = {
  title: string;
  unitId: number | string;
  description: string;
  price: number;
  digitalUrl: string;
  imageUrl: string;
  subunitId?: number | null;
};
export default function AddLessonPage() {
  const router = useRouter();

  // form state
  const [unitId, setUnitId] = useState<number | "">("");
  const [subunitId, setSubunitId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [digitalUrl, setDigitalUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // data lists
  const [units, setUnits] = useState<Unit[]>([]);
  const [subunits, setSubunits] = useState<Subunit[]>([]);

  // fetch units + subunits on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const base = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`;
        const [uRes, suRes] = await Promise.all([
          fetch(`${base}/units`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${base}/subunits`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const uJson = await uRes.json();
        const suJson = await suRes.json();

        setUnits(uJson.data || []);
        setSubunits(suJson.data || []);
      } catch {
        setUnits([]);
        setSubunits([]);
      }
    };
    fetchData();
  }, []);

  // only subunits for the selected unit
  const subunitsForUnit = subunits.filter((s) => s.unitId === unitId);

  const handleSave = async () => {
    if (!unitId) {
      alert("Please select a Unit!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      // build payload, include subunitId only if chosen
      const payload: LessonPayload = {
        title,
        unitId,
        description,
        price,
        digitalUrl,
        imageUrl,
      };
      if (subunitId !== null) payload.subunitId = subunitId;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/lessons`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        alert("Lesson created!");
        router.push("/dashboard/course-manage");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to create lesson.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Lesson Management</h1>
        <p className="text-sm text-gray-500">Add a new Lesson under a Unit (and optionally a Subunit)</p>
      </header>

      <DashboardTabs />

      <section className="mt-10 space-y-6">
        <h2 className="text-lg font-semibold">Add Lesson</h2>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            {/* Unit selector */}
            <select
              value={unitId}
              onChange={(e) => setUnitId(Number(e.target.value))}
              className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
            >
              <option value="">-- Select Unit --</option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>{u.title}</option>
              ))}
            </select>

            {/* Subunit selector (optional) */}
            <select
              value={subunitId ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                setSubunitId(v === "" ? null : Number(v));
              }}
              disabled={!unitId}
              className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400 disabled:opacity-50"
            >
              <option value="">No Subunit</option>
              {subunitsForUnit.map((s) => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>

            {/* Lesson Title */}
            <input
              type="text"
              placeholder="Lesson Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
            />

            {/* Description */}
            <textarea
              rows={5}
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none rounded-md border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky-400"
            />

            {/* Price */}
            <div className="flex h-12 overflow-hidden rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-sky-400">
              <div className="flex-shrink-0 flex items-center justify-center bg-sky-400 px-4">
                <span className="text-white text-sm font-medium">$</span>
              </div>
              <input
                type="number"
                placeholder="0.00"
                onFocus={(e) => e.currentTarget.select()}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                className="
                  flex-1 px-4 py-2 text-sm placeholder:text-gray-500 outline-none border-none focus:ring-0
                  appearance-none
                  [&::-webkit-outer-spin-button]:appearance-none
                  [&::-webkit-inner-spin-button]:appearance-none
                  [-moz-appearance:textfield]
                "
              />
            </div>

            {/* Preview URL */}
            <div className="flex h-12 overflow-hidden rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-sky-400">
              <span className="flex w-12 items-center justify-center text-gray-700">
                <Image src="/dashboard/link-icon.png" alt="Link" width={15} height={15} />
              </span>
              <input
                type="text"
                placeholder="Link Preview"
                value={digitalUrl}
                onChange={(e) => setDigitalUrl(e.target.value)}
                className="flex-1 h-full px-4 text-sm placeholder:text-gray-600 outline-none"
              />
            </div>
          </div>

          {/* Image uploader */}
          <div className="w-full">
            <ImageDropZone onImageUpload={(url) => setImageUrl(url)} />
          </div>
        </div>

        {/* Actions */}
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
            {loading ? "Saving..." : "Save Lesson"}
          </button>
        </div>
      </section>
    </div>
  );
}
