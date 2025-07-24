// app/(dashboard)/course-manage/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DashboardTabs from '../components/DashboardTabs';

type BaseItem = { id: number; title: string; imageUrl?: string | null };

export default function CourseManagePage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [courses, setCourses] = useState<BaseItem[] | null>(null);
  const [units, setUnits] = useState<BaseItem[] | null>(null);
  const [subunits, setSubunits] = useState<BaseItem[] | null>(null);
  const [lessons, setLessons] = useState<BaseItem[] | null>(null);

  // Fetch all 4 resources
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem('token');
        const base = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`;
        const [cRes, uRes, sRes, lRes] = await Promise.all([
          fetch(`${base}/courses`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${base}/units`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${base}/subunits`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${base}/lessons`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const cJson = await cRes.json();
        const uJson = await uRes.json();
        const sJson = await sRes.json();
        const lJson = await lRes.json();
        setCourses(cJson.data || []);
        setUnits(uJson.data || []);
        setSubunits(sJson.data || []);
        setLessons(lJson.data || []);
      } catch (e) {
        console.error('Failed to load', e);
        setCourses([]); setUnits([]); setSubunits([]); setLessons([]);
      }
    };
    fetchAll();
  }, []);

  // GRID VIEW
  const renderGrid = <T extends BaseItem>(
    items: T[] | null,
    emptyTitle: string,
    addLink: string
  ) => {
    if (items === null) return <p className="text-center text-sm text-gray-500">Loading…</p>;
    if (items.length === 0) {
      return (
        <div className="text-center flex flex-col items-center py-12">
          <div className="relative w-48 h-40 mb-4">
            <Image src="/dashboard/empty-box.png" alt="Empty" fill className="object-contain" />
          </div>
          <p className="mb-4 text-gray-600">{emptyTitle}</p>
          <Link
            href={addLink}
            className="inline-block bg-sky-500 text-white px-5 py-2 rounded-md text-sm"
          >
            Add {emptyTitle.replace(/ Added Yet/, '')}
          </Link>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map(item => (
          <div key={item.id} className="border rounded-lg p-4">
            <div className="relative h-60 w-full mb-3">
              <Image
                src={item.imageUrl || '/dashboard/empty-box.png'}
                alt={item.title}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <h4 className="font-medium text-lg">{item.title}</h4>
          </div>
        ))}
      </div>
    );
  };
  const renderList = (
    items: BaseItem[] | null,
    label: string,
    editBase: string
  ) => {
    if (items === null) return <p className="text-center text-sm text-gray-500">Loading…</p>;
    if (items.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="mb-4 text-gray-600">No {label}s added yet.</p>
          <Link
            href={`${editBase}/add`}
            className="inline-block bg-sky-500 text-white px-4 py-2 rounded"
          >
            Add {label}
          </Link>
        </div>
      );
    }
    return (
      <div className="overflow-hidden rounded-lg border">
        {/* header */}
        <div className="flex bg-sky-500 text-white font-semibold text-sm">
          <div className="flex-1 px-4 py-2">{label}</div>
          <div className="w-24 px-4 py-2 text-center">Status</div>
          <div className="w-32 px-4 py-2 text-center">Action</div>
        </div>
        {/* rows */}
        {items.map(item => (
          <div
            key={item.id}
            className="flex items-center border-t hover:bg-gray-50"
          >
            <div className="flex-1 px-4 py-3">{item.title}</div>
            <div className="w-24 px-4 py-3">
              <select className="w-full border rounded px-2 py-1 text-sm">
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div className="w-32 px-4 py-3 flex justify-center space-x-2">
              <Link
                href={`${editBase}/${item.id}/edit`}
                className="px-3 py-1 bg-sky-500 text-white text-sm rounded"
              >
                Edit
              </Link>
              <button
                onClick={() => {/* TODO: delete */ }}
                className="px-2 py-1 border rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-8">
      <header className="space-y-1 mb-6">
        <h1 className="text-2xl font-semibold">Course & Content Management</h1>
        <p className="text-sm text-gray-500">
          Organize your Courses, Units, Sub‐units, and Lessons here.
        </p>
      </header>

      <DashboardTabs />

      {/* Toggle Grid/List */}
      <div className="flex justify-end space-x-2 my-6">
        <button
          onClick={() => setViewMode('grid')}
          className={`px-4 py-2 rounded ${viewMode === 'grid' ? 'bg-sky-500 text-white' : 'bg-gray-200'
            }`}
        >
          Grid View
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`px-4 py-2 rounded ${viewMode === 'list' ? 'bg-sky-500 text-white' : 'bg-gray-200'
            }`}
        >
          List View
        </button>
      </div>

      {viewMode === 'grid' ? (
        <>
          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Courses</h2>
            {renderGrid(courses, 'No Courses Added Yet', '/dashboard/course-manage/add')}
          </section>

          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Units</h2>
            {renderGrid(units, 'No Units Added Yet', '/dashboard/unit/add')}
          </section>

          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Sub-units</h2>
            {renderGrid(subunits, 'No Sub-units Added Yet', '/dashboard/subunit/add')}
          </section>

          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Lessons</h2>
            {renderGrid(lessons, 'No Lessons Added Yet', '/dashboard/lesson/add')}
          </section>
        </>
      ) : (
        <>
          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Courses</h2>
            {renderList(courses, 'Course', '/dashboard/course-manage/products/course')}
          </section>

          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Units</h2>
            {renderList(units, 'Unit', '/dashboard/course-manage/products/unit')}
          </section>

          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Sub-units</h2>
            {renderList(subunits, 'Sub-Unit', '/dashboard/course-manage/products/sub-unit')}
          </section>

          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Lessons</h2>
            {renderList(lessons, 'Lesson', '/dashboard/course-manage/products/lesson')}
          </section>
        </>
      )}
    </div>
  );
}
