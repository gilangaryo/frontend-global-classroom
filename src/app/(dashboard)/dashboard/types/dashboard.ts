// types/dashboard.ts

export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: string;
}

export interface Payment {
    id: string;
    userId: string;
    amount: number;
    status: 'completed' | 'pending' | 'failed' | 'processing' | string;
    createdAt: string;
}

export interface Purchase {
    id: string;
    userId: string;
    itemId: string;
    itemType: string;
    price: number;
    createdAt: string;
}

export interface Course {
    id: string;
    title: string;
    price: number;
}

export interface Stats {
    courses: number;
    units: number;
    subunits: number;
    lessons: number;
    revenue: number;
    users: number;
}

export interface KpiCardProps {
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: React.ComponentType<{ className?: string }>;
    color: string;
}

export interface TabItem {
    key: string;
    label: string;
}

export interface StatusBadgeProps {
    status: Payment['status'];
}

export interface OverviewSectionProps {
    stats: Stats;
}

export interface TableColumn<T> {
    header: string;
    renderCell: (item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
    data: T[];
    columns: TableColumn<T>[];
    title: string;
    onViewAll?: () => void;
}
