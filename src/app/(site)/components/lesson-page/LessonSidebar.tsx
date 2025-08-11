'use client';
import { useMemo, useState, useEffect, useRef } from 'react';
import type { Unit } from './LessonList';

type Props = {
    initialUnits: Unit[];
    unit: string;
    setUnit: (v: string) => void;
    colorClass?: string;
    tag: string;
    setTag: (v: string) => void;
    allLessonTags?: Array<string | { name?: string | null } | null | undefined>;
    onTagSearch?: (searchTerm: string) => void;
};

/** Normalize mixed tags (string | {name} | null | undefined)[] -> string[] */
function normalizeTags(raw: Props['allLessonTags']): string[] {
    if (!Array.isArray(raw)) return [];
    const out: string[] = [];
    for (const t of raw) {
        if (typeof t === 'string') {
            const s = t.trim();
            if (s) out.push(s);
        } else if (t && typeof t === 'object' && 'name' in t) {
            const n = (t as { name?: string | null }).name;
            if (typeof n === 'string') {
                const s = n.trim();
                if (s) out.push(s);
            }
        }
    }
    // de-dup (case-insensitive)
    const seen = new Set<string>();
    const dedup: string[] = [];
    for (const s of out) {
        const key = s.toLowerCase();
        if (!seen.has(key)) {
            seen.add(key);
            dedup.push(s);
        }
    }
    // sort case-insensitive
    dedup.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    return dedup;
}

/** Normalize unit.tags (string[] | undefined)[][] -> string[] */
function normalizeUnitTags(units: Unit[]): string[] {
    const pooled: string[] = [];
    for (const u of units) {
        if (Array.isArray(u.tags)) {
            for (const t of u.tags) {
                if (typeof t === 'string') {
                    const s = t.trim();
                    if (s) pooled.push(s);
                }
            }
        }
    }
    // de-dup + sort
    const seen = new Set<string>();
    const out: string[] = [];
    for (const s of pooled) {
        const key = s.toLowerCase();
        if (!seen.has(key)) {
            seen.add(key);
            out.push(s);
        }
    }
    out.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    return out;
}

export default function LessonSidebar({
    initialUnits,
    unit,
    setUnit,
    colorClass = '#3E724A',
    tag,
    setTag,
    allLessonTags = [],
    onTagSearch,
}: Props) {
    const [tagSearchTerm, setTagSearchTerm] = useState('');
    const [showTagDropdown, setShowTagDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Safe, normalized, deduped tag list
    const uniqueTags = useMemo(() => {
        const unitTags = normalizeUnitTags(initialUnits);
        const lessonTags = normalizeTags(allLessonTags);
        // merge & dedupe again (case-insensitive)
        const seen = new Set<string>(lessonTags.map((t) => t.toLowerCase()));
        const merged = [...lessonTags];
        for (const t of unitTags) {
            const key = t.toLowerCase();
            if (!seen.has(key)) {
                seen.add(key);
                merged.push(t);
            }
        }
        // already sorted by each normalizer; ensure final sort
        merged.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
        return merged;
    }, [initialUnits, allLessonTags]);

    const filteredTags = useMemo(() => {
        if (!tagSearchTerm) return uniqueTags;
        const needle = tagSearchTerm.toLowerCase();
        return uniqueTags.filter((t) => t.toLowerCase().includes(needle));
    }, [uniqueTags, tagSearchTerm]);

    // keep input in sync when tag selected from outside
    useEffect(() => {
        if (tag && !tagSearchTerm) setTagSearchTerm(tag);
    }, [tag, tagSearchTerm]);

    // close dropdown when clicking outside
    useEffect(() => {
        const handlePointerDown = (ev: PointerEvent) => {
            if (!dropdownRef.current) return;
            if (!dropdownRef.current.contains(ev.target as Node)) {
                setShowTagDropdown(false);
            }
        };
        document.addEventListener('pointerdown', handlePointerDown);
        return () => document.removeEventListener('pointerdown', handlePointerDown);
    }, []);

    const handleTagSelect = (selectedTag: string) => {
        setTag(selectedTag);
        setTagSearchTerm(selectedTag);
        setShowTagDropdown(false);
        onTagSearch?.(selectedTag);
    };

    const handleTagSearchInput = (value: string) => {
        setTagSearchTerm(value);
        setShowTagDropdown(true);
        if (!value) {
            setTag('');
            onTagSearch?.('');
        }
    };

    const clearTagFilter = () => {
        setTag('');
        setTagSearchTerm('');
        setShowTagDropdown(false);
        onTagSearch?.('');
    };

    const filteredUnits = initialUnits;

    return (
        <aside className="space-y-8 md:col-span-2 pt-2 mr-30">
            <div className="mb-6">
                <h4 className="font-bold text-xs mb-3 tracking-widest text-green-active">ALL UNITS</h4>
                <ul>
                    {filteredUnits.length === 0 ? (
                        <li className="text-sm text-gray-500 italic">No units available</li>
                    ) : (
                        filteredUnits.map((u) => {
                            const isSelected = unit === u.id;
                            const style = {
                                color: isSelected ? colorClass : '#8E8E8E',
                                borderBottom: isSelected ? `3px solid ${colorClass}` : '3px solid transparent',
                            };
                            return (
                                <li key={u.id}>
                                    <button
                                        type="button"
                                        onClick={() => setUnit(isSelected ? '' : u.id)}
                                        className="block w-full text-left py-2 transition font-semibold hover:opacity-70 mb-4"
                                        style={style}
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
                                type="button"
                                onClick={clearTagFilter}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
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
                                            type="button"
                                            onClick={() => handleTagSelect('')}
                                            className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 border-b"
                                        >
                                            <span className="text-gray-500">All Tags ({uniqueTags.length})</span>
                                        </button>
                                        {filteredTags.map((t) => (
                                            <button
                                                type="button"
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
                                <span className="max-w-[120px] truncate" title={tag}>
                                    {tag}
                                </span>
                                <button
                                    type="button"
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
                                    type="button"
                                    key={t}
                                    onClick={() => handleTagSelect(t)}
                                    className="px-1 py-0.5 bg-gray-100 rounded text-xs hover:bg-gray-200 transition-colors"
                                    title={`Filter by ${t}`}
                                >
                                    {t.length > 12 ? `${t.slice(0, 12)}...` : t}
                                </button>
                            ))}
                            {uniqueTags.length > 3 && (
                                <span className="text-gray-400 text-xs">+{uniqueTags.length - 3} more</span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}
