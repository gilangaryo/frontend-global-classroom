'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
    { label: 'All Product', href: '/dashboard/course-manage' },
    { label: 'Add Course', href: '/dashboard/course-manage/course' },
    { label: 'Add Unit', href: '/dashboard/course-manage/unit' },
    { label: 'Add Sub‑Unit', href: '/dashboard/course-manage/sub-unit' },
    { label: 'Add Lesson', href: '/dashboard/course-manage/lesson' },
];

export default function DashboardTabs() {
    const pathname = usePathname();

    return (
        <nav className="mt-8 flex w-fit gap-2 rounded-md border border-gray-300 p-3">
            {tabs.map(({ label, href }) => (
                <Link
                    key={label}
                    href={href}
                    className={`rounded-md px-4 py-1.5 text-sm ${pathname === href
                        ? 'bg-sky-500 text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'
                        }`}
                >
                    {label}
                </Link>
            ))}
        </nav>
    );
}
