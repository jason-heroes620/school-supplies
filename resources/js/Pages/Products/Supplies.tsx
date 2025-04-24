import ProductForm from "@/components/ProductForm";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const Supplies = ({ variants }: any) => {
    console.log("variants => ", variants);
    const handleAddProduct = (variant: any) => {};

    return (
        <div>
            <AuthenticatedLayout>
                <div className="px-4 py-4 md:px-10 lg:px-20 xl:px-32">
                    <div className="py-4 ">
                        <span className="text-lg font-bold">
                            School Supplies
                        </span>
                    </div>
                    <div className="flex w-full">
                        <ProductForm handleAddProduct={handleAddProduct} />
                    </div>
                </div>
            </AuthenticatedLayout>
        </div>
    );
};

export default Supplies;
