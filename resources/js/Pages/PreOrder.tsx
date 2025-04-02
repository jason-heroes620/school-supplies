import Products from "@/components/Products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formattedNumber } from "@/util/formatNumber";
import { useForm } from "@inertiajs/react";
import { Minus } from "lucide-react";
import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

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

type OrderForm = {
    schoolName: string;
    contactPerson: string;
    contactNo: string;
    email: string;
    orders: any[];
    orderTotal: number;
};

const PreOrder = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [emailError, setEmailError] = useState("");

    const { setData, data, post, processing } = useForm<OrderForm>({
        schoolName: "",
        contactPerson: "",
        contactNo: "",
        email: "",
        orders: orders,
        orderTotal: 0,
    });

    const handleAddProduct = (
        e: any,
        product: any,
        variant: any,
        orderQty: number
    ) => {
        e.preventDefault();

        const order = {
            productId: product.value,
            product: product.label,
            variantId: variant.variant_id,
            productVariantId: variant.product_variant_id,
            code: variant.code,
            variant: variant.variant,
            qty: orderQty,
            price: variant.price,
            uom: variant.uom,
        };
        var newOrder = [];
        const exist = orders.find(
            (o) => o.productVariantId === order.productVariantId
        );
        if (exist) {
            newOrder = orders.map((o) => {
                if (o.productVariantId === order.productVariantId) {
                    return {
                        ...o, // Copy existing properties
                        qty: o.qty + order.qty, // Update qty
                    };
                }
                return o; // Keep other items unchanged
            });
        } else {
            newOrder = [...orders, order];
        }

        setOrders(newOrder);
        const orderTotal = newOrder.reduce(
            (acc, order) => acc + order.qty * order.price,
            0
        );
        setData("orders", newOrder);
        setData("orderTotal", orderTotal);
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        post(route("order.create"), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(
                    "Thank you for pre-ordering. We will process it and inform you once it is ready for delivery.",
                    {
                        duration: 5000,
                    }
                );
                setOpenDialog(false);
                setTimeout(function () {
                    window.location.reload();
                }, 5000);
            },
            onError: () => {
                toast.error("Failed to submit order.");
                setOpenDialog(false);
            },
        });
    };

    return (
        <div className="mx-auto max-w-2xl">
            <Toaster />
            <div className="py-8">
                <div className="flex justify-center py-4">
                    <img
                        src="/img/heroes-logo.png"
                        alt=""
                        className="w-[160px]"
                    />
                </div>
                <div className="py-4">
                    <h1 className="text-2xl font-bold">
                        Only the Best: Handpicked School Supplies for You!
                    </h1>
                </div>
                <div>
                    <span>
                        <span>
                            Get the best for your classroom without
                            overspending! Our high-quality school supplies are
                            available for pre-order, so you can buy only what
                            you need—no bulk, no waste, just smart savings.
                            Let's make teaching easier and learning more fun
                            while keeping costs low together!
                        </span>
                    </span>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                onSubmitCapture={handleSubmit}
                className="flex flex-col gap-4"
            >
                <div className="flex flex-col py-4 gap-4">
                    <div>
                        <label htmlFor="">
                            Your School Name{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder=""
                            maxLength={150}
                            onChange={(e) =>
                                setData("schoolName", e.target.value)
                            }
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="">
                            What do your students call you when they need help?{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder=""
                            onChange={(e) =>
                                setData("contactPerson", e.target.value)
                            }
                            maxLength={100}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="">
                            If we need to send a "your supplies have arrived"
                            happy dance, what number do we text?{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder=""
                            type="tel"
                            maxLength={14}
                            onChange={(e) =>
                                setData("contactNo", e.target.value)
                            }
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="">
                            Your email address{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder=""
                            type="email"
                            maxLength={14}
                            onChange={(e) => {
                                if (
                                    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
                                        e.target.value
                                    )
                                ) {
                                    setData("email", e.target.value);
                                    setEmailError("");
                                } else {
                                    setEmailError("Invalid email address");
                                }
                            }}
                            required
                        />
                        {emailError && (
                            <span className="text-red-500 italic text-sm">
                                {emailError}
                            </span>
                        )}
                    </div>
                </div>
                <div>
                    <span className="text-red-500">* </span>
                    <span className="italic text-sm">
                        Fields marked with
                        <span className="text-red-500"> * </span> are required
                    </span>
                </div>
                <div>
                    <hr />
                </div>
                <div>
                    <label htmlFor="">Choose a product</label>
                    <Products
                        setData={setData}
                        data={data}
                        handleAddProduct={handleAddProduct}
                    />
                </div>
                <div className="py-2">
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
                                                    o.variantId !==
                                                    order.variantId
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
                </div>
                <div className="flex justify-end py-2">
                    {orders.length > 0 &&
                    data.schoolName !== "" &&
                    data.contactPerson !== "" &&
                    data.contactNo !== "" &&
                    data.email !== "" &&
                    emailError === "" ? (
                        <AlertDialog
                            open={openDialog}
                            onOpenChange={() => setOpenDialog(!openDialog)}
                        >
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" disabled={processing}>
                                    Submit Order
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle></AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Confirm to submit your order?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        type="submit"
                                        disabled={processing}
                                        onClick={handleSubmit}
                                    >
                                        Continue
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    ) : (
                        ""
                    )}
                </div>
            </form>
        </div>
    );
};

export default PreOrder;
