<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class School extends Model
{
    use HasUuids;

    protected $connection = 'trips';
    protected $primaryKey = 'school_id';
    protected $table = 'school';
    protected $fillable = [
        'school_id',
        'school_name',
        'address_1',
        'address_2',
        'address_3',
        'postcode',
        'city',
        'state',
        'contact_person',
        'contact_no',
        'mobile_no',
        'email',
        'school_logo',
        'google_map_location',
        'user_id',
    ];
}
