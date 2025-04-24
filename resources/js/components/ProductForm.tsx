import Products from "./Products";
import { useState } from "react";
import { Button } from "./ui/button";
import { Minus } from "lucide-react";
import { formattedNumber } from "@/util/formatNumber";
import { useForm } from "@inertiajs/react";
import { Product, Order } from "@/types";
import { useCart } from "@/components/cart/CartContext";
import { toast } from "sonner";

const ProductForm = ({ handleAddProduct }: any) => {
    const { addToCart } = useCart();

    const [orders, setOrders] = useState<Order[]>([]);
    const { setData, data, post, processing } = useForm<any>({
        orders: orders,
        orderTotal: 0,
    });

    const handleAddToCart = (product: any, variant: any, qty: number) => {
        const item: Product = {
            id: variant.product_variant_id,
            name: product.label + " (" + variant.variant + ")",
            price: variant.price,
            quantity: qty,
            image: variant.product_image,
        };
        addToCart(item);
        toast("Item added to your cart");
    };

    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-col ">
                <label htmlFor="">Choose a product</label>
                <Products
                    setData={setData}
                    data={data}
                    handleAddProduct={handleAddToCart}
                />
            </div>
            {/* <div className="py-2">
                <div className="grid grid-cols-8 gap-4 border py-2 px-1 bg-gray-200">
                    <div></div>
                    <div className="col-span-2">Product</div>
                    <div>Variant</div>
                    <div>Qty</div>
                    <div>Price</div>
                    <div>UOM</div>
                    <div className="flex justify-end">Total</div>
                </div>
                {orders.map((order: Order, index: number) => (
                    <div
                        key={index}
                        className="grid grid-cols-8 gap-4 border py-2 px-1 items-center"
                    >
                        <div>
                            <Button
                                size={"sm"}
                                variant={"destructive"}
                                className="cursor-pointer"
                                onClick={() => {
                                    setOrders(
                                        orders.filter(
                                            (o) =>
                                                o.variantId !== order.variantId
                                        )
                                    );
                                }}
                            >
                                <Minus />
                            </Button>
                        </div>
                        <div className="col-span-2">
                            <span className="text-sm">{order.product}</span>
                        </div>
                        <div>
                            <span className="text-sm">{order.variant}</span>
                        </div>
                        <div>{order.qty}</div>
                        <div>{order.price}</div>
                        <div>{order.uom}</div>
                        <div className="flex justify-end">
                            <span>
                                {formattedNumber(order.qty * order.price)}
                            </span>
                        </div>
                    </div>
                ))}
                {orders.length > 0 && (
                    <div className="grid grid-cols-8 py-2">
                        <div className="col-span-7 flex justify-end">
                            <span className="font-bold">Total Amount:</span>
                        </div>
                        <div className="flex justify-end">
                            <span className="font-bold">
                                {formattedNumber(
                                    orders.reduce(
                                        (acc, order) =>
                                            acc + order.qty * order.price,
                                        0
                                    )
                                )}
                            </span>
                        </div>
                        <div className="col-span-8">
                            <div className="flex justify-end">
                                <span className="text-red-500">*</span>
                                <span className="italic text-sm">
                                    (Delivery charges not included)
                                </span>
                            </div>
                        </div>
                    </div>
                )}
                {orders.length === 0 && (
                    <div className="py-2">
                        <span>No orders added yet.</span>
                    </div>
                )}
            </div> */}
        </div>
    );
};

export default ProductForm;
