'use client';

import React from 'react';

export interface DataTableColumn<T> {
    header: string;
    renderCell: (item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
    title: string;
    data: T[];
    columns: DataTableColumn<T>[];
    onViewAll?: () => void;
}

export function DataTable<T>({ title, data, columns, onViewAll }: DataTableProps<T>) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                    {onViewAll && (
                        <button
                            onClick={onViewAll}
                            className="text-sm font-medium px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50"
                        >
                            View all
                        </button>
                    )}
                </div>
                <div className="text-center py-8 text-gray-500">No data available</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                {onViewAll && (
                    <button
                        onClick={onViewAll}
                        className="text-sm font-medium px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50"
                    >
                        View all
                    </button>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((item, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50">
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {column.renderCell(item)}
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
