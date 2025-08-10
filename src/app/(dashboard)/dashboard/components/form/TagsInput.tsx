'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface TagsInputProps {
    tags: string[];
    onTagsChange: (tags: string[]) => void;
    maxTags?: number;
    placeholder?: string;
    label?: string;
    fallbackSuggestedTags?: string[];
    disabled?: boolean;
    className?: string;
    renderMode?: 'inline' | 'dropdown';
    showInitialSuggestions?: boolean;
}

const TagsInput: React.FC<TagsInputProps> = ({
    tags,
    onTagsChange,
    maxTags = 10,
    placeholder = 'Type a tag and press Enter',
    label = 'Tags',
    fallbackSuggestedTags = [],
    disabled = false,
    className = '',
    renderMode = 'inline',
    showInitialSuggestions = true,
}) => {
    const [tagInput, setTagInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [allTags, setAllTags] = useState<string[]>([]);
    const boxRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const isMaxReached = tags.length >= maxTags;
    const selectedLower = useMemo(() => new Set(tags.map((t) => t.toLowerCase())), [tags]);
    const exists = useCallback((name: string) => selectedLower.has(name.trim().toLowerCase()), [selectedLower]);

    const addTag = (tag: string) => {
        const trimmed = tag.trim();
        if (!trimmed || exists(trimmed) || isMaxReached) return;
        onTagsChange([...tags, trimmed]);
        setTagInput('');
    };

    const removeTag = (tagToRemove: string) => {
        onTagsChange(tags.filter((t) => t.toLowerCase() !== tagToRemove.toLowerCase()));
    };

    const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!disabled) addTag(tagInput);
        } else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
        }
    };

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                const base = process.env.NEXT_PUBLIC_API_BASE_URL;
                const res = await fetch(`${base}/api/tags?take=200`);
                if (!res.ok) throw new Error(String(res.status));
                const json = await res.json();
                const items: Array<{ name?: string }> = Array.isArray(json?.data?.items) ? json.data.items : [];
                const names = items.map((it) => it?.name).filter(Boolean) as string[];
                if (!cancelled) {
                    setAllTags(names.length ? names : fallbackSuggestedTags);
                }
            } catch {
                if (!cancelled) setAllTags(fallbackSuggestedTags);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (renderMode !== 'dropdown') return;
        const handler = (e: MouseEvent) => {
            if (!boxRef.current) return;
            if (!boxRef.current.contains(e.target as Node)) {
                const q = tagInput.trim().toLowerCase();
                const base = allTags.filter((n) => !exists(n));
                const filtered = q ? base.filter((n) => n.toLowerCase().includes(q)) : base;
                if (filtered.length === 0) return;
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [renderMode, tagInput, allTags, exists]);

    const availableSuggested = useMemo(() => {
        const q = tagInput.trim().toLowerCase();
        const base = allTags.filter((n) => !exists(n));
        const filtered = q ? base.filter((n) => n.toLowerCase().includes(q)) : base;
        const list = showInitialSuggestions ? filtered : q ? filtered : [];
        return list.slice(0, 15);
    }, [allTags, tagInput, exists, showInitialSuggestions]);

    return (
        <div className={`space-y-2 ${className}`} ref={boxRef}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>

            <div
                className={`flex flex-wrap items-center gap-2 min-h-[40px] p-2 border rounded-md bg-gray-50 ${disabled || isMaxReached ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}`}
                onClick={() => inputRef.current?.focus()}
            >
                {tags.map((tag, i) => (
                    <span key={`${tag}-${i}`} className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-sky-700 bg-sky-100 rounded-full">
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            disabled={disabled}
                            className="ml-1 text-sky-500 hover:text-sky-700 hover:bg-sky-200 rounded-full w-4 h-4 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Remove tag"
                        >
                            ×
                        </button>
                    </span>
                ))}

                {!isMaxReached && !disabled && (
                    <input
                        ref={inputRef}
                        data-tags-input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder={placeholder}
                        className="flex-1 min-w-[100px] px-2 py-1 text-sm bg-transparent outline-none placeholder-gray-400"
                    />
                )}
            </div>

            {renderMode === 'inline' && (
                <div className="space-y-1">
                    <p className="text-xs text-gray-500">Suggested tags (click){loading ? ' – loading…' : ':'}</p>
                    <div className="flex flex-wrap gap-2">
                        {availableSuggested.length === 0 && !loading ? (
                            <span className="text-xs text-gray-400">No suggestions</span>
                        ) : (
                            availableSuggested.map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => addTag(s)}
                                    className="px-2 py-1 text-xs text-gray-600 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                                >
                                    + {s}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}

            {renderMode === 'dropdown' && availableSuggested.length > 0 && !disabled && (
                <div className="relative">
                    <div className="absolute left-0 right-0 z-20 mt-2 rounded-md border border-gray-200 bg-white shadow-sm max-h-56 overflow-auto">
                        {loading && <div className="px-3 py-2 text-sm text-gray-500">Loading…</div>}
                        {!loading &&
                            availableSuggested.map((s) => (
                                <button key={s} type="button" onClick={() => addTag(s)} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">
                                    {s}
                                </button>
                            ))}
                    </div>
                </div>
            )}

            <div className="text-xs text-gray-500">
                {tags.length}/{maxTags} tags
            </div>
        </div>
    );
};

export default TagsInput;
