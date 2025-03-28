import axios from "axios";
import { useEffect, useState } from "react";
import SelectInput from "./SelectInput";
import { Input } from "./ui/input";
import { formattedNumber } from "@/util/formatNumber";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export interface Variant {
    product_variant_id: string;
    variant: string;
    price: number;
    uom: string;
    min_order: number;
    code: string;
}

const Products = ({ setData, data, handleAddProduct }: any) => {
    const [products, setProducts] = useState([]);
    const [images, setImages] = useState([]);
    const [variants, setVariants] = useState<Variant[]>([]);
    const [orderQty, setOrderQty] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState<any>({});
    const [selectedImage, setSelectedImage] = useState("");

    const getProducts = () => {
        axios.get(route("products")).then((response) => {
            setProducts(response.data.products);
        });
    };

    const handleProductChange = (productId: string) => {
        axios.get(route("product-variants", productId)).then((response) => {
            setVariants(response.data.variant);
            setImages(response.data.images);
        });
    };

    const handleVariantChange = (e: any, variantId: string) => {
        e.preventDefault();
        const variant = variants.find(
            (v: Variant) => v.product_variant_id === variantId
        );
        setSelectedVariant(variant);
        if (variant) {
            setOrderQty(variant.min_order);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <div>
            <SelectInput
                options={products}
                selected={data.product}
                onChange={(e) => {
                    setData("product", e.target.value);
                    handleProductChange(e.target.value);
                }}
                required
            />
            <div>
                {images.length > 0 && (
                    <div className="flex flex-row gap-4 py-4 overflow-x-auto">
                        {images.map((image: any, index: number) => (
                            <Dialog key={index}>
                                <DialogTrigger>
                                    <div className=" border p-2 rounded-md">
                                        <img
                                            key={index}
                                            src={image.url}
                                            alt={image.name}
                                            className="min-w-20 h-20 cursor-pointer"
                                            onClick={() =>
                                                setSelectedImage(image.url)
                                            }
                                        />
                                        <span className="text-sm">
                                            {image.variant}
                                        </span>
                                    </div>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle></DialogTitle>
                                        <DialogDescription className="flex justify-center">
                                            <img src={selectedImage} alt="" />
                                        </DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        ))}
                    </div>
                )}
            </div>

            <div>
                {variants.length > 0 && (
                    <div className="py-2">
                        <span>Choose Variant: </span>
                        <div className="flex flex-row gap-4 py-4 overflow-x-auto">
                            {variants.map((variant: any) => (
                                <button
                                    key={variant.product_variant_id}
                                    onClick={(e) =>
                                        handleVariantChange(
                                            e,
                                            variant.product_variant_id
                                        )
                                    }
                                    className={`border border-gray-300 rounded-md px-4 py-2 ${
                                        selectedVariant.product_variant_id ===
                                        variant.product_variant_id
                                            ? "bg-orange-200 border-dashed border-orange-300"
                                            : ""
                                    }`}
                                >
                                    {variant.variant}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {selectedVariant.product_variant_id && (
                <div className="border border-gray-300 rounded-md py-4 px-6">
                    <div>
                        <span>Unit Price: </span>
                        <span className="italic">
                            {formattedNumber(selectedVariant.price)}
                        </span>
                    </div>

                    <div className="py-2">
                        <label htmlFor="">Order Qty</label>
                        <Input
                            type="number"
                            min={selectedVariant.min_order}
                            defaultValue={selectedVariant.min_order}
                            onChange={(e) => {
                                setOrderQty(parseInt(e.target.value));
                            }}
                        />
                    </div>
                    <div>
                        <span className="italic text-sm">
                            * This product has a minimum order of{" "}
                            {selectedVariant.min_order} {selectedVariant.uom}
                        </span>
                    </div>
                    <div className="flex justify-end py-2">
                        <span className="font-bold">
                            Total:{" "}
                            {formattedNumber(
                                orderQty *
                                    parseFloat(selectedVariant.price.toString())
                            )}
                        </span>
                    </div>
                    <div className="flex justify-end">
                        <Button
                            variant="default"
                            onClick={(e) => {
                                handleAddProduct(
                                    e,
                                    products.find(
                                        (p: any) => p.value === data.product
                                    ),
                                    selectedVariant,
                                    orderQty
                                );
                            }}
                        >
                            <Plus />
                            Add
                        </Button>
                    </div>
                </div>
            )}
            <div></div>
        </div>
    );
};

export default Products;
