'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { TabNavigation } from './components/TabNavigation';
import { DataTable } from './components/DataTable';
import { StatusBadge } from './components/StatusBadge';
import { OverviewSection } from './components/OverviewSection';
import { RevenueOverview } from './components/RevenueOverview';
import { QuickStats } from './components/QuickStats';

import { Calendar, Download } from 'lucide-react';

import type {
    User,
    Payment,
    Purchase,
    Course as CourseType,
    Stats,
    TabItem
} from './types/dashboard';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentUsers, setRecentUsers] = useState<User[]>([]);
    const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
    const [recentPurchases, setRecentPurchases] = useState<Purchase[]>([]);          // ← di-uncomment
    const [topCourses, setTopCourses] = useState<CourseType[]>([]);                  // ← di-uncomment
    const [activeTab, setActiveTab] = useState<TabItem['key']>('overview');

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const token = localStorage.getItem('token');
        if (!token) return router.replace('/login');

        const headers = { Authorization: `Bearer ${token}` };
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        Promise.all([
            fetch(`${baseUrl}/api/user/profile`, { headers }).then(r => r.json()),
            fetch(`${baseUrl}/api/dashboard/stats`, { headers }).then(r => r.json()),
            fetch(`${baseUrl}/api/dashboard/users`, { headers }).then(r => r.json()),
            fetch(`${baseUrl}/api/dashboard/payments`, { headers }).then(r => r.json()),
            fetch(`${baseUrl}/api/dashboard/orders`, { headers }).then(r => r.json()),
            fetch(`${baseUrl}/api/dashboard/products`, { headers }).then(r => r.json()),
        ])
            .then(([u, st, us, pays, ord, prods]) => {
                setUser(u.data || u);
                setStats(st.data || st);
                setRecentUsers(us.data || []);
                setRecentPayments(pays.data || []);
                setRecentPurchases(ord.data || []);
                setTopCourses(prods.data || []);
            })
            .catch(() => {
                localStorage.removeItem('token');
                router.replace('/login');
            });
    }, [router]);

    if (!user || !stats) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
        );
    }

    const tabs: TabItem[] = [
        { key: 'overview', label: 'Overview' },
        { key: 'users', label: 'Users' },
        { key: 'payments', label: 'Payments' },
        { key: 'orders', label: 'Orders' },
        { key: 'products', label: 'Products' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                            <p className="text-sm text-gray-500">Welcome back, {user.name}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50">
                                <Calendar className="w-4 h-4 mr-2" /> Last 30 days
                            </button>
                            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50">
                                <Download className="w-4 h-4 mr-2" /> Export
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* KPI Cards */}
                <OverviewSection stats={stats} />

                {/* Tabs */}
                <TabNavigation tabs={tabs} activeKey={activeTab} onChange={setActiveTab} />

                {/* Overview Content */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <RevenueOverview />
                        <QuickStats stats={stats} />
                    </div>
                )}

                {/* Users */}
                {activeTab === 'users' && (
                    <DataTable
                        title="Recent Users"
                        data={recentUsers}
                        columns={[
                            { header: 'User', renderCell: u => u.name },
                            { header: 'Email', renderCell: u => u.email },
                            { header: 'Joined', renderCell: u => new Date(u.createdAt).toLocaleDateString('id-ID') },
                        ]}
                        onViewAll={() => router.push('/dashboard/users')}
                    />
                )}

                {/* Payments */}
                {activeTab === 'payments' && (
                    <DataTable
                        title="Recent Payments"
                        data={recentPayments}
                        columns={[
                            { header: 'Payment ID', renderCell: p => `#${p.id.slice(0, 8)}` },
                            {
                                header: 'Amount',
                                renderCell: p => new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR'
                                }).format(p.amount)
                            },
                            { header: 'Status', renderCell: p => <StatusBadge status={p.status} /> },
                            {
                                header: 'Date',
                                renderCell: p => new Date(p.createdAt).toLocaleDateString('id-ID')
                            },
                        ]}
                    />
                )}

                {/* Orders */}
                {activeTab === 'orders' && (
                    <DataTable
                        title="Recent Orders"
                        data={recentPurchases}
                        columns={[
                            { header: 'Order ID', renderCell: o => `#${o.id.slice(0, 8)}` },
                            { header: 'Item Type', renderCell: o => o.itemType },
                            {
                                header: 'Price',
                                renderCell: o => new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR'
                                }).format(o.price)
                            },
                            {
                                header: 'Date',
                                renderCell: o => new Date(o.createdAt).toLocaleDateString('id-ID')
                            },
                        ]}
                    />
                )}

                {/* Products */}
                {activeTab === 'products' && (
                    <DataTable
                        title="Top Selling Courses"
                        data={topCourses}
                        columns={[
                            { header: 'Course', renderCell: c => c.title },
                            {
                                header: 'Price',
                                renderCell: c => new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR'
                                }).format(c.price)
                            },
                        ]}
                    />
                )}
            </div>
        </div>
    );
}
