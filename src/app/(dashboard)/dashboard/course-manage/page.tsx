'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import StatusDropdown from '../components/StatusDropdown';
import DashboardTabs from '../components/DashboardTabs';
import { useProductActions } from '../../../../hooks/useProducts';

// =================== Types ===================
type Product = {
  id: string;
  title: string;
  imageUrl: string | null;
  isActive: boolean;
  parentId?: string | null;
  type: 'COURSE' | 'UNIT' | 'SUBUNIT' | 'LESSON';
};

type TabBarProps = {
  items: { id: string; title: string }[];
  activeId: string | null;
  onTabClick: (id: string) => void;
};

// =================== TabBar ===================
function TabBar({ items, activeId, onTabClick }: TabBarProps) {
  return (
    <nav className="flex border-b border-gray-300 gap-6 mb-4">
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            onClick={() => onTabClick(item.id)}
            className={`text-sm font-semibold px-2 py-1 border-b-2 focus:outline-none
              ${isActive ? 'text-[#3E724A] border-[#3E724A]' : 'text-[#8E8E8E] border-transparent'}`}
          >
            {item.title}
          </button>
        );
      })}
    </nav>
  );
}

// =================== MAIN PAGE ===================
export default function CourseManagePage() {
  const [courses, setCourses] = useState<Product[]>([]);
  const [units, setUnits] = useState<Product[]>([]);
  const [lessons, setLessons] = useState<Product[]>([]);

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  const { deleteProduct } = useProductActions();

  // Fetch Courses (type=COURSE)
  const fetchCourses = useCallback(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products?type=COURSE`)
      .then((res) => res.json())
      .then((json) => {
        setCourses(json.data || []);
        if (json.data && json.data.length > 0) setSelectedCourseId(json.data[0].id);
      });
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Fetch Units by selected course (type=UNIT, parentId=courseId)
  useEffect(() => {
    if (!selectedCourseId) {
      setUnits([]);
      setSelectedUnitId(null);
      return;
    }

    const fetchUnits = () => {
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products?type=UNIT&parentId=${selectedCourseId}`)
        .then((res) => res.json())
        .then((json) => {
          setUnits(json.data || []);
          if (json.data && json.data.length > 0) setSelectedUnitId(json.data[0].id);
          else setSelectedUnitId(null);
        });
    };

    fetchUnits();
  }, [selectedCourseId]);

  // Fetch Lessons by selected unit (type=LESSON, parentId=unitId)
  useEffect(() => {
    if (!selectedUnitId) {
      setLessons([]);
      return;
    }

    const fetchLessons = () => {
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products?type=LESSON&parentId=${selectedUnitId}`)
        .then((res) => res.json())
        .then((json) => setLessons(json.data || []));
    };

    fetchLessons();
  }, [selectedUnitId]);

  // Create stable references for refetch functions
  const fetchUnits = useCallback(() => {
    if (!selectedCourseId) return;
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products?type=UNIT&parentId=${selectedCourseId}`)
      .then((res) => res.json())
      .then((json) => {
        setUnits(json.data || []);
        if (json.data && json.data.length > 0) setSelectedUnitId(json.data[0].id);
        else setSelectedUnitId(null);
      });
  }, [selectedCourseId]);

  const fetchLessons = useCallback(() => {
    if (!selectedUnitId) return;
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products?type=LESSON&parentId=${selectedUnitId}`)
      .then((res) => res.json())
      .then((json) => setLessons(json.data || []));
  }, [selectedUnitId]);

  // Delete handlers
  const handleDeleteCourse = async (id: string) => {
    const success = await deleteProduct(id, 'COURSE');
    if (success) {
      fetchCourses();
    }
  };

  const handleDeleteUnit = async (id: string) => {
    const success = await deleteProduct(id, 'UNIT');
    if (success) {
      fetchUnits();
    }
  };

  const handleDeleteLesson = async (id: string) => {
    const success = await deleteProduct(id, 'LESSON');
    if (success) {
      fetchLessons();
    }
  };

  // Tab Data
  const courseTabs = courses.map(c => ({ id: c.id, title: c.title }));
  const unitTabs = units.map(u => ({ id: u.id, title: u.title }));

  return (
    <div className="p-8">
      <header className="space-y-1 mb-6">
        <h1 className="text-2xl font-semibold">Course Management</h1>
        <p className="text-sm text-gray-500">
          Add/Edit your course, unit, and lesson (all from Product table).
        </p>
      </header>

      <DashboardTabs />

      {/* Courses */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Courses</h2>
          <Link
            href="/dashboard/course-manage/course"
            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Add Course
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="mb-4 text-gray-600">No Courses added yet.</p>
            <Link href="/dashboard/course-manage/course" className="inline-block bg-sky-500 text-white px-4 py-2 rounded">
              Add Your First Course
            </Link>
          </div>
        ) : (
          <div className="rounded-lg border ">
            <div className="grid grid-cols-12 bg-sky-500 text-white font-semibold text-sm">
              <div className="col-span-6 px-4 py-3">Course</div>
              <div className="col-span-3 px-4 py-3 text-center">Status</div>
              <div className="col-span-3 px-4 py-3 text-center">Actions</div>
            </div>
            {courses.map(item => (
              <div key={item.id} className="grid grid-cols-12 items-center border-t hover:bg-gray-50">
                <div className="col-span-6 px-4 py-3">
                  <div className="font-medium text-gray-900">{item.title}</div>
                </div>
                <div className="col-span-3 px-4 py-3 flex justify-center">
                  <StatusDropdown
                    compact={true}
                    initialStatus={item.isActive ?? true}
                    onStatusChange={async (isActive) => {
                      try {
                        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${item.id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ isActive }),
                        });
                      } catch {
                        alert('Error updating status.');
                      }
                    }}
                  />
                </div>
                <div className="col-span-3 px-4 py-3 flex justify-center gap-2">
                  <Link
                    href={`/dashboard/course-manage/products/course/${item.id}/edit`}
                    className="px-3 py-1 bg-sky-500 hover:bg-sky-600 text-white text-sm rounded transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    className="px-3 py-1 border border-red-300 text-red-600 hover:bg-red-50 text-sm rounded transition-colors"
                    onClick={() => handleDeleteCourse(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Units */}
      <section className="mt-12">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">Units</h2>
          <Link
            href={`/dashboard/course-manage/unit${selectedCourseId ? `?courseId=${selectedCourseId}` : ''}`}
            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Add Unit
          </Link>
        </div>

        {courseTabs.length > 0 && (
          <TabBar items={courseTabs} activeId={selectedCourseId} onTabClick={setSelectedCourseId} />
        )}

        {units.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="mb-4 text-gray-600">
              {selectedCourseId ? 'No Units added to this course yet.' : 'Select a course to view units.'}
            </p>
            {selectedCourseId && (
              <Link
                href={`/dashboard/course-manage/unit?courseId=${selectedCourseId}`}
                className="inline-block bg-sky-500 text-white px-4 py-2 rounded"
              >
                Add Unit to Course
              </Link>
            )}
          </div>
        ) : (
          <div className="rounded-lg border ">
            <div className="grid grid-cols-12 bg-sky-500 text-white font-semibold text-sm">
              <div className="col-span-6 px-4 py-3">Unit</div>
              <div className="col-span-3 px-4 py-3 text-center">Status</div>
              <div className="col-span-3 px-4 py-3 text-center">Actions</div>
            </div>
            {units.map(item => (
              <div key={item.id} className="grid grid-cols-12 items-center border-t hover:bg-gray-50">
                <div className="col-span-6 px-4 py-3">
                  <div className="font-medium text-gray-900">{item.title}</div>
                </div>
                <div className="col-span-3 px-4 py-3 flex justify-center">
                  <StatusDropdown
                    compact={true}
                    initialStatus={item.isActive ?? true}
                    onStatusChange={async (isActive) => {
                      try {
                        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${item.id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ isActive }),
                        });
                      } catch {
                        alert('Error updating status.');
                      }
                    }}
                  />
                </div>
                <div className="col-span-3 px-4 py-3 flex justify-center gap-2">
                  <Link
                    href={`/dashboard/course-manage/products/unit/${item.id}/edit`}
                    className="px-3 py-1 bg-sky-500 hover:bg-sky-600 text-white text-sm rounded transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    className="px-3 py-1 border border-red-300 text-red-600 hover:bg-red-50 text-sm rounded transition-colors"
                    onClick={() => handleDeleteUnit(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Lessons */}
      <section className="mt-12">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">Lessons</h2>
          <Link
            href="/dashboard/course-manage/lesson"
            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Add Lesson
          </Link>
        </div>

        {unitTabs.length > 0 && (
          <TabBar items={unitTabs} activeId={selectedUnitId} onTabClick={setSelectedUnitId} />
        )}

        {lessons.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="mb-4 text-gray-600">
              {selectedUnitId ? 'No Lessons added to this unit yet.' : 'Select a unit to view lessons.'}
            </p>
            {selectedUnitId && (
              <Link
                href="/dashboard/course-manage/lesson"
                className="inline-block bg-sky-500 text-white px-4 py-2 rounded"
              >
                Add Lesson to Unit
              </Link>
            )}
          </div>
        ) : (
          <div className="rounded-lg border ">
            <div className="grid grid-cols-12 bg-sky-500 text-white font-semibold text-sm">
              <div className="col-span-6 px-4 py-3">Lesson</div>
              <div className="col-span-3 px-4 py-3 text-center">Status</div>
              <div className="col-span-3 px-4 py-3 text-center">Actions</div>
            </div>
            {lessons.map(item => (
              <div key={item.id} className="grid grid-cols-12 items-center border-t hover:bg-gray-50">
                <div className="col-span-6 px-4 py-3">
                  <div className="font-medium text-gray-900">{item.title}</div>
                </div>
                <div className="col-span-3 px-4 py-3 flex justify-center">
                  <StatusDropdown
                    compact={true}
                    initialStatus={item.isActive ?? true}
                    onStatusChange={async (isActive) => {
                      try {
                        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products/${item.id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ isActive }),
                        });
                      } catch {
                        alert('Error updating status.');
                      }
                    }}
                  />
                </div>
                <div className="col-span-3 px-4 py-3 flex justify-center gap-2">
                  <Link
                    href={`/dashboard/course-manage/products/lesson/${item.id}/edit`}
                    className="px-3 py-1 bg-sky-500 hover:bg-sky-600 text-white text-sm rounded transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    className="px-3 py-1 border border-red-300 text-red-600 hover:bg-red-50 text-sm rounded transition-colors"
                    onClick={() => handleDeleteLesson(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}