'use client';

import React from 'react';
import { BookOpen, Users, Eye, Package } from 'lucide-react';
import type { Stats } from '../types/dashboard';

export interface QuickStatsProps {
    stats: Stats;
}

export function QuickStats({ stats }: QuickStatsProps) {
    const quickStatsData = [
        {
            name: 'Total Courses',
            value: stats.courses?.toString() || '0',
            icon: BookOpen,
            color: 'text-blue-600'
        },
        {
            name: 'Total Units',
            value: stats.units?.toString() || '0',
            icon: Package,
            color: 'text-purple-600'
        },
        {
            name: 'Total Lessons',
            value: stats.lessons?.toString() || '0',
            icon: Eye,
            color: 'text-green-600'
        },
        {
            name: 'Active Users',
            value: stats.users?.toString() || '0',
            icon: Users,
            color: 'text-orange-600'
        }
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Stats</h3>

            <div className="space-y-4">
                {quickStatsData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className={`p-2 rounded-lg bg-gray-50 mr-3 ${item.color}`}>
                                <item.icon className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                                {item.name}
                            </span>
                        </div>
                        <span className="text-lg font-semibold text-gray-900">
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}