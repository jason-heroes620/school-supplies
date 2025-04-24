<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PreOrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SchoolController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/storage-link', function () {
    Artisan::call('storage:link');
    return "Storage Linke";
});

Route::get('/register', [SchoolController::class, 'create'])->name('school.create');
Route::post('/register', [SchoolController::class, 'register'])->name('school.register');

Route::get('/pre-order', [ProductController::class, 'preOrder'])->name('pre-order');
Route::post('/pre-order', [PreOrderController::class, 'create'])->name('preorder.create');

Route::get('/products', [ProductController::class, 'getProducts'])->name('products');
Route::get('/product_variants/{id}', [ProductController::class, 'getProductVariants'])->name('product-variants');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/products/{category}', [ProductController::class, 'index'])->name('products.category');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/cart', function () {
        return Inertia::render('Cart');
    })->name('cart');
});

require __DIR__ . '/auth.php';
