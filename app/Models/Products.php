<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Products extends Model
{
    use HasUuids;

    protected $table = 'products';
    protected $primaryKey = 'product_id';
}
