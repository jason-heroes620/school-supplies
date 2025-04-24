import { useCart } from "./cart/CartContext";
import { CartItemType } from "@/types";
import { Button } from "./ui/button";
import { format } from "path";
import { formattedNumber } from "@/util/formatNumber";

const Cart = () => {
    const { cart, removeFromCart, clearCart } = useCart();

    if (cart.length === 0) {
        return (
            <div className="p-4">
                <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
                <p>Your cart is empty</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">
                Your Cart ({cart.length} items)
            </h2>

            <div className="space-y-4 mb-6">
                {cart.map((item: CartItemType) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between border-b pb-4"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                                {/* <span className="text-gray-500">Image</span> */}
                                <img src={item.image} alt="" />
                            </div>
                            <div>
                                <h3 className="font-medium">{item.name}</h3>
                                <p className="text-gray-600">
                                    RM {item.price} × {item.quantity}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <p className="font-semibold">
                                {formattedNumber(item.price * item.quantity)}
                            </p>
                            <Button
                                variant={"outline"}
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500 hover:text-red-700 cursor-pointer"
                                aria-label="Remove item"
                            >
                                <span>X</span>
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-4">
                <div className="flex justify-end items-center mb-4 gap-4">
                    <h3 className="text-lg font-semibold">Total</h3>
                    <p className="text-lg font-semibold">
                        {formattedNumber(
                            cart.reduce(
                                (acc, item) => acc + item.price * item.quantity,
                                0
                            )
                        )}
                    </p>
                </div>
                <div className="py-2">
                    <span>* All orders are subject to delivery charges.</span>
                </div>
                <div className="flex gap-2 justify-between">
                    <Button onClick={clearCart} variant={"destructive"}>
                        <span className="font-bold">Clear Cart</span>
                    </Button>
                    {/* <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex-1">
                        Checkout
                    </button> */}
                    <Button variant={"primary"}>
                        <span className="font-bold">Create Order</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
