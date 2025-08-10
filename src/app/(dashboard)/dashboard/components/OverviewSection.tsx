'use client';

import React, { useMemo } from 'react';
import { KpiCard } from './KpiCard';
import { TrendingUp, BookOpen, Eye, Package, RefreshCw } from 'lucide-react';
import { useDashboardStats } from '../../../../hooks/useDashboardStats';
import type { Stats } from '../../../utils/api';

export interface OverviewSectionProps {
    stats?: Stats;        // jika disediakan, skip fetch
    showRefresh?: boolean; // default true saat stats tidak disediakan
}

interface CardData {
    title: string;
    value: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    colorClass: string;
}

export function OverviewSection({ stats: propStats, showRefresh }: OverviewSectionProps = {}) {
    const { stats: hookStats, loading, error, refetch } = useDashboardStats({ enabled: !propStats });
    const stats = propStats ?? hookStats;
    const shouldShowRefresh = showRefresh ?? !propStats;

    const cards: CardData[] = useMemo(() => {
        const formatCurrency = (amount: number): string =>
            new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

        if (!stats) {
            return [
                { title: 'Total Revenue', value: formatCurrency(0), icon: TrendingUp, colorClass: 'text-[#3E724A] bg-[#EFE9E9]' },
                { title: 'Courses', value: '0', icon: BookOpen, colorClass: 'text-[#4E3D34] bg-[#EFE9E9]' },
                { title: 'Units', value: '0', icon: Package, colorClass: 'text-[#363F36] bg-[#EFE9E9]' },
                { title: 'Lessons', value: '0', icon: Eye, colorClass: 'text-[#D9C7BF] bg-[#191919]/5' },
            ];
        }

        return [
            {
                title: 'Total Revenue',
                value: formatCurrency(Number(stats.revenue ?? 0)),
                icon: TrendingUp,
                colorClass: 'text-[#3E724A] bg-[#EFE9E9]',
            },
            {
                title: 'Courses',
                value: String(stats.courses ?? 0),
                icon: BookOpen,
                colorClass: 'text-[#4E3D34] bg-[#EFE9E9]',
            },
            {
                title: 'Units',
                value: String(stats.units ?? 0),
                icon: Package,
                colorClass: 'text-[#363F36] bg-[#EFE9E9]',
            },
            {
                title: 'Lessons',
                value: String(stats.lessons ?? 0),
                icon: Eye,
                colorClass: 'text-[#D9C7BF] bg-[#191919]/5',
            },
        ];
    }, [stats]);

    if (loading) {
        return (
            <section>
                <h2 className="text-2xl font-bold mb-6" style={{ color: '#363F36' }}>Overview</h2>
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
                <h2 className="text-2xl font-bold mb-6" style={{ color: '#363F36' }}>Overview</h2>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-red-800 font-semibold">Failed to load data</h3>
                            <p className="text-red-600 text-sm mt-1">{error}</p>
                        </div>
                        {shouldShowRefresh && (
                            <button
                                onClick={refetch}
                                className="flex items-center px-3 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-100 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Retry
                            </button>
                        )}
                    </div>
                </div>
            </section>
        );
    }

    if (!stats) {
        return (
            <section>
                <h2 className="text-2xl font-bold mb-6" style={{ color: '#363F36' }}>Overview</h2>
                <div className="text-center py-8" style={{ color: '#8E8E8E' }}>No data available</div>
            </section>
        );
    }

    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: '#363F36' }}>Overview</h2>
                {shouldShowRefresh && (
                    <button
                        onClick={refetch}
                        className="flex items-center px-3 py-2 border rounded-md hover:bg-gray-50 transition-colors"
                        style={{ color: '#363F36', borderColor: '#D9C7BF' }}
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <KpiCard
                        key={i}
                        title={card.title}
                        value={card.value}
                        icon={card.icon}
                        color={card.colorClass}
                    />
                ))}
            </div>
        </section>
    );
}
