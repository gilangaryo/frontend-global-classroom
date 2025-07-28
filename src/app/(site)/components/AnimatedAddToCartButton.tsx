'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { addToCart } from '@/store/slices/cartSlice';
import { RootState } from '@/store';
import CartSuccessModal from './CartSuccessModal';

export default function AnimatedAddToCartButton({
    productId,
    productType,
    itemTitle,
    itemImg,
    itemDesc,
    itemPrice,
    size = 'base',
}: {
    productId: string;
    productType: 'COURSE' | 'UNIT' | 'SUBUNIT' | 'LESSON';
    itemTitle: string;
    itemImg: string;
    itemDesc: string;
    itemPrice: number;
    size?: 'base' | 'sm';
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
        'w-full rounded transition-colors font-semibold text-center';
    const sizeClass = size === 'sm'
        ? 'text-sm px-3 py-3 max-w-[120px]'
        : 'text-sm px-4 py-2';
    const stateClass = inCart
        ? 'bg-primary text-white cursor-not-allowed'
        : 'bg-primary text-white hover:bg-primary/90';

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
                        className={`${baseClass} ${sizeClass} ${stateClass}`}
                    >
                        {inCart ? '✓ In Cart' : `Buy Now $${itemPrice}`}
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
