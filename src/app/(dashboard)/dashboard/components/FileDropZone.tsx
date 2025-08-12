'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
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

// Extended metadata type
interface FileMetadata {
    name: string;
    size: number;
    type: string;
    public_id?: string;
    version?: number;
    format?: string;
    width?: number | null;
    height?: number | null;
    thumbnail_url?: string;
    asset_id?: string;
}

interface FileDropZoneProps {
    onFileUpload: (url: string, meta?: FileMetadata) => void;
    label: string;
    acceptedTypes?: string;
    maxSizeMB?: number;
    multiple?: boolean;
    value?: string | null;
    onError?: (message: string) => void;
    onUploadingChange?: (uploading: boolean) => void;
    helperText?: string;
    className?: string;
}

export default function FileDropZone({
    onFileUpload,
    label,
    acceptedTypes = 'image/svg+xml,image/png,image/jpeg,application/pdf,*/*',
    maxSizeMB = 10,
    multiple = false,
    value = null,
    onError,
    onUploadingChange,
    helperText,
    className = '',
}: FileDropZoneProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const abortRef = useRef<AbortController | null>(null);

    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(value ?? null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [fileType, setFileType] = useState<string | null>(null);
    const [fileSize, setFileSize] = useState<number | null>(null);

    const acceptList = useMemo(
        () => acceptedTypes.split(',').map((s) => s.trim()).filter(Boolean),
        [acceptedTypes]
    );

    const matchesAccept = useCallback(
        (file: File) => {
            if (acceptList.includes('*/*')) return true;
            // cocokkan exact mime, atau wildcard "image/*"
            return acceptList.some((pattern) => {
                if (pattern.endsWith('/*')) {
                    const base = pattern.slice(0, -2);
                    return file.type.startsWith(base + '/');
                }
                return file.type === pattern;
            });
        },
        [acceptList]
    );

    const setUploadingWithNotify = useCallback(
        (val: boolean) => {
            setUploading(val);
            onUploadingChange?.(val);
        },
        [onUploadingChange, setUploading]
    );

    const fail = useCallback(
        (message: string) => {
            setError(message);
            onError?.(message);
        },
        [onError]
    );

    const resetError = () => setError(null);

    const validateFile = (file: File) => {
        resetError();

        if (!matchesAccept(file)) {
            fail(`File type not allowed: ${file.type || 'unknown'}. Allowed: ${acceptedTypes}`);
            return false;
        }

        const maxBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxBytes) {
            fail(`File size too large (${(file.size / (1024 * 1024)).toFixed(2)} MB). Max ${maxSizeMB} MB.`);
            return false;
        }

        return true;
    };

    const startUpload = async (file: File) => {
        if (!validateFile(file)) return;

        setFileName(file.name);
        setFileType(file.type);
        setFileSize(file.size);

        const formData = new FormData();
        formData.append('file', file);

        // Tambahkan folder jika diperlukan
        // formData.append('folder', 'uploads');
        // formData.append('public_id', `file_${Date.now()}`);

        // Preview lokal: hanya untuk image/*
        if (file.type.startsWith('image/')) {
            const local = URL.createObjectURL(file);
            setPreviewUrl(local);
        } else {
            setPreviewUrl(null);
        }

        try {
            setUploadingWithNotify(true);
            abortRef.current?.abort();
            const controller = new AbortController();
            abortRef.current = controller;

            const res = await fetch(`${process.env.NEXT_PUBLIC_UPLOAD_URL}`, {
                method: 'POST',
                headers: {
                    'x-api-key': process.env.NEXT_PUBLIC_UPLOAD_KEY!,
                },
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
                // Handle different error cases with proper typing
                if (res.status === 400) {
                    const errorResult = result as { error?: string };
                    throw new Error(errorResult?.error || 'Bad request - check file type and size');
                } else if (res.status === 413) {
                    throw new Error('File too large (max 50MB)');
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

            // Success - cleanup local preview and use server URL
            if (file.type.startsWith('image/')) {
                // Cleanup local preview URL
                if (previewUrl && previewUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(previewUrl);
                }
                setPreviewUrl(uploadResult.secure_url);
            }

            // Create properly typed metadata object
            const metadata: FileMetadata = {
                name: file.name,
                size: file.size,
                type: file.type,
                public_id: uploadResult.public_id,
                version: uploadResult.version,
                format: uploadResult.format,
                width: uploadResult.width,
                height: uploadResult.height,
                thumbnail_url: uploadResult.thumbnail_url,
                asset_id: uploadResult.asset_id,
            };

            onFileUpload(uploadResult.secure_url, metadata);

        } catch (err) {
            // Cleanup local preview on error
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
            }

            if (err instanceof Error && err.name === 'AbortError') {
                return; // Upload was cancelled, don't show error
            }

            let msg = 'Upload failed';
            if (err instanceof Error) {
                msg = err.message;
            }

            console.error('Upload error:', err);
            fail(msg);
        } finally {
            setUploadingWithNotify(false);
        }
    };

    const handleFiles = async (list: FileList | null) => {
        if (!list?.length) return;
        resetError();

        if (multiple) {
            for (let i = 0; i < list.length; i++) {
                await startUpload(list[i]);
            }
        } else {
            await startUpload(list[0]);
        }
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        handleFiles(e.dataTransfer.files);
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(e.target.files);
        // reset agar bisa pilih file sama 2x
        e.currentTarget.value = '';
    };

    const onClick = () => inputRef.current?.click();

    const cancelUpload = () => {
        if (uploading) {
            abortRef.current?.abort();
            setUploadingWithNotify(false);
            // Cleanup preview if it's a blob URL
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
            }
            fail('Upload dibatalkan.');
        }
    };

    const humanSize = useMemo(() => {
        if (fileSize == null) return '';
        if (fileSize < 1024) return `${fileSize} B`;
        if (fileSize < 1024 * 1024) return `${(fileSize / 1024).toFixed(1)} KB`;
        return `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;
    }, [fileSize]);

    return (
        <div className={className}>
            <div
                role="button"
                tabIndex={0}
                aria-label={label}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
                className={[
                    'w-full rounded-lg border-2 border-dashed text-center cursor-pointer transition-colors',
                    'px-4 py-8 sm:py-12',
                    dragActive ? 'border-sky-500 bg-sky-50' : 'border-gray-300 hover:border-sky-400',
                    uploading ? 'opacity-80' : '',
                ].join(' ')}
                onClick={onClick}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={acceptedTypes}
                    onChange={onChange}
                    className="hidden"
                    multiple={multiple}
                />

                <div className="flex flex-col items-center gap-3">
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

                    <p className="text-sm text-gray-700 font-medium">{label}</p>
                    {helperText ? (
                        <p className="text-xs text-gray-500">{helperText}</p>
                    ) : (
                        <p className="text-xs text-gray-500">
                            <span className="font-mono">{acceptedTypes}</span> • Max {maxSizeMB}MB
                        </p>
                    )}

                    {uploading && (
                        <div className="mt-2 inline-flex items-center gap-2 rounded-md border border-gray-200 px-3 py-1.5 text-xs text-gray-600">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-gray-400" />
                            Mengupload...
                            <button
                                type="button"
                                className="ml-2 rounded px-2 py-0.5 text-[11px] border border-gray-300 hover:bg-gray-50"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    cancelUpload();
                                }}
                            >
                                Batalkan
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Info file & preview */}
            {(fileName || previewUrl || error) && (
                <div className="mt-3 space-y-2">
                    {fileName && (
                        <div className="text-sm text-gray-700">
                            <p>
                                {fileName + " "}
                                {humanSize ? <span className="text-green-600">
                                    • {humanSize + " "}
                                </span> : null}
                            </p>
                        </div>
                    )}

                    {previewUrl && (
                        <div className="overflow-hidden rounded-md border border-gray-200">
                            {fileType === 'application/pdf' ? (
                                <div className="flex flex-col items-center justify-center bg-gray-50 py-6">
                                    <Image
                                        src="/icons/pdf-icon.png"
                                        alt="PDF file"
                                        width={64}
                                        height={64}
                                    />
                                    <p className="mt-2 text-sm text-gray-600">{fileName}</p>
                                </div>
                            ) : (
                                <Image
                                    src={previewUrl}
                                    alt={fileName || 'preview'}
                                    width={400}
                                    height={300}
                                    className="object-contain bg-white"
                                    unoptimized
                                />
                            )}
                        </div>
                    )}

                    {error && (
                        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {error}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}