// components/TopProducts.tsx
'use client';

import React from 'react';
import { Trophy, Package, TrendingUp } from 'lucide-react';
import { useTopProducts } from '../hooks/useRevenueData';
import type { TopProduct } from '../../../utils/api';

interface TopProductsProps {
    data?: TopProduct[];
}

export function TopProducts({ data: propData }: TopProductsProps = {}) {
    const { topProducts, loading, error } = useTopProducts();

    const products = propData || topProducts;

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getProductTypeColor = (type: string): string => {
        switch (type.toUpperCase()) {
            case 'COURSE': return 'bg-blue-100 text-blue-800';
            case 'UNIT': return 'bg-green-100 text-green-800';
            case 'SUBUNIT': return 'bg-purple-100 text-purple-800';
            case 'LESSON': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading && !propData) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="animate-pulse">
                    <div className="flex items-center mb-6">
                        <div className="h-6 bg-gray-200 rounded w-32"></div>
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="h-8 w-8 bg-gray-200 rounded mr-3"></div>
                                    <div>
                                        <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                                    </div>
                                </div>
                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error && !propData) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
                <div className="text-red-600 text-sm text-center py-4">{error}</div>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
                <div className="text-gray-500 text-center py-8">No product data available</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-6">
                <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
            </div>

            <div className="space-y-4">
                {products.map((product, index) => (
                    <div key={product.productId} className="flex items-center justify-between hover:bg-gray-50 p-3 rounded-lg transition-colors">
                        <div className="flex items-center">
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full mr-3 font-semibold text-sm">
                                #{index + 1}
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900 truncate max-w-xs">
                                    {product.title}
                                </h4>
                                <div className="flex items-center mt-1 space-x-2">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getProductTypeColor(product.type)}`}>
                                        {product.type}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {product.totalSales} sales
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="font-semibold text-gray-900">
                                {formatCurrency(product.totalRevenue)}
                            </div>
                            <div className="text-xs text-gray-500">
                                {formatCurrency(product.unitPrice)} per unit
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                        <Package className="w-4 h-4 mr-1" />
                        <span>Total Products: {products.length}</span>
                    </div>
                    <div className="flex items-center text-green-600">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span>
                            Total Revenue: {formatCurrency(products.reduce((sum, p) => sum + p.totalRevenue, 0))}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}