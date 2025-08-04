'use client';

import React from 'react';
import { KpiCard } from './KpiCard';
import { TrendingUp, Users, BookOpen, Eye, RefreshCw } from 'lucide-react';
import { useDashboardStats } from '../hooks/useDashboardStats';
import type { Stats } from '../../../utils/api';

// Props interface untuk jika ingin pass stats dari parent
export interface OverviewSectionProps {
    stats?: Stats;
}

// Card data interface
interface CardData {
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: string;
}

export function OverviewSection({ stats: propStats }: OverviewSectionProps = {}) {
    const { stats: hookStats, loading, error, refetch } = useDashboardStats();

    // Use props stats if provided, otherwise use hook stats
    const stats = propStats || hookStats;

    if (loading) {
        return (
            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <div className="animate-pulse">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                                </div>
                                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-red-800 font-semibold">Failed to load data</h3>
                            <p className="text-red-600 text-sm mt-1">{error}</p>
                        </div>
                        <button
                            onClick={refetch}
                            className="flex items-center px-3 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-100 transition-colors"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Retry
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    if (!stats) {
        return (
            <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
                <div className="text-gray-500 text-center py-8">No data available</div>
            </section>
        );
    }

    const cards: CardData[] = [
        {
            title: 'Total Revenue',
            value: new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
            }).format(stats.revenue ?? 0),
            change: '+12.5%',
            trend: 'up',
            icon: TrendingUp,
            color: 'text-green-600 bg-green-50'
        },
        {
            title: 'Active Users',
            value: (stats.users ?? 0).toLocaleString(),
            change: '+8.2%',
            trend: 'up',
            icon: Users,
            color: 'text-blue-600 bg-blue-50'
        },
        {
            title: 'Courses',
            value: (stats.courses ?? 0).toString(),
            change: '+2.1%',
            trend: 'up',
            icon: BookOpen,
            color: 'text-purple-600 bg-purple-50'
        },
        {
            title: 'Total Lessons',
            value: (stats.lessons ?? 0).toString(),
            change: '+15.3%',
            trend: 'up',
            icon: Eye,
            color: 'text-orange-600 bg-orange-50'
        }
    ];

    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
                {!propStats && (
                    <button
                        onClick={refetch}
                        className="flex items-center px-3 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        disabled={loading}
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <KpiCard key={i} {...card} />
                ))}
            </div>
        </section>
    );
}