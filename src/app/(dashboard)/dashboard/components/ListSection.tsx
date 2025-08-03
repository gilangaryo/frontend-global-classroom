// components/ListSection.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import StatusDropdown from './StatusDropdown';

export interface BaseItem {
    id: number;
    title: string;
    imageUrl?: string | null;
    isActive?: boolean;
}

interface ListSectionProps {
    items: BaseItem[] | null;
    label: string;
    /** Base path untuk link “Add” dan “Edit” */
    editBase: string;
    /** Base path untuk API status toggle, e.g. "/api/courses/status" */
    statusUrl: string;
}

export function ListSection({
    items,
    label,
    editBase,
    statusUrl
}: ListSectionProps) {
    // Fungsi untuk update status via API
    async function updateStatus(id: number, isActive: boolean) {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}${statusUrl}/${id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ isActive })
                }
            );
            if (!res.ok) {
                const err = await res.json();
                alert(err.message || 'Failed to update status.');
            }
        } catch (e) {
            console.error(e);
            alert('Error updating status.');
        }
    }

    // Loading state
    if (items === null) {
        return <p className="text-center text-sm text-gray-500">Loading…</p>;
    }

    // Empty state
    if (items.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="mb-4 text-gray-600">No {label}s added yet.</p>
                <Link
                    href={`${editBase}/add`}
                    className="inline-block bg-sky-500 text-white px-4 py-2 rounded"
                >
                    Add {label}
                </Link>
            </div>
        );
    }

    // Render list
    return (
        <div className="rounded-lg border">
            {/* Header */}
            <div className="flex bg-sky-500 text-white font-semibold text-sm rounded-t-lg">
                <div className="flex-1 px-4 py-2">{label}</div>
                <div className="w-80 px-4 py-2 text-center">Course</div>
                <div className="w-32 px-4 py-2 text-center">Status</div>
                <div className="w-32 px-4 py-2 text-center">Action</div>
            </div>

            {/* Rows */}
            {items.map(item => (
                <div
                    key={item.id}
                    className="flex items-center border-t hover:bg-gray-50"
                >
                    <div className="flex-1 px-4 py-3">{item.title}</div>

                    <div className="w-80 px-4 py-3">
                        <StatusDropdown
                            initialStatus={item.isActive ?? true}
                            onStatusChange={newStatus =>
                                updateStatus(item.id, newStatus)
                            }
                        />
                    </div>

                    <div className="w-32 px-4 py-3 flex justify-center space-x-2">
                        <Link
                            href={`${editBase}/${item.id}/edit`}
                            className="px-3 py-1 bg-sky-500 text-white text-sm rounded"
                        >
                            Edit
                        </Link>
                        <button
                            onClick={() => {
                                /* TODO: delete item */
                            }}
                            className="px-2 py-1 border rounded text-sm"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
