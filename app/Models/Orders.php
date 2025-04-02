<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Orders extends Model
{
    protected $table = 'orders';
    protected $primaryKey = 'order_id';
    protected $fillable = [
        'order_id',
        'order_no',
        'school_name',
        'contact_person',
        'contact_no',
        'email',
        'order_total',
    ];
}
