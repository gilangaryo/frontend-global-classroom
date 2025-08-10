// components/KpiCard.tsx
'use client';

import React from 'react';

export interface KpiCardProps {
    title: string;
    value: string;
    change?: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: string;
}

export function KpiCard({ title, value, icon: Icon, color }: KpiCardProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                <div className={`p-2 rounded-lg ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>

            <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
}
