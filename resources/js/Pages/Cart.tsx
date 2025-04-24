// resources/js/Pages/Cart.tsx
import Cart from "@/components/Cart";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function CartPage() {
    return (
        <AuthenticatedLayout>
            <div className="container mx-auto py-8">
                <Cart />
            </div>
        </AuthenticatedLayout>
    );
}
