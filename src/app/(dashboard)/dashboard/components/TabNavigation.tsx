'use client';
import React from 'react';
import { TabItem } from '../types/dashboard';

interface Props {
    tabs: TabItem[];
    activeKey: string;
    onChange: (key: string) => void;
}

export function TabNavigation({ tabs, activeKey, onChange }: Props) {
    return (
        <nav className="flex space-x-8 border-b border-gray-200 mb-6">
            {tabs.map(tab => (
                <button
                    key={tab.key}
                    onClick={() => onChange(tab.key)}
                    className={`py-2 px-1 border-b-2 font-semibold text-sm ${activeKey === tab.key
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </nav>
    );
}
