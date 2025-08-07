'use client';

import React, { useState } from 'react';

interface TagsInputProps {
    tags: string[];
    onTagsChange: (tags: string[]) => void;
    maxTags?: number;
    placeholder?: string;
    label?: string;
    suggestedTags?: string[];
    disabled?: boolean;
    className?: string;
}

const TagsInput: React.FC<TagsInputProps> = ({
    tags,
    onTagsChange,
    maxTags = 10,
    placeholder = 'Type a tag and press Enter',
    label = 'Tags',
    suggestedTags = [],
    disabled = false,
    className = '',
}) => {
    const [tagInput, setTagInput] = useState('');

    const addTag = (tag: string) => {
        const trimmed = tag.trim();
        if (
            trimmed &&
            !tags.includes(trimmed) &&
            tags.length < maxTags
        ) {
            onTagsChange([...tags, trimmed]);
        }
        setTagInput('');
    };

    const removeTag = (tagToRemove: string) => {
        onTagsChange(tags.filter(t => t !== tagToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag(tagInput);
        } else if (
            e.key === 'Backspace' &&
            tagInput === '' &&
            tags.length > 0
        ) {
            removeTag(tags[tags.length - 1]);
        }
    };

    const isMaxReached = tags.length >= maxTags;
    const availableSuggested = suggestedTags.filter(t => !tags.includes(t));

    return (
        <div className={`space-y-2 ${className}`}>
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>

            <div
                className={`
          flex flex-wrap items-center gap-2 min-h-[40px] p-2
          border rounded-md bg-gray-50
          ${disabled || isMaxReached ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}
        `}
                onClick={() => {
                    const inp = document.querySelector<HTMLInputElement>('[data-tags-input]');
                    inp?.focus();
                }}
            >
                {tags.map((tag, i) => (
                    <span
                        key={i}
                        className="
              inline-flex items-center gap-1 px-3 py-1 text-xs font-medium
              text-sky-700 bg-sky-100 rounded-full
            "
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            disabled={disabled}
                            className="
                ml-1 text-sky-500 hover:text-sky-700 hover:bg-sky-200
                rounded-full w-4 h-4 flex items-center justify-center
                transition-colors disabled:opacity-50 disabled:cursor-not-allowed
              "
                            title="Remove tag"
                        >
                            ×
                        </button>
                    </span>
                ))}

                {!isMaxReached && !disabled && (
                    <input
                        data-tags-input
                        type="text"
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="
              flex-1 min-w-[100px] px-2 py-1 text-sm
              bg-transparent outline-none
              placeholder-gray-400
            "
                    />
                )}
            </div>

            {/* suggested */}
            {availableSuggested.length > 0 && !isMaxReached && !disabled && (
                <div className="space-y-1">
                    <p className="text-xs text-gray-500">Suggested tags (click):</p>
                    <div className="flex flex-wrap gap-2">
                        {availableSuggested.slice(0, 15).map(tag => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => addTag(tag)}
                                className="
                  px-2 py-1 text-xs text-gray-600 bg-gray-200 rounded
                  hover:bg-gray-300 transition-colors
                "
                            >
                                + {tag}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* counter */}
            <div className="text-xs text-gray-500">
                {tags.length}/{maxTags} tags
            </div>
        </div>
    );
};

export default TagsInput;
