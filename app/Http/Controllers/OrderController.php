<?php

namespace App\Http\Controllers;

use App\Models\OrderItems;
use App\Models\Orders;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Exceptions;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Uid\UuidV8;

class OrderController extends Controller
{
    public function create(Request $req)
    {
        try {
            $orderId = UuidV8::v4();
            $no = Orders::whereYear('created_at', date('Y'))->count() + 1;
            $orderNo = date("Y") . str_pad($no, 5, '0', STR_PAD_LEFT);

            Orders::create([
                'order_id' => $orderId,
                'order_no' => $orderNo,
                'school_name' => $req->input('schoolName'),
                'contact_person' => $req->input('contactPerson'),
                'contact_no' => $req->input('contactNo'),
                'order_total' => $req->input('orderTotal'),
            ]);

            foreach ($req->input('orders') as $o) {
                OrderItems::create([
                    'order_id' => $orderId,
                    'product_variant_id' => $o['productVariantId'],
                    'order_qty' => $o['qty'],
                    'price' => $o['price'],
                    'uom' => $o['uom'],
                ]);
            }

            return redirect()->back()->with(['message' => 'Order submitted successfully']);
        } catch (Exceptions $e) {
            Log::error('Error adding order: ' . $e);
            return redirect()->back()->with(['message' => 'Error adding order']);
        }
    }
}
