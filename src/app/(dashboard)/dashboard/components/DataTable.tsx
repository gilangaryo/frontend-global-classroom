'use client';
import React from 'react';
import { DataTableProps } from '../types/dashboard';

export function DataTable<T>({ data, columns, title, onViewAll }: DataTableProps<T>) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                {onViewAll && (
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold" onClick={onViewAll}>
                        View all
                    </button>
                )}
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((col, i) => (
                                <th
                                    key={i}
                                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((item, ri) => (
                            <tr key={ri} className="hover:bg-gray-50">
                                {columns.map((col, ci) => (
                                    <td key={ci} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {col.renderCell(item)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
