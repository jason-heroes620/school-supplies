export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export interface Order {
    productId: string;
    product: string;
    variantId: string;
    productVariantId: string;
    code: string;
    variant: string;
    qty: number;
    price: number;
    uom: string;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export interface CartItem extends Product {
    quantity: number;
    totalPrice: number;
}

export interface CartState {
    items: CartItem[];
    totalQuantity: number;
    totalAmount: number;
}

export type CartItemType = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
};

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
};
