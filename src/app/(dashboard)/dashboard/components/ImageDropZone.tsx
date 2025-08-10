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
        if (file.size > 15 * 1024 * 1024) {
            alert('File size should be less than 15MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => setLocalPreview(reader.result as string);
        reader.readAsDataURL(file);

        setUploading(true);
        setImageError(false);

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
            } else {
                throw new Error(result.error || result.message || 'Upload failed');
            }
        } catch (err: unknown) {
            console.error('Upload error:', err);
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
        onImageUpload('');
    };

    const srcUrl = localPreview || currentImageUrl;

    return (
        <div className="w-full">
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
                            className="w-full h-full max-h-[240px] object-contain rounded-lg bg-white"
                            onError={() => {
                                setImageError(true);
                            }}
                            onLoad={() => {
                                setImageError(false);
                            }}
                        />
                        <div className="absolute inset-0 group-hover:bg-black/50 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
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
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />
                                <p className="mt-2 text-sm text-[var(--color-text)]">Uploading to server...</p>
                            </div>
                        ) : (
                            <>
                                <div className="relative mx-auto h-16 w-16">
                                    <Image
                                        src="/dashboard/upload-icon.png"
                                        alt="Upload to cloud"
                                        fill
                                        sizes="64px"
                                        className="object-contain"
                                        priority={false}
                                    />
                                </div>

                                <div>
                                    <p className="text-lg font-medium text-primary">Click or Drop image</p>
                                    <p className="text-sm text-[var(--color-text)] mt-1">Image up to 15MB</p>
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
