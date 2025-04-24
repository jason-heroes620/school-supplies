<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Products;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function preOrder()
    {
        return Inertia::render('PreOrder');
    }

    public function getProducts()
    {
        $supplies = Category::leftJoin('category_description', 'category.category_id', '=', 'category_description.category_id')
            ->select('category.category_id')
            ->where('category_description.name', 'School Supplies')
            ->first();
        $products = Products::select('product_id as value', 'product_name as label')
            ->where('category_id', $supplies['category_id'])
            ->where('product_status', 0)
            ->orderBy('sort_order', 'asc')
            ->get();


        return response()->json(compact('products'));
    }

    public function getProductVariants(Request $req)
    {
        $variant = Products::select('product_variant_id', 'variants.variant_id', 'variant', 'price', 'min_order', 'code', 'uom', 'product_image', 'available')
            ->leftJoin('product_variant', 'products.product_id', '=', 'product_variant.product_id')
            ->leftJoin('variants', 'product_variant.variant_id', '=', 'variants.variant_id')
            ->where('products.product_id', $req->id)
            ->orderBy('available', 'asc')
            ->orderBy('variant')
            ->get();
        $images = [];
        foreach ($variant as $v) {
            if ($this->getImage($v['product_image']))
                array_push($images, ['url' => config('app.url') . '/' . $this->getImage($v['product_image']), 'variant' => $v['variant'], 'available' => $v['available']]);
        }
        return response()->json(compact('variant', 'images'));
    }

    public function getImage($product)
    {
        if ($product) {
            $file_name = explode('/', $product);
            $image = "storage/productImage/" . $file_name[sizeof($file_name) - 1];
            return $image;
        }
        return;
    }

    public function index(Request $req)
    {
        $category = $req->category === 'supplies' ? 'School Supplies' : 'Food Supplies';
        $category_id = Category::leftJoin('category_description', 'category.category_id', '=', 'category_description.category_id')
            ->select('category.category_id')
            ->where('category_description.name', $category)
            ->first();

        $variants = Products::select('product_variant_id', 'variants.variant_id', 'variant', 'price', 'min_order', 'code', 'uom', 'product_image', 'available')
            ->leftJoin('product_variant', 'products.product_id', '=', 'product_variant.product_id')
            ->leftJoin('variants', 'product_variant.variant_id', '=', 'variants.variant_id')
            ->where('products.product_id', $req->id)
            ->orderBy('variant')
            ->get();
        // $images = [];
        // foreach ($variant as $v) {
        //     if ($this->getImage($v['product_image']))
        //         array_push($images, ['url' => $this->getImage($v['product_image']), 'variant' => $v['variant'], 'available' => $v['available']]);
        // }

        return Inertia::render('Products/' . ucfirst($req->category), compact('variants'));
    }
}
