<?php

use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/pre-order', [ProductController::class, 'preOrder'])->name('pre-order');

Route::get('/products', [ProductController::class, 'getProducts'])->name('products');
Route::get('/product_variants/{id}', [ProductController::class, 'getProductVariants'])->name('product-variants');

Route::post('/order', [OrderController::class, 'create'])->name('order.create');
