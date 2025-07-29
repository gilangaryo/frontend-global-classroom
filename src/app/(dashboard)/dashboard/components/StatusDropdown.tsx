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
};

export default function StatusDropdown({ initialStatus = true, onStatusChange }: StatusDropdownProps) {
    // Convert boolean to StatusOption
    const getStatusOption = (isActive: boolean): StatusOption => {
        return isActive ? statusOptions[0] : statusOptions[1]; // Active or Inactive
    };

    const [selected, setSelected] = useState<StatusOption>(getStatusOption(initialStatus));
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Update selected when initialStatus changes
    useEffect(() => {
        setSelected(getStatusOption(initialStatus));
    }, [initialStatus]);

    const handleSelect = (option: StatusOption) => {
        setSelected(option);
        setIsOpen(false);

        // Call callback with boolean value
        if (onStatusChange) {
            onStatusChange(option.value === 'active');
        }
    };

    const handleToggle = () => {
        // Close other dropdowns by dispatching a custom event
        if (!isOpen) {
            window.dispatchEvent(new CustomEvent('closeAllDropdowns'));
        }
        setIsOpen(!isOpen);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleCloseAll = () => setIsOpen(false);

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Listen for close all event
        window.addEventListener('closeAllDropdowns', handleCloseAll);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('closeAllDropdowns', handleCloseAll);
        };
    }, [isOpen]);

    return (
        <div className="w-40" ref={dropdownRef}>
            <div className="relative">
                {/* Selected button */}
                <button
                    onClick={handleToggle}
                    className="relative w-full cursor-pointer rounded border border-gray-300 bg-white py-2 pl-3 pr-10 text-left text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

                {/* Options - appears below button naturally */}
                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-auto rounded border border-gray-300 bg-white py-1 text-sm shadow-lg z-50">
                        {statusOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleSelect(option)}
                                className="relative cursor-pointer select-none py-2 pl-3 pr-10 w-full text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                            >
                                <div className="flex items-center justify-between pr-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`h-2 w-2 rounded-full ${option.color}`} />
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