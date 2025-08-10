'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import Image from 'next/image';

type UploadResult = {
    success: boolean;
    file?: { url: string };
    message?: string;
};

interface FileDropZoneProps {
    onFileUpload: (url: string, meta?: { name: string; size: number; type: string }) => void;
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

    // ⬇️ Rename helper agar tidak tabrakan dengan state setter
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
                body: formData,
                signal: controller.signal,
            });

            let result: UploadResult | null = null;
            try {
                result = await res.json();
            } catch {
                // noop
            }

            if (!res.ok) {
                throw new Error(result?.message || `Upload failed with ${res.status}`);
            }

            if (!result?.success || !result.file?.url) {
                throw new Error(result?.message || 'Upload failed: bad response');
            }

            // Sukses
            const url = result.file.url;

            if (file.type.startsWith('image/')) {
                setPreviewUrl(url);
            }

            onFileUpload(url, { name: file.name, size: file.size, type: file.type });

            // Note SVG inline: sanitize di server kalau nanti di-inline ke DOM.
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Upload failed';
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
                            {/* <span className="font-medium">{fileName + "  "}</span> */}

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
