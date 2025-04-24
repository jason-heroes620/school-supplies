<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SchoolController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/Register');
    }

    public function register()
    {
        return redirect()->back()->with(['success' => '']);
    }
}
