// components/KpiCard.tsx
'use client';

import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

export interface KpiCardProps {
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: string;
}

export function KpiCard({ title, value, change, trend, icon: Icon, color }: KpiCardProps) {
    const trendColor = trend === 'up' ? 'text-green-600' : 'text-red-600';
    const TrendIcon = trend === 'up' ? ArrowUpIcon : ArrowDownIcon;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                <div className={`p-2 rounded-lg ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>

            <div className="flex items-end justify-between">
                <div>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`flex items-center text-sm font-medium ${trendColor}`}>
                    <TrendIcon className="w-4 h-4 mr-1" />
                    {change}
                </div>
            </div>
        </div>
    );
}