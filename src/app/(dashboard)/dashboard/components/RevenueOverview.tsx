'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';

export function RevenueOverview() {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
            <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                    <p className="text-gray-500">Chart visualization would go here</p>
                </div>
            </div>
        </div>
    );
}
