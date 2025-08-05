'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { LogOut, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import useAuthGuard from '../../../hooks/useAuthGuard'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const loading = useAuthGuard()

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
            </div>
        )
    }

    const navItems = [
        {
            name: 'Main Dashboard',
            href: '/dashboard',
            icon: {
                default: '/dashboard/icons/dashboard-black.png',
                active: '/dashboard/icons/dashboard-white.png',
            },
            isActive: (path: string) => path === '/dashboard'
        },
        {
            name: 'Course Manage',
            href: '/dashboard/course-manage',
            icon: {
                default: '/dashboard/icons/page-manage-black.png',
                active: '/dashboard/icons/page-manage-white.png',
            },
            // Match untuk semua sub-path course-manage
            isActive: (path: string) => path.startsWith('/dashboard/course-manage')
        },
        {
            name: 'Featured Projects',
            href: '/dashboard/featured-project', // Kembalikan ke href original
            icon: {
                default: '/dashboard/icons/page-manage-black.png',
                active: '/dashboard/icons/page-manage-white.png',
            },
            // Match untuk semua sub-path featured-project
            isActive: (path: string) => path.startsWith('/dashboard/featured-project')
        },
    ]

    const sidebarClasses = collapsed ? 'w-16 px-2' : 'w-64 px-4'
    const mainMarginClass = collapsed ? 'ml-16' : 'ml-64'

    return (
        <div>
            <aside
                className={`
          fixed inset-y-0 left-0 top-0 bg-white border-r flex flex-col
          transition-all duration-300 shadow-sm ${sidebarClasses} py-4
        `}
            >
                {collapsed ? (
                    <>
                        <button
                            onClick={() => setCollapsed(false)}
                            className="mx-auto mt-2 mb-3 p-2 rounded hover:bg-gray-100"
                        >
                            <ChevronRight size={20} />
                        </button>
                        <div className="flex justify-center ">
                            <Image
                                src="/dashboard/logo-tumbuhin.png"
                                alt="Logo Tumbuhin"
                                width={32}
                                height={32}
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-between pt-6 ">
                        <div className="flex items-center">
                            <Image
                                src="/dashboard/logo-tumbuhin.png"
                                alt="Logo Tumbuhin"
                                width={32}
                                height={32}
                            />
                            <span className="ml-3 text-lg font-bold text-[#008DFF]">Tumbuhin</span>
                        </div>
                        <button
                            onClick={() => setCollapsed(true)}
                            className="p-2 ml-4 rounded hover:bg-gray-100"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    </div>
                )}

                <nav className="flex-1 overflow-y-auto">
                    {navItems.map((item) => {
                        // Gunakan custom isActive function atau fallback ke exact match
                        const isActive = item.isActive ? item.isActive(pathname) : pathname === item.href

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                  flex items-center
                  ${collapsed ? 'justify-center' : 'px-3'}
                  py-3 my-4 rounded transition
                  ${isActive ? 'bg-sky-500 text-white' : 'text-gray-700 hover:bg-gray-100'}
                `}
                            >
                                <Image
                                    src={isActive ? item.icon.active : item.icon.default}
                                    alt={item.name}
                                    width={20}
                                    height={20}
                                />
                                {!collapsed && <span className="ml-2 text-sm">{item.name}</span>}
                            </Link>
                        )
                    })}
                </nav>

                <div className="mt-auto mb-4">
                    <div className={`flex items-center ${collapsed ? 'justify-center' : 'px-3 mb-2'}`}>
                        <Image
                            src="/profileku.png"
                            alt="Admin"
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                        {!collapsed && <span className="ml-2 text-sm"></span>}
                    </div>
                    <button
                        onClick={() => {
                            localStorage.clear()
                            router.replace('/login')
                        }}
                        className={`
              flex items-center w-full
              ${collapsed ? 'justify-center' : 'px-3'}
              py-2 text-red-500 hover:underline
            `}
                    >
                        <LogOut size={16} />
                        {!collapsed && <span className="ml-2 text-sm">Log Out</span>}
                    </button>
                </div>
            </aside>

            <main
                className={`
          ${mainMarginClass} h-screen overflow-y-auto
          transition-all duration-300 bg-gray-50 p-6
        `}
            >
                {children}
            </main>
        </div>
    )
}