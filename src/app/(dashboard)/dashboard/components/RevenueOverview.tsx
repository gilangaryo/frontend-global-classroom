// components/RevenueOverview.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, RefreshCw } from 'lucide-react';
import { dashboardApi } from '../../../utils/api';
import type { RevenueData } from '../../../utils/api';

interface RevenueOverviewProps {
    data?: RevenueData;
}

export function RevenueOverview({ data: propData }: RevenueOverviewProps = {}) {
    const [revenueData, setRevenueData] = useState<RevenueData | null>(propData || null);
    const [loading, setLoading] = useState<boolean>(!propData);
    const [error, setError] = useState<string | null>(null);

    const fetchRevenueData = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const data = await dashboardApi.getRevenueOverview();
            setRevenueData(data);
        } catch (err) {
            console.error('Error fetching revenue data:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch revenue data';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!propData) {
            fetchRevenueData();
        }
    }, [propData]);

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="animate-pulse">
                    <div className="flex items-center justify-between mb-6">
                        <div className="h-6 bg-gray-200 rounded w-32"></div>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="mb-6">
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-36"></div>
                    </div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
                    <button
                        onClick={fetchRevenueData}
                        className="flex items-center px-3 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-100 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Retry
                    </button>
                </div>
                <div className="text-red-600 text-sm">{error}</div>
            </div>
        );
    }

    if (!revenueData) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
                <div className="text-gray-500 text-center py-8">No revenue data available</div>
            </div>
        );
    }

    const isPositiveGrowth = revenueData.growth >= 0;
    const TrendIcon = isPositiveGrowth ? TrendingUp : TrendingDown;
    const trendColor = isPositiveGrowth ? 'text-green-600' : 'text-red-600';

    // Calculate max revenue for chart scaling
    const maxRevenue = revenueData.chartData.length > 0
        ? Math.max(...revenueData.chartData.map(d => d.revenue))
        : 1;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
                <div className={`flex items-center ${trendColor}`}>
                    <TrendIcon className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">
                        {isPositiveGrowth ? '+' : ''}{revenueData.growth}%
                    </span>
                </div>
            </div>

            <div className="mb-6">
                <div className="flex items-center mb-2">
                    <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm text-gray-500">This Month</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(revenueData.thisMonth)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                    vs {formatCurrency(revenueData.lastMonth)} last month
                </p>
            </div>

            {/* Real chart with data */}
            {revenueData.chartData.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-700">Last {revenueData.chartData.length} Months</h4>
                        {!propData && (
                            <button
                                onClick={fetchRevenueData}
                                className="text-xs text-gray-500 hover:text-gray-700"
                                disabled={loading}
                            >
                                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                        )}
                    </div>

                    <div className="flex items-end space-x-2 h-32">
                        {revenueData.chartData.map((data, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center group">
                                <div className="relative w-full">
                                    <div
                                        className="w-full bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600 cursor-pointer"
                                        style={{
                                            height: `${(data.revenue / maxRevenue) * 100}%`,
                                            minHeight: '4px'
                                        }}
                                        title={`${data.month} ${data.year}: ${formatCurrency(data.revenue)} (${data.count} sales)`}
                                    ></div>

                                    {/* Tooltip on hover */}
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                        {formatCurrency(data.revenue)}
                                        <br />
                                        {data.count} sales
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500 mt-2">{data.month}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>{formatCurrency(Math.min(...revenueData.chartData.map(d => d.revenue)))}</span>
                        <span>{formatCurrency(maxRevenue)}</span>
                    </div>
                </div>
            )}

            {/* Total Revenue Summary */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Total Revenue</span>
                    <span className="text-lg font-semibold text-gray-900">
                        {formatCurrency(revenueData.totalRevenue)}
                    </span>
                </div>
            </div>
        </div>
    );
}