"use client";
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

// Response type dari Cloudinary server kita
interface CloudinaryUploadResult {
    asset_id: string;
    public_id: string;
    version: number;
    version_id: string;
    signature: string;
    width: number | null;
    height: number | null;
    format: string;
    resource_type: string;
    created_at: string;
    bytes: number;
    type: string;
    url: string;
    secure_url: string;
    thumbnail_url?: string;
    original_filename: string;
    etag: string;
}

interface ImageDropZoneProps {
    onImageUpload: (url: string) => void;
    currentImageUrl?: string;
    maxSizeMB?: number;
    folder?: string;
}

export default function ImageDropZone({
    onImageUpload,
    currentImageUrl,
    maxSizeMB = 15,
    folder
}: ImageDropZoneProps) {
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [localPreview, setLocalPreview] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const abortRef = useRef<AbortController | null>(null);

    useEffect(() => {
        setImageError(false);
        setUploadError(null);
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
        // Reset errors
        setUploadError(null);
        setImageError(false);

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setUploadError('Please upload an image file');
            return;
        }

        // Validate file size
        const maxBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxBytes) {
            setUploadError(`File size should be less than ${maxSizeMB}MB`);
            return;
        }

        // Create local preview
        const reader = new FileReader();
        reader.onload = () => setLocalPreview(reader.result as string);
        reader.readAsDataURL(file);

        setUploading(true);

        try {
            // Abort previous upload
            abortRef.current?.abort();
            const controller = new AbortController();
            abortRef.current = controller;

            const formData = new FormData();
            formData.append('file', file);

            // Optional: add folder and public_id
            if (folder) {
                formData.append('folder', folder);
            }
            formData.append('public_id', `image_${Date.now()}`);

            const res = await fetch(`${process.env.NEXT_PUBLIC_UPLOAD_URL}`, {
                method: 'POST',
                body: formData,
                signal: controller.signal,
            });

            const contentType = res.headers.get('content-type');
            let result: CloudinaryUploadResult | { error: string } | null = null;

            if (contentType?.includes('application/json')) {
                try {
                    result = await res.json();
                } catch {
                    throw new Error('Failed to parse server response');
                }
            }

            if (!res.ok) {
                // Handle different error cases
                if (res.status === 400) {
                    const errorResult = result as { error?: string };
                    throw new Error(errorResult?.error || 'Bad request - check file type and size');
                } else if (res.status === 413) {
                    throw new Error(`File too large (max ${maxSizeMB}MB)`);
                } else if (res.status === 429) {
                    throw new Error('Too many uploads, please try again later');
                } else {
                    const errorResult = result as { error?: string };
                    throw new Error(errorResult?.error || `Upload failed with status ${res.status}`);
                }
            }

            // Validate response structure
            if (!result || typeof result !== 'object') {
                throw new Error('Invalid response from server');
            }

            // Check if it's an error response
            if ('error' in result) {
                throw new Error(result.error);
            }

            // Type guard to ensure it's a successful upload result
            const uploadResult = result as CloudinaryUploadResult;

            if (!uploadResult.secure_url) {
                throw new Error('Upload failed: no file URL returned');
            }

            // Success
            onImageUpload(uploadResult.secure_url);
            setLocalPreview(null); // Clear local preview since we have the server URL

        } catch (err: unknown) {
            console.error('Upload error:', err);

            // Don't show error if upload was cancelled
            if (err instanceof Error && err.name === 'AbortError') {
                return;
            }

            // Show error message
            let errorMessage = 'Upload failed';
            if (err instanceof Error) {
                errorMessage = err.message;
            }
            setUploadError(errorMessage);
            setLocalPreview(null);
        } finally {
            setUploading(false);
        }
    };

    const onButtonClick = () => {
        setUploadError(null);
        inputRef.current?.click();
    };

    const removeImage = (e: React.MouseEvent) => {
        e.stopPropagation();

        // Cancel ongoing upload if any
        if (uploading) {
            abortRef.current?.abort();
            setUploading(false);
        }

        setLocalPreview(null);
        setImageError(false);
        setUploadError(null);
        onImageUpload('');
    };

    const cancelUpload = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (uploading) {
            abortRef.current?.abort();
            setUploading(false);
            setLocalPreview(null);
            setUploadError('Upload cancelled');
        }
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
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleChange}
                />

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
                                {!uploading && (
                                    <>
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
                                    </>
                                )}
                                {uploading && (
                                    <button
                                        type="button"
                                        onClick={cancelUpload}
                                        className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors shadow-lg"
                                    >
                                        Cancel Upload
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 min-h-[200px] flex flex-col justify-center">
                        {uploading ? (
                            <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]" />
                                <p className="mt-2 text-sm text-[var(--color-text)]">Uploading to server...</p>
                                <button
                                    type="button"
                                    onClick={cancelUpload}
                                    className="mt-2 text-xs text-red-500 hover:text-red-700 underline"
                                >
                                    Cancel
                                </button>
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
                                    <p className="text-sm text-[var(--color-text)] mt-1">Image up to {maxSizeMB}MB</p>
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

            {/* Error Display */}
            {uploadError && (
                <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {uploadError}
                </div>
            )}
        </div>
    );
}