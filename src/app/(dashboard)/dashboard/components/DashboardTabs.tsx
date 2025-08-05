'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
    { label: 'All Product', href: '/dashboard/course-manage' },
    { label: 'Add Course', href: '/dashboard/course-manage/course' },
    { label: 'Add Unit', href: '/dashboard/course-manage/unit' },
    // { label: 'Add Sub‑Unit', href: '/dashboard/course-manage/sub-unit' },
    { label: 'Add Lesson', href: '/dashboard/course-manage/lesson' },
    { label: 'Add FreeLesson', href: '/dashboard/course-manage/free-lesson' },
];

export default function DashboardTabs() {
    const pathname = usePathname();

    return (
        <nav className="mt-8 flex w-fit gap-2 rounded-md border border-gray-300 p-3">
            {tabs.map(({ label, href }) => (
                <Link
                    key={label}
                    href={href}
                    className={`font-semibold rounded-md px-4 py-2 text-sm ${pathname === href
                        ? 'bg-sky-100 text-sky-500 shadow-sm border-2 border-sky-500'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    {label}
                </Link>
            ))}
        </nav>
    );
}
