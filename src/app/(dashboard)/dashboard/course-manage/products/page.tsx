'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
// import DashboardTabs from '../../components/DashboardTabs';

type BaseItem = { id: number; title: string };
type Course = BaseItem;
type Unit = BaseItem;
type Subunit = BaseItem;
type Lesson = BaseItem;

export default function CourseManage() {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [units, setUnits] = useState<Unit[] | null>(null);
  const [subs, setSubs] = useState<Subunit[] | null>(null);
  const [lessons, setLessons] = useState<Lesson[] | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      const token = localStorage.getItem('token');
      const base = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`;
      const [cRes, uRes, sRes, lRes] = await Promise.all([
        fetch(`${base}/courses`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${base}/units`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${base}/subunits`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${base}/lessons`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setCourses((await cRes.json()).data);
      setUnits((await uRes.json()).data);
      setSubs((await sRes.json()).data);
      setLessons((await lRes.json()).data);
    };
    fetchAll();
  }, []);

  const renderList = (
    items: BaseItem[] | null,
    label: string,
    editPath: string
  ) => {
    if (items === null) {
      return <p className="text-center text-sm text-gray-500">Loading {label}…</p>;
    }
    if (items.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="mb-4 text-gray-600">No {label} added yet.</p>
          <Link
            href={`${editPath}/add`}
            className="inline-block bg-sky-500 text-white px-4 py-2 rounded"
          >
            Add {label}
          </Link>
        </div>
      );
    }

    return (
      <div className="overflow-hidden rounded-lg border">
        {/* header row */}
        <div className="flex bg-sky-500 text-white font-semibold text-sm">
          <div className="flex-1 px-4 py-2">{label}</div>
          <div className="w-30 px-4 py-2 text-center">Status</div>
          <div className="w-32 px-4 py-2 text-center">Action</div>
        </div>
        {/* data rows */}
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center border-t hover:bg-gray-50"
          >
            <div className="flex-1 px-4 py-3">{item.title}</div>
            <div className="w-30 px-4 py-3">
              <select className="w-full border rounded px-2 py-1 text-sm">
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div className="w-32 px-4 py-3 flex justify-center space-x-2">
              <Link
                href={`${editPath}/${item.id}/edit`}
                className="px-3 py-1 bg-sky-500 text-white text-sm rounded"
              >
                Edit
              </Link>
              <button
                onClick={() => {/* TODO: delete logic */ }}
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
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Course Management</h1>
        <p className="text-sm text-gray-500">
          Organize your Courses, Units, Sub‐units, and Lessons here.
        </p>
      </header>

      {/* <DashboardTabs /> */}

      {/* Courses */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Courses</h2>
        {renderList(courses, 'Course', '/dashboard/course-manage/products/course')}
      </section>

      {/* Units */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Units</h2>
        {renderList(units, 'Unit', '/dashboard/course-manage/products/unit')}
      </section>

      {/* Sub-Units */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Sub-Units</h2>
        {renderList(subs, 'Sub-Unit', '/dashboard/course-manage/products/sub-unit')}
      </section>

      {/* Lessons */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Lessons</h2>
        {renderList(lessons, 'Lesson', '/dashboard/course-manage/products/lesson')}
      </section>
    </div>
  );
}
