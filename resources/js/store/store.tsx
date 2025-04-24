// resources/js/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import { CartState } from "@/types";

export interface RootState {
    cart: CartState;
}

export const store = configureStore({
    reducer: {
        cart: cartReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
