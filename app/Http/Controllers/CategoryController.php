<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function getCategories()
    {
        $supplies = Category::leftJoin('category_description', 'category.category_id', '=', 'category_description.category_id')
            ->select('category.category_id')
            ->where('category_description.name', 'School Supplies')
            ->first();

        $categories = Category::leftJoin('category_description', 'category.category_id', '=', 'category_description.category_id')
            ->select('category.category_id as value', 'category_description.name as label')
            ->where('category.parent_id', $supplies['category_id'])
            ->get();

        return response()->json(compact('categories'));
    }
}
