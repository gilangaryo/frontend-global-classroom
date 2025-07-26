'use client'

import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
    open: boolean
    onClose: () => void
    title: string
    description: string
    imageUrl: string
    price: number | string
}

export default function CartSuccessModal({
    open,
    onClose,
    title,
    description,
    imageUrl,
    price,
}: Props) {
    if (typeof document === 'undefined') {
        return null
    }

    return createPortal(
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                    >
                        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
                            <div className="flex items-center mb-4">
                                <svg
                                    className="h-6 w-6 text-green-600 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Successfully Added to Cart
                                </h3>
                            </div>
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="relative w-20 h-20 flex-shrink-0">
                                    <Image
                                        src={imageUrl}
                                        alt={title}
                                        fill
                                        className="object-cover rounded"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">{title}</p>
                                    <p className="text-sm text-gray-500">{description}</p>
                                </div>
                                <div className="font-semibold text-gray-800 text-lg">
                                    ${price}
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={onClose}
                                    className="text-primary font-medium hover:underline"
                                >
                                    Continue Shopping →
                                </button>
                                <Link
                                    href="/cart"
                                    className="px-4 py-2 bg-primary text-white rounded-lg font-medium"
                                >
                                    View Cart & Checkout
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    )
}
