'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { addToCart } from '@/store/slices/cartSlice';
import { RootState } from '@/store';
import CartSuccessModal from './CartSuccessModal';

function isColorDark(hex: string): boolean {
    const cleanHex = hex.replace('#', '');

    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness < 128;
}

export default function AnimatedAddToCartButton({
    productId,
    productType,
    itemTitle,
    itemImg,
    itemDesc,
    itemPrice,
    size = 'base',
    buttonText,
    colorButton = '#363F36',
}: {
    productId: string;
    productType: 'COURSE' | 'UNIT' | 'SUBUNIT' | 'LESSON';
    itemTitle: string;
    itemImg: string;
    itemDesc: string;
    itemPrice: number;
    size?: 'base' | 'sm' | 'course';
    buttonText?: string;
    colorButton?: string
}) {
    const dispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const [isClient, setIsClient] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const inCart = isClient
        ? cartItems.some((item) => item.id === productId)
        : false;

    const handleAdd = () => {
        if (!inCart) {
            dispatch(
                addToCart({
                    id: productId,
                    productType,
                    title: itemTitle,
                    subtitle: itemDesc,
                    image: itemImg,
                    price: itemPrice,
                    quantity: 1,
                })
            );
            setModalOpen(true);
        }
    };

    const baseClass =
        'w-full rounded transition-colors font-semibold text-center h-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed py-3';
    const sizeClass = size === 'sm'
        ? 'text-sm px-4 py-3 max-w-[120px]'
        : size === 'course'
            ? 'text-sm px-8 py-4 mb-4'
            : 'text-sm px-4 py-2';

    const isDark = isColorDark(colorButton || '#363F36');
    const textColorClass = isDark ? 'text-white' : 'text-black';

    const stateClass = inCart
        ? `${textColorClass} cursor-not-allowed`
        : `${textColorClass} hover:opacity-90`;

    const colorStyle = colorButton ? { backgroundColor: colorButton } : {};


    return (
        <>
            <div className="relative w-full">
                <AnimatePresence mode="wait">
                    <motion.button
                        key={inCart ? 'incart' : 'buy'}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        onClick={handleAdd}
                        disabled={inCart}
                        style={colorStyle}
                        className={`${baseClass} ${sizeClass} ${stateClass}`}
                    >
                        {inCart ? '✓ In Cart' : `${buttonText || 'Buy Now'} $${itemPrice}`}
                    </motion.button>
                </AnimatePresence>
            </div>

            <CartSuccessModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={itemTitle}
                description={itemDesc}
                imageUrl={itemImg}
                price={itemPrice}
            />
        </>
    );
}
