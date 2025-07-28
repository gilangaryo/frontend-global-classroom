import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

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
    revalidationStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    revalidationError: string | null;
}

// --- LocalStorage Helpers ---
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

// --- Initial State ---
const initialState: CartState = {
    items: loadCartFromLocalStorage(),
    revalidationStatus: 'idle',
    revalidationError: null,
};

// --- Revalidation Thunk ---
export const revalidateCart = createAsyncThunk(
    'cart/revalidate',
    async (items: CartItem[], thunkAPI) => {
        if (items.length === 0) return [];

        const itemsToValidate = items.map(item => ({
            id: item.id,
            type: item.productType,
        }));

        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/validate/products`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: itemsToValidate }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return thunkAPI.rejectWithValue(errorData.message || 'Failed to revalidate cart from backend');
        }

        const jsonResponse = await response.json();
        if (!jsonResponse.data || !Array.isArray(jsonResponse.data)) {
            return thunkAPI.rejectWithValue('Invalid data structure from backend');
        }

        const updatedProducts: Omit<CartItem, 'quantity'>[] = jsonResponse.data;

        const validatedItems = items.map((oldItem) => {
            const updated = updatedProducts.find(p => p.id === oldItem.id);
            return {
                id: oldItem.id,
                productType: oldItem.productType,
                title: updated?.title || oldItem.title,
                subtitle: updated?.subtitle || oldItem.subtitle,
                image: updated?.image || oldItem.image,
                price: typeof updated?.price === 'string' ? parseFloat(updated.price) : oldItem.price,
                quantity: oldItem.quantity,
            };
        });

        return validatedItems;
    }
);

// --- Cart Slice ---
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action: PayloadAction<CartItem>) {
            const exists = state.items.find(item => item.id === action.payload.id);
            if (!exists) {
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
            state.revalidationStatus = 'idle';
            state.revalidationError = null;
            saveCartToLocalStorage([]);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(revalidateCart.pending, (state) => {
                state.revalidationStatus = 'loading';
                state.revalidationError = null;
            })
            .addCase(revalidateCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
                state.revalidationStatus = 'succeeded';
                state.items = action.payload;
                saveCartToLocalStorage(state.items);
            })
            .addCase(revalidateCart.rejected, (state, action) => {
                state.revalidationStatus = 'failed';
                state.revalidationError = action.payload as string;
            });
    },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
