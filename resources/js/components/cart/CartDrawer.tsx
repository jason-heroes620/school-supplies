import { useCart } from "./CartContext";

export default function CartDrawer() {
    const { cart, removeFromCart, clearCart } = useCart();

    return (
        <div className="fixed right-0 top-0 w-96 h-full bg-white shadow-lg p-4">
            <h2 className="text-xl font-bold mb-4">Your Cart</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    {cart.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between mb-2"
                        >
                            <span>
                                {item.name} (x{item.quantity})
                            </span>
                            <button onClick={() => removeFromCart(item.id)}>
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={clearCart}
                        className="mt-4 bg-red-500 text-white p-2 rounded"
                    >
                        Clear Cart
                    </button>
                </>
            )}
        </div>
    );
}
