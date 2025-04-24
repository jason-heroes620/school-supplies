<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PreOrders extends Model
{
    protected $table = 'preorders';
    protected $primaryKey = 'order_id';
    protected $fillable = [
        'preorder_id',
        'preorder_no',
        'school_name',
        'contact_person',
        'contact_no',
        'email',
        'order_total',
    ];
}
