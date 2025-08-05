"use client";
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface ImageDropZoneProps {
    onImageUpload: (url: string) => void;
    currentImageUrl?: string;
}

export default function ImageDropZone({ onImageUpload, currentImageUrl }: ImageDropZoneProps) {
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [localPreview, setLocalPreview] = useState<string | null>(null);
    const [debugInfo, setDebugInfo] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setImageError(false);
        if (currentImageUrl) setLocalPreview(null);
    }, [currentImageUrl]);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        else setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files?.[0]) handleFile(e.target.files[0]);
    };

    const handleFile = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }
        if (file.size > 50 * 1024 * 1024) {
            alert('File size should be less than 50MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => setLocalPreview(reader.result as string);
        reader.readAsDataURL(file);

        setUploading(true);
        setImageError(false);
        setDebugInfo('Uploading to server...');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch(`${process.env.NEXT_PUBLIC_UPLOAD_URL}`, {
                method: 'POST',
                body: formData,
            });

            const result = await res.json();

            if (res.ok && result.success && result.file?.url) {
                onImageUpload(result.file.url);
                setLocalPreview(null);
                setDebugInfo(`✅ Upload successful: ${result.file.filename}`);
            } else {
                throw new Error(result.error || result.message || 'Upload failed');
            }
        } catch (err: unknown) {
            console.error('Upload error:', err);
            const message = err instanceof Error ? err.message : String(err);
            setDebugInfo(`❌ Upload failed: ${message}`);
            setLocalPreview(null);
        } finally {
            setUploading(false);
        }
    };

    const onButtonClick = () => inputRef.current?.click();
    const removeImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLocalPreview(null);
        setImageError(false);
        setDebugInfo('Image removed');
        onImageUpload('');
    };

    const srcUrl = localPreview || currentImageUrl;

    return (
        <div className="w-full">
            {debugInfo && (
                <div className="mb-2 p-2 bg-[var(--color-alt2)] rounded text-xs text-[var(--color-text)] font-mono">
                    Debug: {debugInfo}
                </div>
            )}
            <div
                className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragActive ? 'border-[var(--color-primary)] bg-[var(--color-alt2)]' : ''}
          ${srcUrl ? 'border-[var(--color-secondary)] bg-[var(--color-alt2)]' : 'hover:border-[var(--color-secondary)]'}
          ${uploading ? 'pointer-events-none opacity-50' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={onButtonClick}
            >
                <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />

                {srcUrl ? (
                    <div className="relative group min-h-[200px] flex items-center justify-center">
                        <Image
                            src={srcUrl}
                            alt="Uploaded preview"
                            width={400}
                            height={240}
                            unoptimized
                            className="w-full h-full max-h-[240px] object-contain rounded-lg bg-[var(--color-white)]"
                            onError={() => {
                                setImageError(true);
                                setDebugInfo(`❌ Load failed`);
                            }}
                            onLoad={() => {
                                setImageError(false);
                                setDebugInfo(`✅ Image loaded successfully`);
                            }}
                        />
                        <div className="absolute inset-0 group-hover:bg-black group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onButtonClick();
                                    }}
                                    className="bg-white text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors shadow-lg"
                                >
                                    Change
                                </button>
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors shadow-lg"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 min-h-[200px] flex flex-col justify-center">
                        {uploading ? (
                            <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
                                <p className="mt-2 text-sm text-[var(--color-text)]">Uploading to server...</p>
                            </div>
                        ) : (
                            <>
                                <div className="mx-auto w-16 h-16 text-[var(--color-tertiary)]">
                                    <svg
                                        className="w-full h-full"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 48 48"
                                    >
                                        <path d="M24 36V20M24 20l-6 6M24 20l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M8 38a10 10 0 0 1 2-19.8A12 12 0 0 1 34.6 9.8 10 10 0 0 1 40 38H8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-lg font-medium text-[var(--color-primary)]">Click or Drop image</p>
                                    <p className="text-sm text-[var(--color-text)] mt-1">PNG, JPG, GIF up to 50MB</p>
                                    {imageError && (
                                        <p className="text-xs text-red-500 mt-2">
                                            Previous image failed to load. Please try again.
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
