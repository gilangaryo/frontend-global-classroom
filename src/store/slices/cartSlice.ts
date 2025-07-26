import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ProductType = 'COURSE' | 'UNIT' | 'SUBUNIT' | 'LESSON';

export interface CartItem {
    id: string;
    productType: ProductType;
    title: string;
    subtitle?: string;
    image: string;
    price: number;
    quantity: number;
}

interface CartState {
    items: CartItem[];
}

const loadCartFromLocalStorage = (): CartItem[] => {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem('cart');
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

const saveCartToLocalStorage = (items: CartItem[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(items));
    }
};

const initialState: CartState = {
    items: loadCartFromLocalStorage(),
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action: PayloadAction<CartItem>) {
            const existing = state.items.find(item => item.id === action.payload.id);
            if (!existing) {
                state.items.push(action.payload);
                saveCartToLocalStorage(state.items);
            }
        },
        removeFromCart(state, action: PayloadAction<string>) {
            state.items = state.items.filter(item => item.id !== action.payload);
            saveCartToLocalStorage(state.items);
        },
        clearCart(state) {
            state.items = [];
            saveCartToLocalStorage([]);
        },
    },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
