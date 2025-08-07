'use client';
interface ButtonColorPickerProps {
    value: string;
    onChange: (color: string) => void;
}

function isColorDark(hex: string): boolean {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
}

export default function ButtonColorPicker({ value = '#4ade80', onChange }: ButtonColorPickerProps) {
    return (
        <div className="space-y-4">
            {/* Color Picker + Label */}
            <div>
                <label className="flex items-center gap-4 border border-gray-300 rounded-lg px-4 py-2 h-12 cursor-pointer hover:bg-gray-50 focus-within:ring-1 focus-within:ring-sky-400">
                    <input
                        type="color"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="rounded-full w-6 h-6"
                    />
                    <span className="text-sm text-gray-600 whitespace-nowrap">
                        Change Color for button
                    </span>
                </label>
            </div>

            {/* Live Preview */}
            <div>
                <label className="block text-sm text-gray-600 mb-2">Live Button Preview:</label>
                <button
                    type="button"
                    className={`px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity ${isColorDark(value) ? 'text-white' : 'text-black'
                        }`}
                    style={{ backgroundColor: value }}
                >
                    Buy Now
                </button>
            </div>
        </div>
    );
}
