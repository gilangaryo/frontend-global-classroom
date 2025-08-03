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
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg p-4 md:p-6 max-w-2xl w-full relative shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
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

                <div className="h-[75vh] w-full">
                    <iframe
                        src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                        title={title || "PDF Preview"}
                        className="w-full h-full border-none pb-5"
                    />
                </div>

                {/* <div className="w-full flex justify-center mt-4 bg-primary hover:opacity-90 px-6 py-3 rounded-md"> */}
                <div className="w-full flex justify-center mt-4">
                    <a
                        href={pdfUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full  bg-primary hover:opacity-90 px-6 py-3 rounded-md text-white transition text-center font-semibold"
                    >
                        Download Preview
                    </a>
                </div>

                {/* </div> */}
            </div>
        </div>
    );
};

export default ModalPreviewPdf;
