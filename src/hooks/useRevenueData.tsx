// hooks/useRevenueData.ts
import { useState, useEffect } from 'react';
import { dashboardApi, ApiError } from '../app/utils/api';
import type { RevenueData, MonthlyRevenue, TopProduct } from '../app/utils/api';

export function useRevenueOverview() {
    const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRevenueData = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            const data = await dashboardApi.getRevenueOverview();
            setRevenueData(data);
        } catch (err) {
            console.error('Error fetching revenue overview:', err);
            const errorMessage = err instanceof ApiError ? err.message :
                err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRevenueData();
    }, []);

    return {
        revenueData,
        loading,
        error,
        refetch: fetchRevenueData
    };
}

export function useMonthlyRevenue() {
    const [monthlyData, setMonthlyData] = useState<MonthlyRevenue[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMonthlyData = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            const data = await dashboardApi.getMonthlyRevenue();
            setMonthlyData(data);
        } catch (err) {
            console.error('Error fetching monthly revenue:', err);
            const errorMessage = err instanceof ApiError ? err.message :
                err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMonthlyData();
    }, []);

    return {
        monthlyData,
        loading,
        error,
        refetch: fetchMonthlyData
    };
}

export function useTopProducts() {
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTopProducts = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            const data = await dashboardApi.getTopProducts();
            setTopProducts(data);
        } catch (err) {
            console.error('Error fetching top products:', err);
            const errorMessage = err instanceof ApiError ? err.message :
                err instanceof Error ? err.message : 'Unknown error occurred';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopProducts();
    }, []);

    return {
        topProducts,
        loading,
        error,
        refetch: fetchTopProducts
    };
}