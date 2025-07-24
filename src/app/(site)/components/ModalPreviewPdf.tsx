// components/ModalPreviewPdf.tsx
'use client';
import React from "react";

interface ModalPreviewPdfProps {
    open: boolean;
    onClose: () => void;
    pdfUrl: string;
    title?: string;
}

const ModalPreviewPdf: React.FC<ModalPreviewPdfProps> = ({ open, onClose, pdfUrl, title }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg p-4 md:p-6 max-w-2xl w-full relative shadow-xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 px-3 py-1 bg-[#EFE9E9] text-[#363F36] rounded-full text-xl font-bold hover:bg-[#ded6d6] transition"
                    aria-label="Close"
                >
                    ×
                </button>
                {title && (
                    <div className="mb-3 font-bold text-lg text-primary text-center">{title}</div>
                )}
                <div className="h-[70vh] w-full">
                    <iframe
                        src={pdfUrl}
                        title={title || "PDF Preview"}
                        className="w-full h-full border-none"
                    />
                </div>
            </div>
        </div>
    );
};

export default ModalPreviewPdf;
