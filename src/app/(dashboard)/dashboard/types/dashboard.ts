// types/dashboard.ts - Simple version dengan semua types yang dibutuhkan
export interface Stats {
    revenue: number;
    users: number;
    courses: number;
    lessons: number;
    units?: number;
    subunits?: number;
}

export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    role?: string;
}

export interface Payment {
    id: string;
    userId: string;
    amount: number;
    status: 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED';
    createdAt: string;
    customerEmail?: string;
    customerFirstName?: string;
    customerLastName?: string;
}

export interface Purchase {
    id: string;
    userId: string;
    itemId: string;
    itemType: 'COURSE' | 'UNIT' | 'SUBUNIT' | 'LESSON';
    price: number;
    createdAt: string;
    status?: string;
    productTitle?: string;
    userName?: string;
}

export interface Course {
    id: string;
    title: string;
    price: number;
    type?: string;
    totalRevenue?: number;
    totalSales?: number;
}

export interface TabItem {
    key: 'overview' | 'users' | 'payments' | 'orders' | 'products';
    label: string;
}

export interface RevenueData {
    totalRevenue: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
    chartData: MonthlyRevenue[];
    topProducts: TopProduct[];
}

export interface MonthlyRevenue {
    month: string;
    year: number;
    revenue: number;
    count: number;
}

export interface TopProduct {
    productId: string;
    title: string;
    type: string;
    totalRevenue: number;
    totalSales: number;
    unitPrice: number;
}

export interface OverviewSectionProps {
    stats?: Stats;
}