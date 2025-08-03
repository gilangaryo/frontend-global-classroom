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
        // Remove local preview if currentImageUrl changes (after upload)
        if (currentImageUrl) setLocalPreview(null);
    }, [currentImageUrl]);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('File size should be less than 5MB');
            return;
        }

        // Show local preview before uploading
        const reader = new FileReader();
        reader.onload = (e) => {
            setLocalPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        setUploading(true);
        setImageError(false);

        try {
            const formData = new FormData();
            formData.append('file', file);
            const token = localStorage.getItem("token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            let result;
            try {
                result = await response.json();
            } catch (e) {
                setImageError(true);
                alert("Upload failed. Invalid server response.");
                return;
            }

            if (response.ok && result.status === 'success') {
                console.log('Upload success, URL:', result.url);
                // Convert server URL to proxy URL for CORS bypass
                const proxyUrl = result.url.replace('http://192.168.56.1:4100/uploads', '/api/uploads');
                console.log('Proxy URL:', proxyUrl);
                setLocalPreview(null); // remove local preview, show server image
                onImageUpload(proxyUrl); // Use proxy URL instead
                console.log('Full result:', result);
            } else {
                alert(result.message || 'Upload failed. Please try again.');
                setImageError(true);
            }
        } catch (error) {
            alert('Upload failed. Please check your connection and try again.');
            setImageError(true);
        } finally {
            setUploading(false);
        }
    };

    const onButtonClick = () => inputRef.current?.click();

    const removeImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setImageError(false);
        setLocalPreview(null);
        onImageUpload('');
    };

    const handleImageError = () => {
        console.log('Image failed to load');
        setImageError(true);
    };

    // Show preview: either localPreview (before upload), or currentImageUrl (after upload)
    const previewUrl = localPreview || (currentImageUrl && !imageError ? currentImageUrl : null);

    console.log('Debug preview:', {
        localPreview,
        currentImageUrl,
        imageError,
        previewUrl
    });

    return (
        <div className="w-full">
            <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                    ${dragActive ? 'border-sky-400 bg-sky-50'
                        : previewUrl ? 'border-gray-300 bg-gray-50'
                            : 'border-gray-300 hover:border-gray-400'
                    } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={onButtonClick}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleChange}
                />

                {previewUrl ? (
                    <div className="relative group min-h-[200px] flex items-center justify-center">
                        {/* Coba gunakan img tag biasa dulu untuk testing */}
                        <Image
                            src={previewUrl}
                            alt="Uploaded preview"
                            width={400}
                            height={240}
                            className="w-full h-full max-h-[240px] object-contain rounded-lg bg-white"
                            onError={handleImageError}
                            onLoad={() => console.log('Image loaded successfully')}
                            unoptimized={true}
                        />
                        <div className="absolute inset-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); onButtonClick(); }}
                                    className="bg-white text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                                >
                                    Change
                                </button>
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
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
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
                                <p className="mt-2 text-sm text-gray-600">Uploading to server...</p>
                            </div>
                        ) : (
                            <>
                                <div className="mx-auto w-16 h-16 text-gray-400">
                                    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                                        <path d="M24 36V20M24 20l-6 6M24 20l6 6" stroke="#8E8E8E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M8 38a10 10 0 0 1 2-19.8A12 12 0 0 1 34.6 9.8 10 10 0 0 1 40 38H8Z" stroke="#bbb" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-lg font-medium text-[#363F36]">Click or Drop image</p>
                                    <p className="text-sm text-[#8E8E8E] mt-1">
                                        PNG, JPG, GIF up to 5MB
                                    </p>
                                    {imageError && (
                                        <p className="text-xs text-red-500 mt-2">
                                            Previous image failed to load. Please try uploading again.
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