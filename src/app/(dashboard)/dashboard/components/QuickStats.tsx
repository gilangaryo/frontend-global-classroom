'use client';

import React from 'react';
import { Stats } from '../types/dashboard';

interface Props { stats: Stats }

export function QuickStats({ stats }: Props) {
    const { units, subunits, lessons, users, revenue, courses } = stats;
    const avg = users > 0 ? revenue / users : 0;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4 text-gray-600">
                <div className="flex justify-between">
                    <span>Units Created</span>
                    <span className="font-semibold">{units}</span>
                </div>
                <div className="flex justify-between">
                    <span>Subunits</span>
                    <span className="font-semibold">{subunits}</span>
                </div>
                <div className="flex justify-between">
                    <span>Avg. Revenue per User</span>
                    <span className="font-semibold">
                        {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            maximumFractionDigits: 0
                        }).format(avg)}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>Lessons per Course</span>
                    <span className="font-semibold">
                        {courses > 0 ? Math.round(lessons / courses) : 0}
                    </span>
                </div>
            </div>
        </div>
    );
}
