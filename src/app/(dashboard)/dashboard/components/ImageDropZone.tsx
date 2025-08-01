'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';

type Props = {
    onImageUpload: (url: string) => void;
};

export default function ImageDropZone({ onImageUpload }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        if (data.url) {
            setPreview(data.url);
            onImageUpload(data.url);
        }
    };

    const handleFile = (file: File) => {
        if (file && file.type.startsWith("image/")) {
            uploadImage(file);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        handleFile(e.dataTransfer.files[0]);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            handleFile(e.target.files[0]);
        }
    };

    return (
        <div className='rounded-xl h-fit border-2 p-3 border-gray-300'>

            <div
                className="flex h-60 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-sky-400 transition relative bg-gray-50 overflow-hidden"
                onClick={() => inputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
            >
                <input
                    type="file"
                    accept="image/*"
                    hidden
                    ref={inputRef}
                    onChange={handleFileChange}
                />

                {preview ? (
                    <Image src={preview} alt="Preview" fill className="object-cover rounded-md" />
                ) : (
                    <>
                        <Image src="/dashboard/drop-image.png" alt="Drop Image Icon" width={40} height={40} className="absolute top-2/5 left-1/2 -translate-x-1/2 -translate-y-1/4" />
                        <p className="text-sm text-gray-500 z-10 mt-10">Click or Drop image</p>
                    </>
                )}
            </div>
        </div>

    );
}

