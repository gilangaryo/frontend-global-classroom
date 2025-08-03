import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

type StatusOption = {
    label: string;
    value: string;
    color: string;
};

const statusOptions: StatusOption[] = [
    { label: 'Active', value: 'active', color: 'bg-green-500' },
    { label: 'Inactive', value: 'inactive', color: 'bg-red-500' },
];

type StatusDropdownProps = {
    initialStatus?: boolean;
    onStatusChange?: (isActive: boolean) => void;
    compact?: boolean;
};

export default function StatusDropdown({ initialStatus = true, onStatusChange, compact = false }: StatusDropdownProps) {
    const getStatusOption = (isActive: boolean): StatusOption => {
        return isActive ? statusOptions[0] : statusOptions[1];
    };

    const [selected, setSelected] = useState<StatusOption>(getStatusOption(initialStatus));
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSelected(getStatusOption(initialStatus));
    }, [initialStatus]);

    const handleSelect = (option: StatusOption) => {
        setSelected(option);
        setIsOpen(false);

        if (onStatusChange) {
            onStatusChange(option.value === 'active');
        }
    };

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isOpen) {
            window.dispatchEvent(new CustomEvent('closeAllDropdowns', {
                detail: { sourceElement: dropdownRef.current }
            }));

            if (dropdownRef.current) {
                const rect = dropdownRef.current.getBoundingClientRect();
                const spaceBelow = window.innerHeight - rect.bottom;
                const spaceAbove = rect.top;

                setDropdownPosition(spaceBelow < 80 && spaceAbove > spaceBelow ? 'top' : 'bottom');
            }
        }
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleCloseAll = (event: CustomEvent) => {
            // Don't close if the event came from this dropdown
            const sourceElement = event.detail?.sourceElement;
            if (sourceElement === dropdownRef.current) {
                return;
            }
            setIsOpen(false);
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Listen for close all event
        window.addEventListener('closeAllDropdowns', handleCloseAll as EventListener);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('closeAllDropdowns', handleCloseAll as EventListener);
        };
    }, [isOpen]);

    // Handle keyboard events
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle(e as unknown as React.MouseEvent);
        }
    };

    if (compact) {
        return (
            <div className="w-28 relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={handleToggle}
                    onKeyDown={handleKeyDown}
                    className="relative w-full cursor-pointer rounded border border-gray-300 bg-white py-1.5 pl-2 pr-7 text-left text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                >
                    <span className="flex items-center gap-1.5">
                        <span className={`h-1.5 w-1.5 rounded-full ${selected.color}`} />
                        <span className="truncate">{selected.label}</span>
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-1 flex items-center">
                        <ChevronDown
                            className={`h-3 w-3 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        />
                    </span>
                </button>

                {isOpen && (
                    <div
                        className={`absolute left-0 right-0 max-h-40 overflow-visible rounded border border-gray-300 bg-white py-1 text-xs shadow-lg z-50 ${dropdownPosition === 'top'
                            ? 'bottom-full mb-1'
                            : 'top-full mt-1'
                            }`}
                        role="listbox"
                    >
                        {statusOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleSelect(option);
                                }}
                                className="relative cursor-pointer select-none py-1.5 pl-2 pr-7 w-full text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                role="option"
                                aria-selected={selected.value === option.value}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <span className={`h-1.5 w-1.5 rounded-full ${option.color}`} />
                                        <span>{option.label}</span>
                                    </div>

                                    {selected.value === option.value && (
                                        <Check className="h-3 w-3 text-green-600" />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Original full-size mode
    return (
        <div className="w-40" ref={dropdownRef}>
            <div className="relative">
                {/* Selected button */}
                <button
                    type="button"
                    onClick={handleToggle}
                    onKeyDown={handleKeyDown}
                    className="relative w-full cursor-pointer rounded border border-gray-300 bg-white py-2 pl-3 pr-10 text-left text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                >
                    <span className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${selected.color}`} />
                        {selected.label}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                        <ChevronDown
                            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        />
                    </span>
                </button>

                {isOpen && (
                    <div
                        className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-auto rounded border border-gray-300 bg-white py-1 text-sm shadow-lg z-50"
                        role="listbox"
                    >
                        {statusOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleSelect(option);
                                }}
                                className="relative cursor-pointer select-none py-2 pl-3 pr-10 w-full text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                role="option"
                                aria-selected={selected.value === option.value}
                            >
                                <div className="flex items-center justify-between pr-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`h-4 w-2 rounded-full ${option.color}`} />
                                        <span>{option.label}</span>
                                    </div>

                                    {selected.value === option.value && (
                                        <Check className="h-4 w-4 text-green-600" />
                                    )}
                                </div>
                            </button>
                        ))}

                    </div>
                )}
            </div>
        </div>
    );
}