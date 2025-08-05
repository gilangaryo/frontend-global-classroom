import { useState, useEffect } from 'react';
import { dashboardApi, ApiError } from '../app/utils/api';
import type { Stats, User, Payment, Purchase, Course } from '../app/utils/api';

export function useDashboardStats() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            const data = await dashboardApi.getStats();
            setStats(data);
        } catch (err) {
            console.error('Error fetching dashboard stats:', err);
            const errorMessage = err instanceof ApiError ? err.message :
                err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return {
        stats,
        loading,
        error,
        refetch: fetchStats
    };
}

interface DashboardData {
    stats: Stats | null;
    users: User[];
    payments: Payment[];
    purchases: Purchase[];
    courses: Course[];
}

export function useDashboardData() {
    const [data, setData] = useState<DashboardData>({
        stats: null,
        users: [],
        payments: [],
        purchases: [],
        courses: []
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAllData = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            const result = await dashboardApi.getAllData();

            setData({
                stats: result.stats,
                users: result.users,
                payments: result.payments,
                purchases: result.orders,
                courses: result.products
            });

        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            const errorMessage = err instanceof ApiError ? err.message :
                err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    return {
        ...data,
        loading,
        error,
        refetch: fetchAllData
    };
}

export function useDashboardUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const data = await dashboardApi.getUsers();
            setUsers(data);
        } catch (err) {
            const errorMessage = err instanceof ApiError ? err.message :
                err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return { users, loading, error, refetch: fetchUsers };
}

export function useDashboardPayments() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPayments = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const data = await dashboardApi.getPayments();
            setPayments(data);
        } catch (err) {
            const errorMessage = err instanceof ApiError ? err.message :
                err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    return { payments, loading, error, refetch: fetchPayments };
}

export function useDashboardPurchases() {
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPurchases = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const data = await dashboardApi.getOrders();
            setPurchases(data);
        } catch (err) {
            const errorMessage = err instanceof ApiError ? err.message :
                err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPurchases();
    }, []);

    return { purchases, loading, error, refetch: fetchPurchases };
}

export function useDashboardCourses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCourses = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const data = await dashboardApi.getProducts();
            setCourses(data);
        } catch (err) {
            const errorMessage = err instanceof ApiError ? err.message :
                err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    return { courses, loading, error, refetch: fetchCourses };
}