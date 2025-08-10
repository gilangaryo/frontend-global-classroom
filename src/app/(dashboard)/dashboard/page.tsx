'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { TabNavigation } from './components/TabNavigation';
import { DataTable } from './components/DataTable';
import { StatusBadge } from './components/StatusBadge';
import { OverviewSection } from './components/OverviewSection';
import { RevenueOverview } from './components/RevenueOverview';

import type {
    User,
    Payment,
    Purchase,
    Course,
    Stats,
    TabItem
} from '../../../types/dashboard';

type Paged<T> = { items: T[]; total: number; page: number; pageSize: number };

interface ExtendedPurchase extends Purchase {
    productId?: string | number;
    product?: {
        title: string;
        id?: string | number;
    };
    title?: string;
    amount?: number;
}

type OrderDisplayData = ExtendedPurchase;

const TABS: TabItem[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'users', label: 'Users' },
    { key: 'payments', label: 'Payments' },
    { key: 'orders', label: 'Orders' },
    { key: 'products', label: 'Products' },
];

function PaginationControls({
    total,
    page,
    pageSize,
    onChange,
}: {
    total: number;
    page: number;
    pageSize: number;
    onChange: (next: { page?: number; pageSize?: number }) => void;
}) {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    return (
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-white">
            <div className="text-sm text-gray-500">
                Page <span className="font-medium">{page}</span> of{' '}
                <span className="font-medium">{totalPages}</span> •{' '}
                <span className="font-medium">{total}</span> items
            </div>
            <div className="flex items-center gap-2">
                <button
                    className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50"
                    onClick={() => onChange({ page: Math.max(1, page - 1) })}
                    disabled={page <= 1}
                >
                    Prev
                </button>
                <button
                    className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50"
                    onClick={() => onChange({ page: Math.min(totalPages, page + 1) })}
                    disabled={page >= totalPages}
                >
                    Next
                </button>
                <select
                    className="ml-2 px-2 py-1.5 border rounded-md text-sm"
                    value={pageSize}
                    onChange={(e) => onChange({ page: 1, pageSize: parseInt(e.target.value, 10) })}
                >
                    {[5, 10, 20, 50].map((s) => (
                        <option key={s} value={s}>
                            {s}/page
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabItem['key']>('overview');

    // auth
    const [token, setToken] = useState<string | null>(null);

    // header summary
    const [user, setUser] = useState<User | null>(null);
    const [stats, setStats] = useState<Stats | null>(null);

    // overview quick lists (non‑paged, dari /dashboard/all)
    const [recentUsers, setRecentUsers] = useState<User[]>([]);
    const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
    const [recentPurchases, setRecentPurchases] = useState<ExtendedPurchase[]>([]);
    const [topCoursesSnapshot, setTopCoursesSnapshot] = useState<Course[]>([]);

    // paged states per tab  
    const [usersPaged, setUsersPaged] = useState<Paged<User>>({ items: [], total: 0, page: 1, pageSize: 10 });
    const [paymentsPaged, setPaymentsPaged] = useState<Paged<Payment>>({ items: [], total: 0, page: 1, pageSize: 10 });
    const [ordersPaged, setOrdersPaged] = useState<Paged<ExtendedPurchase>>({ items: [], total: 0, page: 1, pageSize: 10 });
    const [productsPaged, setProductsPaged] = useState<Paged<Course>>({ items: [], total: 0, page: 1, pageSize: 10 });

    const [loading, setLoading] = useState(true);
    const [tabLoading, setTabLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const authHeaders = useMemo(
        () =>
            token
                ? {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
                : undefined,
        [token]
    );

    // Enhanced helper to get product name with better fallbacks
    const getProductName = (order: OrderDisplayData): string => {
        // Debug log to see what data we're working with
        if (process.env.NODE_ENV === 'development') {
            console.log('Order data for product name:', {
                id: order.id,
                productTitle: order.productTitle,
                productObject: order.product,
                title: order.title,
                productId: (order as ExtendedPurchase).productId
            });
        }

        // Try different sources for product name
        if (order.productTitle) return order.productTitle;
        if ((order as ExtendedPurchase).product?.title) return (order as ExtendedPurchase).product!.title;
        if ((order as ExtendedPurchase).title) return (order as ExtendedPurchase).title!;

        // If we have a productId, we could potentially fetch it, but for now show a better fallback
        if ((order as ExtendedPurchase).productId) {
            return `Product ID: ${(order as ExtendedPurchase).productId}`;
        }

        // Last resort - show order ID
        return `Order #${String(order.id).slice(0, 8)}`;
    };

    // Function to try to enrich order data with product information
    const enrichOrdersWithProductData = async (orders: Purchase[]): Promise<ExtendedPurchase[]> => {
        if (!authHeaders || orders.length === 0) return orders as ExtendedPurchase[];

        // Only try to enrich if orders are missing product titles
        const needsEnrichment = orders.some(order =>
            !order.productTitle && !(order as ExtendedPurchase).product?.title && !(order as ExtendedPurchase).title
        );

        if (!needsEnrichment) return orders as ExtendedPurchase[];

        try {
            // If you have an endpoint to get all products, fetch them
            const productsRes = await fetch(`${baseUrl}/api/dashboard/products?pageSize=1000`, {
                headers: authHeaders
            });

            if (productsRes.ok) {
                const productsData = await productsRes.json();
                const products = productsData.data?.items || productsData.items || [];

                // Create a map of product ID to product name
                const productMap = new Map();
                products.forEach((product: Course) => {
                    productMap.set(product.id, product.title);
                });

                // Enrich orders with product names
                return orders.map(order => {
                    const extendedOrder = order as ExtendedPurchase;
                    if (!order.productTitle && extendedOrder.productId && productMap.has(extendedOrder.productId)) {
                        return {
                            ...extendedOrder,
                            productTitle: productMap.get(extendedOrder.productId)
                        };
                    }
                    return extendedOrder;
                });
            }
        } catch (error) {
            console.error('Failed to enrich orders with product data:', error);
        }

        return orders as ExtendedPurchase[];
    };

    // Helper function to get price from order data
    const getOrderPrice = (order: OrderDisplayData): number => {
        const amount = Number(order.price ?? order.amount ?? 0);
        return Number.isFinite(amount) ? amount : 0;
    };

    // Helper function to format currency
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // bootstrap: token + profile + /dashboard/all
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const t = localStorage.getItem('token');
        if (!t) {
            router.replace('/login');
            return;
        }
        setToken(t);

        const bootstrap = async () => {
            try {
                setLoading(true);
                setError(null);

                const [profileRes, allRes] = await Promise.all([
                    fetch(`${baseUrl}/api/user/profile`, { headers: { Authorization: `Bearer ${t}` } }),
                    fetch(`${baseUrl}/api/dashboard/all`, { headers: { Authorization: `Bearer ${t}` } }),
                ]);

                if (profileRes.status === 401 || allRes.status === 401) {
                    localStorage.removeItem('token');
                    router.replace('/login');
                    return;
                }
                if (!profileRes.ok || !allRes.ok) {
                    throw new Error(`Bootstrap failed (${profileRes.status}/${allRes.status})`);
                }

                const profile = await profileRes.json();
                const all = await allRes.json();

                setUser(profile.data || profile);
                setStats(all.data?.stats || all.stats);

                const rawRecentPurchases = all.data?.recentPurchases || all.recentPurchases || [];

                // Also log the recent purchases data to understand the structure
                if (process.env.NODE_ENV === 'development') {
                    console.log('Recent purchases data:', rawRecentPurchases);
                }

                // Try to enrich the recent purchases with product data
                const enrichedPurchases = await enrichOrdersWithProductData(rawRecentPurchases);

                setRecentUsers(all.data?.recentUsers || all.recentUsers || []);
                setRecentPayments(all.data?.recentPayments || all.recentPayments || []);
                setRecentPurchases(enrichedPurchases);
                setTopCoursesSnapshot(all.data?.topProducts || all.topProducts || []);

                // Pre-fetch orders data for better overview display
                // This ensures Recent Orders in overview has product information
                try {
                    const ordersRes = await fetch(
                        `${baseUrl}/api/dashboard/orders?page=1&pageSize=10&sort=createdAt&order=desc`,
                        { headers: { Authorization: `Bearer ${t}` } }
                    );

                    if (ordersRes.ok) {
                        const ordersJson = await ordersRes.json();
                        const ordersData = ordersJson.data || ordersJson;
                        setOrdersPaged({
                            items: (ordersData.items ?? ordersData) as ExtendedPurchase[],
                            total: ordersData.total ?? (ordersData.items?.length ?? 0),
                            page: ordersData.page ?? 1,
                            pageSize: ordersData.pageSize ?? 10,
                        });
                    }
                } catch (error) {
                    console.error('Failed to pre-fetch orders:', error);
                    // Don't fail the whole bootstrap if orders fetch fails
                }
            } catch (error) {
                console.error(error);
                setError('Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        };

        bootstrap();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    // server-driven pagination loaders
    const fetchUsersPaged = useCallback(
        async (page = usersPaged.page, pageSize = usersPaged.pageSize) => {
            if (!authHeaders) return;
            setTabLoading(true);
            try {
                const res = await fetch(
                    `${baseUrl}/api/dashboard/users?page=${page}&pageSize=${pageSize}&sort=createdAt&order=desc`,
                    { headers: authHeaders }
                );
                if (res.status === 401) {
                    localStorage.removeItem('token');
                    router.replace('/login');
                    return;
                }
                const json = await res.json();
                const data = json.data || json;
                setUsersPaged({
                    items: data.items ?? data,
                    total: data.total ?? (data.items?.length ?? 0),
                    page: data.page ?? page,
                    pageSize: data.pageSize ?? pageSize,
                });
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setTabLoading(false);
            }
        },
        [authHeaders, baseUrl, router, usersPaged.page, usersPaged.pageSize]
    );

    const fetchPaymentsPaged = useCallback(
        async (page = paymentsPaged.page, pageSize = paymentsPaged.pageSize) => {
            if (!authHeaders) return;
            setTabLoading(true);
            try {
                const res = await fetch(
                    `${baseUrl}/api/dashboard/payments?page=${page}&pageSize=${pageSize}&sort=createdAt&order=desc`,
                    { headers: authHeaders }
                );
                if (res.status === 401) {
                    localStorage.removeItem('token');
                    router.replace('/login');
                    return;
                }
                const json = await res.json();
                const data = json.data || json;
                setPaymentsPaged({
                    items: data.items ?? data,
                    total: data.total ?? (data.items?.length ?? 0),
                    page: data.page ?? page,
                    pageSize: data.pageSize ?? pageSize,
                });
            } catch (error) {
                console.error('Error fetching payments:', error);
            } finally {
                setTabLoading(false);
            }
        },
        [authHeaders, baseUrl, router, paymentsPaged.page, paymentsPaged.pageSize]
    );

    const fetchOrdersPaged = useCallback(
        async (page = ordersPaged.page, pageSize = ordersPaged.pageSize) => {
            if (!authHeaders) return;
            setTabLoading(true);
            try {
                const res = await fetch(
                    `${baseUrl}/api/dashboard/orders?page=${page}&pageSize=${pageSize}&sort=createdAt&order=desc`,
                    { headers: authHeaders }
                );
                if (res.status === 401) {
                    localStorage.removeItem('token');
                    router.replace('/login');
                    return;
                }
                const json = await res.json();
                const data = json.data || json;
                setOrdersPaged({
                    items: (data.items ?? data) as ExtendedPurchase[],
                    total: data.total ?? (data.items?.length ?? 0),
                    page: data.page ?? page,
                    pageSize: data.pageSize ?? pageSize,
                });
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setTabLoading(false);
            }
        },
        [authHeaders, baseUrl, router, ordersPaged.page, ordersPaged.pageSize]
    );

    const fetchProductsPaged = useCallback(
        async (page = productsPaged.page, pageSize = productsPaged.pageSize) => {
            if (!authHeaders) return;
            setTabLoading(true);
            try {
                const res = await fetch(
                    `${baseUrl}/api/dashboard/products?page=${page}&pageSize=${pageSize}`,
                    { headers: authHeaders }
                );
                if (res.status === 401) {
                    localStorage.removeItem('token');
                    router.replace('/login');
                    return;
                }
                const json = await res.json();
                const data = json.data || json;
                setProductsPaged({
                    items: data.items ?? data,
                    total: data.total ?? (data.items?.length ?? 0),
                    page: data.page ?? page,
                    pageSize: data.pageSize ?? pageSize,
                });
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setTabLoading(false);
            }
        },
        [authHeaders, baseUrl, router, productsPaged.page, productsPaged.pageSize]
    );

    // lazy load saat tab berubah pertama kali
    useEffect(() => {
        if (!authHeaders) return;
        if (activeTab === 'users' && usersPaged.items.length === 0) fetchUsersPaged(1, usersPaged.pageSize);
        if (activeTab === 'payments' && paymentsPaged.items.length === 0) fetchPaymentsPaged(1, paymentsPaged.pageSize);
        // Skip orders if already loaded during bootstrap
        if (activeTab === 'orders' && ordersPaged.items.length === 0) fetchOrdersPaged(1, ordersPaged.pageSize);
        if (activeTab === 'products' && productsPaged.items.length === 0) fetchProductsPaged(1, productsPaged.pageSize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, authHeaders]);

    if (loading || !user || !stats) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3E724A]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50">
                <div className="bg-white border border-red-200 rounded-lg p-6 shadow-sm">
                    <p className="text-red-700 font-medium">Failed to load dashboard</p>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-[#FDFDFD] border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div>
                            <h1 className="text-2xl font-bold" style={{ color: '#363F36' }}>Dashboard</h1>
                            <p className="text-sm" style={{ color: '#8E8E8E' }}>Welcome back, {user.name}</p>
                        </div>
                        {/* <div className="flex items-center space-x-3">
                            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-semibold bg-white hover:bg-gray-50" style={{ color: '#363F36' }}>
                                <Calendar className="w-4 h-4 mr-2" /> Last 30 days
                            </button>
                            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-semibold bg-white hover:bg-gray-50" style={{ color: '#363F36' }}>
                                <Download className="w-4 h-4 mr-2" /> Export
                            </button>
                        </div> */}
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* KPI Cards */}
                <OverviewSection stats={stats} />

                <div className="mt-4">
                    {/* Tabs */}
                    <TabNavigation tabs={TABS} activeKey={activeTab} onChange={setActiveTab} />

                    {/* Overview */}
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* LEFT: Revenue Overview */}
                            <RevenueOverview />

                            {/* RIGHT: Recent Orders */}
                            <div>
                                <DataTable<OrderDisplayData>
                                    title="Recent Orders"
                                    data={
                                        // Prioritize data from orders tab if it has product info, otherwise use recent purchases
                                        ordersPaged.items.length > 0
                                            ? ordersPaged.items.slice(0, 8)
                                            : recentPurchases.slice(0, 8)
                                    }
                                    columns={[
                                        {
                                            header: 'Order ID',
                                            renderCell: (order: OrderDisplayData) => `#${String(order.id).slice(0, 8)}`
                                        },
                                        {
                                            header: 'Product',
                                            renderCell: (order: OrderDisplayData) => getProductName(order),
                                        },
                                        {
                                            header: 'Price',
                                            renderCell: (order: OrderDisplayData) => formatCurrency(getOrderPrice(order)),
                                        },
                                        {
                                            header: 'Status',
                                            renderCell: (order: OrderDisplayData) => (
                                                <StatusBadge status={(order.status ?? 'PAID') as Payment['status']} />
                                            ),
                                        },
                                    ]}
                                    onViewAll={() => setActiveTab('orders')}
                                />
                            </div>
                        </div>
                    )}

                    {/* Users (paged) */}
                    {activeTab === 'users' && (
                        <div className={tabLoading ? 'opacity-60 pointer-events-none' : ''}>
                            <DataTable<User>
                                title="Users"
                                data={usersPaged.items.length ? usersPaged.items : recentUsers}
                                columns={[
                                    { header: 'User', renderCell: (u: User) => u.name || 'No Name' },
                                    { header: 'Email', renderCell: (u: User) => u.email },
                                    { header: 'Joined', renderCell: (u: User) => new Date(u.createdAt).toLocaleDateString('en-US') },
                                ]}
                                onViewAll={() => fetchUsersPaged(1, usersPaged.pageSize)}
                            />
                            {usersPaged.total > 0 && (
                                <PaginationControls
                                    total={usersPaged.total}
                                    page={usersPaged.page}
                                    pageSize={usersPaged.pageSize}
                                    onChange={({ page, pageSize }) => fetchUsersPaged(page ?? usersPaged.page, pageSize ?? usersPaged.pageSize)}
                                />
                            )}
                        </div>
                    )}

                    {/* Payments (paged) */}
                    {activeTab === 'payments' && (
                        <div className={tabLoading ? 'opacity-60 pointer-events-none' : ''}>
                            <DataTable<Payment>
                                title="Payments"
                                data={paymentsPaged.items.length ? paymentsPaged.items : recentPayments}
                                columns={[
                                    { header: 'Payment ID', renderCell: (p: Payment) => `#${p.id}` },
                                    {
                                        header: 'Customer',
                                        renderCell: (p: Payment) =>
                                            p.customerFirstName && p.customerLastName
                                                ? `${p.customerFirstName} ${p.customerLastName}`
                                                : p.customerEmail || 'N/A',
                                    },
                                    {
                                        header: 'Amount',
                                        renderCell: (p: Payment) => formatCurrency(p.amount),
                                    },
                                    { header: 'Status', renderCell: (p: Payment) => <StatusBadge status={p.status} /> },
                                    { header: 'Date', renderCell: (p: Payment) => new Date(p.createdAt).toLocaleDateString('en-US') },
                                ]}
                                onViewAll={() => fetchPaymentsPaged(1, paymentsPaged.pageSize)}
                            />
                            {paymentsPaged.total > 0 && (
                                <PaginationControls
                                    total={paymentsPaged.total}
                                    page={paymentsPaged.page}
                                    pageSize={paymentsPaged.pageSize}
                                    onChange={({ page, pageSize }) => fetchPaymentsPaged(page ?? paymentsPaged.page, pageSize ?? paymentsPaged.pageSize)}
                                />
                            )}
                        </div>
                    )}

                    {/* Orders (paged) */}
                    {activeTab === 'orders' && (
                        <div className={tabLoading ? 'opacity-60 pointer-events-none' : ''}>
                            <DataTable<ExtendedPurchase>
                                title="Orders"
                                data={ordersPaged.items.length ? ordersPaged.items : recentPurchases}
                                columns={[
                                    { header: 'Order ID', renderCell: (o: ExtendedPurchase) => `#${String(o.id).slice(0, 8)}` },
                                    { header: 'Product', renderCell: (o: ExtendedPurchase) => o.productTitle || getProductName(o) },
                                    { header: 'Customer', renderCell: (o: ExtendedPurchase) => o.userName || 'Unknown User' },
                                    { header: 'Type', renderCell: (o: ExtendedPurchase) => o.itemType || 'N/A' },
                                    {
                                        header: 'Price',
                                        renderCell: (o: ExtendedPurchase) => formatCurrency(Number(o.price) || 0),
                                    },
                                    { header: 'Status', renderCell: (o: ExtendedPurchase) => <StatusBadge status={(o.status || 'PAID') as Payment['status']} /> },
                                    { header: 'Date', renderCell: (o: ExtendedPurchase) => new Date(o.createdAt).toLocaleDateString('en-US') },
                                ]}
                                onViewAll={() => fetchOrdersPaged(1, ordersPaged.pageSize)}
                            />
                            {ordersPaged.total > 0 && (
                                <PaginationControls
                                    total={ordersPaged.total}
                                    page={ordersPaged.page}
                                    pageSize={ordersPaged.pageSize}
                                    onChange={({ page, pageSize }) => fetchOrdersPaged(page ?? ordersPaged.page, pageSize ?? ordersPaged.pageSize)}
                                />
                            )}
                        </div>
                    )}

                    {/* Products (paged) */}
                    {activeTab === 'products' && (
                        <div className={tabLoading ? 'opacity-60 pointer-events-none' : ''}>
                            <DataTable<Course>
                                title="Top Selling Products"
                                data={productsPaged.items.length ? productsPaged.items : topCoursesSnapshot}
                                columns={[
                                    { header: 'Product', renderCell: (c: Course) => c.title },
                                    { header: 'Type', renderCell: (c: Course) => c.type || 'COURSE' },
                                    {
                                        header: 'Unit Price',
                                        renderCell: (c: Course) => formatCurrency(Number(c.price)),
                                    },
                                    { header: 'Sales', renderCell: (c: Course) => c.totalSales ?? 0 },
                                    {
                                        header: 'Total Revenue',
                                        renderCell: (c: Course) => formatCurrency(Number(c.totalRevenue ?? 0)),
                                    },
                                ]}
                                onViewAll={() => fetchProductsPaged(1, productsPaged.pageSize)}
                            />
                            {productsPaged.total > 0 && (
                                <PaginationControls
                                    total={productsPaged.total}
                                    page={productsPaged.page}
                                    pageSize={productsPaged.pageSize}
                                    onChange={({ page, pageSize }) => fetchProductsPaged(page ?? productsPaged.page, pageSize ?? productsPaged.pageSize)}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}