// components/StatusBadge.tsx
'use client';

import React from 'react';

export interface StatusBadgeProps {
    status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const getStatusConfig = (status: string) => {
        const normalizedStatus = status.toUpperCase();

        switch (normalizedStatus) {
            case 'PAID':
                return {
                    color: 'bg-green-100 text-green-800',
                    label: 'Paid'
                };
            case 'PENDING':
                return {
                    color: 'bg-yellow-100 text-yellow-800',
                    label: 'Pending'
                };
            case 'CANCELLED':
                return {
                    color: 'bg-red-100 text-red-800',
                    label: 'Cancelled'
                };
            case 'EXPIRED':
                return {
                    color: 'bg-gray-100 text-gray-800',
                    label: 'Expired'
                };
            case 'REFUNDED':
                return {
                    color: 'bg-purple-100 text-purple-800',
                    label: 'Refunded'
                };
            case 'PROCESSING':
                return {
                    color: 'bg-blue-100 text-blue-800',
                    label: 'Processing'
                };
            case 'COMPLETED':
                return {
                    color: 'bg-green-100 text-green-800',
                    label: 'Completed'
                };
            case 'FAILED':
                return {
                    color: 'bg-red-100 text-red-800',
                    label: 'Failed'
                };
            default:
                return {
                    color: 'bg-gray-100 text-gray-800',
                    label: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
                };
        }
    };

    const { color, label } = getStatusConfig(status);

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
            {label}
        </span>
    );
}