<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PreOrderItems extends Model
{
    protected $table = 'preorder_items';
    protected $primaryKey = 'preorder_item_id';
    public $timestamps = false;
    protected $fillable = [
        'preorder_id',
        'product_variant_id',
        'order_qty',
        'price',
        'uom',
    ];
}
