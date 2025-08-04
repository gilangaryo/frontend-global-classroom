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
    Course,
    Stats,
    TabItem
} from './types/dashboard';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentUsers, setRecentUsers] = useState<User[]>([]);
    const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
    const [recentPurchases, setRecentPurchases] = useState<Purchase[]>([]);
    const [topCourses, setTopCourses] = useState<Course[]>([]);
    const [activeTab, setActiveTab] = useState<TabItem['key']>('overview');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const token = localStorage.getItem('token');
        if (!token) {
            router.replace('/login');
            return;
        }

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        const fetchData = async () => {
            try {
                setLoading(true);

                const [userRes, statsRes, usersRes, paymentsRes, ordersRes, productsRes] = await Promise.all([
                    fetch(`${baseUrl}/api/user/profile`, { headers }),
                    fetch(`${baseUrl}/api/dashboard/stats`, { headers }),
                    fetch(`${baseUrl}/api/dashboard/users`, { headers }),
                    fetch(`${baseUrl}/api/dashboard/payments`, { headers }),
                    fetch(`${baseUrl}/api/dashboard/orders`, { headers }),
                    fetch(`${baseUrl}/api/dashboard/products`, { headers }),
                ]);

                // Check if any request failed
                const responses = [userRes, statsRes, usersRes, paymentsRes, ordersRes, productsRes];
                for (const response of responses) {
                    if (!response.ok) {
                        if (response.status === 401) {
                            localStorage.removeItem('token');
                            router.replace('/login');
                            return;
                        }
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                }

                // Parse all responses
                const [userData, statsData, usersData, paymentsData, ordersData, productsData] = await Promise.all([
                    userRes.json(),
                    statsRes.json(),
                    usersRes.json(),
                    paymentsRes.json(),
                    ordersRes.json(),
                    productsRes.json(),
                ]);

                setUser(userData.data || userData);
                setStats(statsData.data || statsData);
                setRecentUsers(usersData.data || []);
                setRecentPayments(paymentsData.data || []);
                setRecentPurchases(ordersData.data || []);
                setTopCourses(productsData.data || []);

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                localStorage.removeItem('token');
                router.replace('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    if (loading || !user || !stats) {
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
                            { header: 'User', renderCell: (u: User) => u.name || 'No Name' },
                            { header: 'Email', renderCell: (u: User) => u.email },
                            { header: 'Joined', renderCell: (u: User) => new Date(u.createdAt).toLocaleDateString('en-US') },
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
                            { header: 'Payment ID', renderCell: (p: Payment) => `#${p.id.slice(0, 8)}` },
                            {
                                header: 'Customer',
                                renderCell: (p: Payment) => {
                                    if (p.customerFirstName && p.customerLastName) {
                                        return `${p.customerFirstName} ${p.customerLastName}`;
                                    }
                                    return p.customerEmail || 'N/A';
                                }
                            },
                            {
                                header: 'Amount',
                                renderCell: (p: Payment) => new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD'
                                }).format(p.amount)
                            },
                            { header: 'Status', renderCell: (p: Payment) => <StatusBadge status={p.status} /> },
                            {
                                header: 'Date',
                                renderCell: (p: Payment) => new Date(p.createdAt).toLocaleDateString('en-US')
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
                            { header: 'Order ID', renderCell: (o: Purchase) => `#${o.id.slice(0, 8)}` },
                            { header: 'Product', renderCell: (o: Purchase) => o.productTitle || 'Unknown Product' },
                            { header: 'Customer', renderCell: (o: Purchase) => o.userName || 'Unknown User' },
                            { header: 'Type', renderCell: (o: Purchase) => o.itemType },
                            {
                                header: 'Price',
                                renderCell: (o: Purchase) => new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD'
                                }).format(o.price)
                            },
                            { header: 'Status', renderCell: (o: Purchase) => <StatusBadge status={o.status || 'PAID'} /> },
                            {
                                header: 'Date',
                                renderCell: (o: Purchase) => new Date(o.createdAt).toLocaleDateString('en-US')
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
                            { header: 'Course', renderCell: (c: Course) => c.title },
                            { header: 'Type', renderCell: (c: Course) => c.type || 'COURSE' },
                            {
                                header: 'Unit Price',
                                renderCell: (c: Course) => new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD'
                                }).format(c.price)
                            },
                            { header: 'Sales', renderCell: (c: Course) => c.totalSales || 0 },
                            {
                                header: 'Total Revenue',
                                renderCell: (c: Course) => new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD'
                                }).format(c.totalRevenue || 0)
                            },
                        ]}
                    />
                )}
            </div>
        </div>
    );
}