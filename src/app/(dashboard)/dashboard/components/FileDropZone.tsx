'use client';

import { useState, useRef } from 'react';

interface FileDropZoneProps {
    onFileUpload: (url: string) => void;
    label: string;
    acceptedTypes?: string;
}

export default function FileDropZone({
    onFileUpload,
    label,
    acceptedTypes = '*/*',
}: FileDropZoneProps) {
    const [uploading, setUploading] = useState(false);
    const [debugInfo, setDebugInfo] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        setUploading(true);
        setDebugInfo('Uploading...');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_UPLOAD_URL}`, {
                method: 'POST',
                body: formData,
            });

            const result = await res.json();
            if (res.ok && result.success && result.file?.url) {
                onFileUpload(result.file.url);
                setDebugInfo('✅ Upload successful');
            } else {
                throw new Error(result.message || 'Upload failed');
            }
        } catch (err) {
            setDebugInfo(`❌ ${err instanceof Error ? err.message : 'Upload error'}`);
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const onClick = () => inputRef.current?.click();

    return (
        <div
            className="w-full border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-[var(--color-primary)]"
            onClick={onClick}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
        >
            <input
                ref={inputRef}
                type="file"
                accept={acceptedTypes}
                onChange={handleChange}
                className="hidden"
            />
            <p className="text-sm text-gray-600">{label}</p>
            {uploading ? (
                <p className="text-xs text-[var(--color-text)] mt-1">Uploading...</p>
            ) : (
                <p className="text-xs text-[var(--color-text)] mt-1">Click or drop file here</p>
            )}
            {debugInfo && <p className="text-xs text-gray-500 mt-2">{debugInfo}</p>}
        </div>
    );
}
