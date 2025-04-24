// resources/js/store/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product, CartItem, CartState } from "@/types";

const initialState: CartState = {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItemToCart(state, action: PayloadAction<Product>) {
            const newItem = action.payload;
            const existingItem = state.items.find(
                (item) => item.id === newItem.id
            );

            if (!existingItem) {
                const cartItem: CartItem = {
                    ...newItem,
                    quantity: newItem.quantity,
                    totalPrice: newItem.price,
                };
                console.log("cartItem", cartItem);
                state.items.push(cartItem);
            } else {
                existingItem.quantity++;
                existingItem.totalPrice += newItem.price;
            }
            console.log("state.items", state.items);
            state.totalQuantity++;
        },
        removeItemFromCart(state, action: PayloadAction<number>) {
            const id = action.payload;
            const existingItem = state.items.find((item) => item.id === id);

            if (!existingItem) return;

            if (existingItem.quantity === 1) {
                state.items = state.items.filter((item) => item.id !== id);
            } else {
                existingItem.quantity--;
                existingItem.totalPrice -= existingItem.price;
            }

            state.totalQuantity--;
        },
        clearCart(state) {
            state.items = [];
            state.totalQuantity = 0;
            state.totalAmount = 0;
        },
    },
});

export const { addItemToCart, removeItemFromCart, clearCart } =
    cartSlice.actions;
export default cartSlice.reducer;
