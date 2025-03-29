<?php

namespace App\Http\Controllers;

use App\Models\OrderItems;
use App\Models\Orders;
use DateTime;
use DateTimeZone;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Exceptions;
use Illuminate\Support\Facades\Log;
use PHPUnit\Event\Code\Throwable;
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
            $this->handleMondayMutation($orderId);
            return redirect()->back()->with(['message' => 'Order submitted successfully']);
        } catch (Exceptions $e) {
            Log::error('Error adding order: ' . $e);
            return redirect()->back()->with(['message' => 'Error adding order']);
        }
    }

    private function handleMondayMutation($orderId)
    {
        // Handle Monday mutation

        $boardId = "8783191143";

        $items = Orders::where('orders.order_id', $orderId)
            ->leftJoin('order_items', 'orders.order_id', '=', 'order_items.order_id')
            ->leftJoin('product_variant', 'order_items.product_variant_id', '=', 'product_variant.product_variant_id')
            ->leftJoin('products', 'product_variant.product_id', '=', 'products.product_id')
            ->leftJoin('variants', 'product_variant.variant_id', '=', 'variants.variant_id')
            ->select(
                'orders.school_name',
                'orders.contact_person',
                'orders.contact_no',
                'order_items.order_qty',
                'order_items.price',
                'order_items.uom',
                'products.product_name',
                'variants.variant',
                'product_variant.code',
                'orders.created_at',
            )
            ->get()
            ->toArray();

        try {
            $response = $this->createMultipleItems($boardId, $items);
            if (isset($response->error_message)) {
                // save to database and email to try later 
                Log::error("Error updating monday for Order Id: " . $orderId . $response);
            } else {
                $mondayIds = "";
                foreach ($response['data'] as $d) {
                    $mondayIds .= $d['id'] . ', ';
                }
                Orders::where('order_id', $orderId)
                    ->update(
                        [
                            'monday_id' => $mondayIds,
                            'monday_status' => '0'
                        ]
                    );
            }
        } catch (Throwable $ex) {
            Log::error($ex);
        }
    }

    public function createMultipleItems(int $boardId, array $items): array
    {
        $mutations = [];

        foreach ($items as $index => $item) {
            $itemName = $item['school_name'];
            $date = new DateTime($item['created_at']);
            $date->setTimezone(new DateTimeZone('UTC'));
            $columnValues =
                json_encode([
                    "text_mkpf62tv" => $item['contact_person'],
                    "text_mkpfck1a" => $item['contact_no'],
                    "date4" => ['date' => $date->format('Y-m-d'), 'time' => $date->format('H:i:s')],
                    "text_mkpfqfy" => $item['product_name'],
                    "text_mkpfbw2d" => $item['variant'] . " - " . $item['code'],
                    "numeric_mkpfzzj3" => $item['order_qty'],
                    "numeric_mkpfh2zy" => $item['price'],
                    "text_mkpfx8qj" => $item['uom'],
                    "status" => ['label' => 'New Order'],
                    "numeric_mkpf6390" => $item['order_qty'] * $item['price']
                ]);

            $mondayValue = json_encode($columnValues);

            $mutations[] = <<<GQL
                item{$index}: create_item (
                    board_id: {$boardId},
                    item_name: "{$itemName}",
                    column_values: {$mondayValue}
                ) {
                    id
                }
            GQL;
        }

        $query = 'mutation { ' . implode(' ', $mutations) . ' }';
        return $this->makeRequest($query);
    }

    protected function makeRequest(string $query): array
    {
        $apiToken = config('services.monday.token');
        $apiUrl = 'https://api.monday.com/v2';

        $guzzleClient = new Client();
        $response = $guzzleClient->post($apiUrl, [
            'headers' => [
                'Authorization' => $apiToken,
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'query' => $query
            ]

        ]);

        return json_decode($response->getBody()->getContents(), true);
    }
}
