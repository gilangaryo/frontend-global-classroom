'use client';
import Image from "next/image";
import React from "react";

interface Props {
    open: boolean;
    onClose: () => void;
    imgUrl: string;
    onPreviewPdf: () => void;
}

export default function LessonPdfThumbnailModal({ open, onClose, imgUrl, onPreviewPdf }: Props) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 relative shadow-xl flex flex-col items-center">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-2xl font-bold bg-[#EFE9E9] rounded-full px-3 py-1 hover:bg-[#ded6d6]"
                >×</button>
                <Image
                    src={imgUrl}
                    alt="Lesson overview preview"
                    width={350}
                    height={420}
                    className="rounded-lg object-contain bg-[#EFE9E9] mx-6"
                />
                <button
                    className="mt-4 px-6 py-2 rounded-lg bg-primary text-white font-semibold"
                    onClick={onPreviewPdf}
                >Open Full PDF</button>
            </div>
        </div>
    );
}
