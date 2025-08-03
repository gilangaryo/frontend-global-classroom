'use client';
import { Unit } from './LessonList';
import { useMemo, useState, useEffect, useRef } from 'react';

type Props = {
    initialUnits: Unit[];
    unit: string;
    setUnit: (v: string) => void;
    colorClass?: string;
    tag: string;
    setTag: (v: string) => void;
    allLessonTags?: string[];
    onTagSearch?: (searchTerm: string) => void;
};

export default function LessonSidebar({
    initialUnits,
    unit,
    setUnit,
    colorClass,
    tag,
    setTag,
    allLessonTags = [],
    onTagSearch,
}: Props) {
    const [tagSearchTerm, setTagSearchTerm] = useState('');
    const [showTagDropdown, setShowTagDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const uniqueTags = useMemo(() => {
        const unitTags = Array.from(new Set(initialUnits.flatMap(u => u.tags ?? [])));
        const lessonTags = Array.from(new Set(allLessonTags));
        const allTags = Array.from(new Set([...unitTags, ...lessonTags]));

        return allTags.filter(tag => tag && tag.trim()).sort();
    }, [initialUnits, allLessonTags]);

    const filteredTags = useMemo(() => {
        if (!tagSearchTerm) return uniqueTags;
        return uniqueTags.filter(t =>
            t.toLowerCase().includes(tagSearchTerm.toLowerCase())
        );
    }, [uniqueTags, tagSearchTerm]);

    const filteredUnits = initialUnits;

    useEffect(() => {
        if (tag && !tagSearchTerm) {
            setTagSearchTerm(tag);
        }
    }, [tag, tagSearchTerm]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowTagDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleTagSelect = (selectedTag: string) => {
        setTag(selectedTag);
        setTagSearchTerm(selectedTag);
        setShowTagDropdown(false);
        if (onTagSearch) {
            onTagSearch(selectedTag);
        }
    };

    const handleTagSearchInput = (value: string) => {
        setTagSearchTerm(value);
        setShowTagDropdown(true);

        if (!value) {
            setTag('');
            if (onTagSearch) {
                onTagSearch('');
            }
        }
    };

    const clearTagFilter = () => {
        setTag('');
        setTagSearchTerm('');
        setShowTagDropdown(false);
        if (onTagSearch) {
            onTagSearch('');
        }
    };

    return (
        <aside className="space-y-8 md:col-span-2 pt-2 mr-30">
            <div className="mb-6">
                <h4 className="font-bold text-xs mb-3 tracking-widest text-green-active">
                    ALL UNITS
                </h4>
                <ul>
                    {filteredUnits.length === 0 ? (
                        <li className="text-sm text-gray-500 italic">
                            No units available
                        </li>
                    ) : (
                        filteredUnits.map((u) => {
                            const isSelected = unit === u.id;
                            const colorStyle = {
                                color: isSelected ? colorClass : '#8E8E8E',
                                borderBottom: isSelected ? `3px solid ${colorClass}` : '3px solid transparent',
                            };
                            return (
                                <li key={u.id}>
                                    <button
                                        onClick={() => setUnit(unit === u.id ? '' : u.id)}
                                        className="block w-full text-left py-2 transition font-semibold hover:opacity-70 mb-4"
                                        style={colorStyle}
                                        title={u.title}
                                    >
                                        {u.title}
                                    </button>
                                </li>
                            );
                        })
                    )}
                </ul>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#EFE9E9]">
                <h2 className="text-sm font-semibold text-[#363F36]">FILTERS</h2>

                <div className="relative" ref={dropdownRef}>
                    <label className="block text-xs text-[#8E8E8E] mb-1">
                        Search Tags ({uniqueTags.length} available)
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full border rounded px-2 py-1 text-sm text-[#363F36] bg-[#EFE9E9] pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Search or select tag..."
                            value={tagSearchTerm}
                            onChange={(e) => handleTagSearchInput(e.target.value)}
                            onFocus={() => setShowTagDropdown(true)}
                        />

                        {(tagSearchTerm || tag) && (
                            <button
                                onClick={clearTagFilter}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
                                title="Clear tag filter"
                            >
                                ×
                            </button>
                        )}

                        {showTagDropdown && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-b max-h-48 overflow-y-auto z-20 shadow-lg">
                                {filteredTags.length === 0 ? (
                                    <div className="px-2 py-1 text-sm text-gray-500 italic">
                                        {tagSearchTerm ? `No tags found for "${tagSearchTerm}"` : 'No tags available'}
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleTagSelect('')}
                                            className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 border-b"
                                        >
                                            <span className="text-gray-500">All Tags ({uniqueTags.length})</span>
                                        </button>
                                        {filteredTags.map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => handleTagSelect(t)}
                                                className={`w-full text-left px-2 py-1 text-sm hover:bg-gray-100 ${tag === t ? 'bg-blue-50 text-blue-700 font-medium' : ''
                                                    }`}
                                                title={t}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {tag && (
                        <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <span className="max-w-[120px] truncate" title={tag}>{tag}</span>
                                <button
                                    onClick={clearTagFilter}
                                    className="ml-1 text-blue-600 hover:text-blue-800"
                                    title="Remove filter"
                                >
                                    ×
                                </button>
                            </span>
                        </div>
                    )}
                </div>

                {uniqueTags.length > 0 && !showTagDropdown && !tag && (
                    <div className="text-xs text-gray-500">
                        <p className="mb-1">Popular tags:</p>
                        <div className="flex flex-wrap gap-1">
                            {uniqueTags.slice(0, 3).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => handleTagSelect(t)}
                                    className="px-1 py-0.5 bg-gray-100 rounded text-xs hover:bg-gray-200 transition-colors"
                                    title={`Filter by ${t}`}
                                >
                                    {t.length > 12 ? `${t.slice(0, 12)}...` : t}
                                </button>
                            ))}
                            {uniqueTags.length > 3 && (
                                <span className="text-gray-400 text-xs">
                                    +{uniqueTags.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}