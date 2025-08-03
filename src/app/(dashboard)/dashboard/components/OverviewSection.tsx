'use client';

import React from 'react';
// import { Stats, OverviewSectionProps } from '../types/dashboard';
import { KpiCard } from './KpiCard';
import { TrendingUp, Users, BookOpen, Eye } from 'lucide-react';
import { OverviewSectionProps } from '../types/dashboard';


export function OverviewSection({ stats }: OverviewSectionProps) {
    const cards = [
        {
            title: 'Total Revenue',
            value: new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0
            }).format(stats.revenue ?? 0),
            change: '+12.5%',
            trend: 'up' as const,
            icon: TrendingUp,
            color: 'text-green-600 bg-green-50'
        },
        {
            title: 'Active Users',
            value: (stats.users ?? 0).toLocaleString(),
            change: '+8.2%',
            trend: 'up' as const,
            icon: Users,
            color: 'text-blue-600 bg-blue-50'
        },
        {
            title: 'Courses',
            value: (stats.courses ?? 0).toString(),
            change: '+2.1%',
            trend: 'up' as const,
            icon: BookOpen,
            color: 'text-purple-600 bg-purple-50'
        },
        {
            title: 'Total Lessons',
            value: (stats.lessons ?? 0).toString(),
            change: '+15.3%',
            trend: 'up' as const,
            icon: Eye,
            color: 'text-orange-600 bg-orange-50'
        }
    ];

    return (
        <section>
            {/* Ini heading Overview-nya */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((c, i) => (
                    <KpiCard key={i} {...c} />
                ))}
            </div>
        </section>
    );
}
