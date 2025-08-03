'use client';
import React from 'react';

interface TabBarProps {
    items: { id: number | string; title: string }[];
    activeId: number | string | null;
    onTabClick: (id: number | string) => void;
}

export default function TabBar({ items, activeId, onTabClick }: TabBarProps) {
    return (
        <nav className="flex border-b border-gray-300 gap-6 mb-4">
            {items.map((item) => {
                const isActive = item.id === activeId;
                return (
                    <button
                        key={item.id}
                        onClick={() => onTabClick(item.id)}
                        className={`text-sm font-semibold px-2 py-1 border-b-2 focus:outline-none
              ${isActive ? 'text-[#3E724A] border-[#3E724A]' : 'text-[#8E8E8E] border-transparent'}`}
                    >
                        {item.title}
                    </button>
                );
            })}
        </nav>
    );
}
