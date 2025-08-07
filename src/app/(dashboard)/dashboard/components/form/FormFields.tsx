'use client';

import React from 'react';
import TiptapEditor from '../TiptapEditor';
import FileDropZone from '../FileDropZone';
import ImageDropZone from '../ImageDropZone';
import ButtonColorPicker from '../ButtonColorPicker';

/** -------------------------------------------------
 * InputField
 */
interface InputFieldProps {
    name: string;
    label: string;
    value: string | number;
    onChange: (value: string | number) => void;
    type?: 'text' | 'number' | 'email' | 'password';
    placeholder?: string;
    error?: string;
    required?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
    name,
    label,
    value,
    onChange,
    type = 'text',
    placeholder = '',
    error,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const val =
            type === 'number'
                ? raw === ''
                    ? ''
                    : Number(raw)
                : raw;
        onChange(val);
    };

    return (
        <div className="mb-6" data-field={name}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                className={`w-full rounded-md px-4 py-2.5 text-sm outline-none border focus:ring-1 ${error ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-sky-400'
                    }`}
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
    );
};

/** -------------------------------------------------
 * TextAreaField
 */
interface TextAreaFieldProps {
    name: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
    error?: string;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
    name,
    label,
    value,
    onChange,
    placeholder = '',
    rows = 4,
    error,
}) => (
    <div className="mb-6" data-field={name}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
            {label}
        </label>
        <textarea
            id={name}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            className={`w-full rounded-md px-4 py-2.5 text-sm outline-none border focus:ring-1 ${error ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-sky-400'
                }`}
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
);

/** -------------------------------------------------
 * RichTextField
 */
interface RichTextFieldProps {
    name: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
}

export const RichTextField: React.FC<RichTextFieldProps> = ({
    name,
    label,
    value,
    onChange,
    placeholder = '',
    error,
}) => (
    <div className="mb-6" data-field={name}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
            {label}
        </label>
        <TiptapEditor content={value} onChange={onChange} placeholder={placeholder} />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
);

/** -------------------------------------------------
 * FileField
 */
interface FileFieldProps {
    name: string;
    label: string;
    url: string;
    onUpload: (url: string) => void;
    acceptedTypes?: string;
    error?: string;
}

export const FileField: React.FC<FileFieldProps> = ({
    name,
    label,
    url,
    onUpload,
    acceptedTypes,
    error,
}) => (
    <div className="mb-6" data-field={name}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
            {label}
        </label>
        <FileDropZone
            label={label}
            onFileUpload={onUpload}
            acceptedTypes={acceptedTypes}
        />
        {url && <p className="text-xs text-gray-500 mt-2 break-all">URL: {url}</p>}
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
);

/** -------------------------------------------------
 * ImageField
 */
interface ImageFieldProps {
    name: string;
    label: string;
    url: string;
    onUpload: (url: string) => void;
    error?: string;
    recommendedSize?: string;
}

export const ImageField: React.FC<ImageFieldProps> = ({
    name,
    label,
    url,
    onUpload,
    error,
    // recommendedSize = '800×600px',
}) => (
    <div className="mb-6" data-field={name}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
            {label}
        </label>
        <ImageDropZone currentImageUrl={url} onImageUpload={onUpload} />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        {/* <p className="text-xs text-gray-500 mt-2">Recommended size: {recommendedSize}</p> */}
    </div>
);

/** -------------------------------------------------
 * ColorPickerField
 */
interface ColorPickerFieldProps {
    name: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

export const ColorPickerField: React.FC<ColorPickerFieldProps> = ({
    name,
    label,
    value,
    onChange,
    error,
}) => (
    <div className="mb-6 colorButton" data-field={name}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
            {label}
        </label>
        <ButtonColorPicker value={value} onChange={onChange} />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
);

/** -------------------------------------------------
 * PriceField
 */
interface PriceFieldProps {
    name: string;
    label: string;
    value: number;
    onChange: (value: number) => void;
    error?: string;
    min?: number;
    step?: number;
}

export const PriceField: React.FC<PriceFieldProps> = ({
    name,
    label,
    value,
    onChange,
    error,
    min = 0,
    step = 0.01,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const num = raw === '' ? 0 : parseFloat(raw);
        onChange(num);
    };

    return (
        <div className="mb-6" data-field={name}>
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={name}>
                {label}
            </label>
            <div
                className={`flex h-12 overflow-hidden rounded-lg border focus-within:ring-2 ${error ? 'border-red-500 ring-red-400' : 'border-gray-300 focus-within:ring-sky-400'
                    }`}
            >
                <div className="flex items-center justify-center border-2 border-sky-500 bg-sky-100 px-4 m-2 rounded-md">
                    <span className="text-sky-500 text-sm font-bold">$</span>
                </div>
                <input
                    id={name}
                    name={name}
                    type="number"
                    className="flex-1 px-4 py-2 text-sm placeholder:text-gray-500 outline-none border-none"
                    value={value === 0 ? '' : value}
                    onChange={handleChange}
                    min={min}
                    step={step}
                    placeholder="0.00"
                />
            </div>
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
    );
};
