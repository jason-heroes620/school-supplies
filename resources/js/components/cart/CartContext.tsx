import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItemType } from "@/types";

type CartContextType = {
    cart: CartItemType[];
    addToCart: (item: CartItemType) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [cart, setCart] = useState<CartItemType[]>(() => {
        const storedCart = localStorage.getItem("cart");
        return storedCart ? JSON.parse(storedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item: CartItemType) => {
        const existing = cart.find((cartItem) => cartItem.id === item.id);
        if (existing) {
            setCart(
                cart.map((cartItem) =>
                    cartItem.id === item.id
                        ? {
                              ...cartItem,
                              quantity: cartItem.quantity + item.quantity,
                          }
                        : cartItem
                )
            );
        } else {
            setCart([...cart, item]);
        }
    };

    const removeFromCart = (id: number) => {
        setCart(cart.filter((item) => item.id !== id));
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider
            value={{ cart, addToCart, removeFromCart, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
};
