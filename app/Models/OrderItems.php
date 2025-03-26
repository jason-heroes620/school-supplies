<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItems extends Model
{
    protected $table = 'order_items';
    protected $primaryKey = 'order_item_id';
    public $timestamps = false;
    protected $fillable = [
        'order_id',
        'product_variant_id',
        'order_qty',
        'price',
        'uom',
    ];
}
