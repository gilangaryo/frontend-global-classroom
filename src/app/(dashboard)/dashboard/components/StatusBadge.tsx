'use client';
import React from 'react';
import { StatusBadgeProps } from '../types/dashboard';

const styles: Record<StatusBadgeProps['status'], string> = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
    processing: 'bg-blue-100 text-blue-800',
};

export function StatusBadge({ status }: StatusBadgeProps) {
    const key = status.toLowerCase() as keyof typeof styles;
    const css = styles[key] || 'bg-gray-100 text-gray-800';
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${css}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}
