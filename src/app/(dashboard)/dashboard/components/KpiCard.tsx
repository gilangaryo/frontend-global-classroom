'use client';
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { KpiCardProps } from '../types/dashboard';

export function KpiCard({ title, value, change, trend, icon: Icon, color }: KpiCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center text-sm font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {change}
                </div>
            </div>
            <div className="mt-4">
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500">{title}</p>
            </div>
        </div>
    );
}
