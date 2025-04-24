<?php

namespace App\Http\Controllers;

use App\Models\PreOrderItems;
use App\Models\PreOrders;
use DateTime;
use DateTimeZone;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Exceptions;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Uid\UuidV8;
use Throwable;

class PreOrderController extends Controller
{
    public function create(Request $req)
    {
        try {
            $orderId = UuidV8::v4();
            $no = PreOrders::whereYear('created_at', date('Y'))->count() + 1;
            $orderNo = date("Y") . str_pad($no, 5, '0', STR_PAD_LEFT);

            PreOrders::create([
                'preorder_id' => $orderId,
                'preorder_no' => $orderNo,
                'school_name' => $req->input('schoolName'),
                'contact_person' => $req->input('contactPerson'),
                'contact_no' => $req->input('contactNo'),
                'email' => $req->input('email'),
                'order_total' => $req->input('orderTotal'),
            ]);

            foreach ($req->input('orders') as $o) {
                PreOrderItems::create([
                    'preorder_id' => $orderId,
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

        $items = PreOrders::where('preorders.preorder_id', $orderId)
            ->leftJoin('preorder_items', 'preorders.preorder_id', '=', 'preorder_items.preorder_id')
            ->leftJoin('product_variant', 'preorder_items.product_variant_id', '=', 'product_variant.product_variant_id')
            ->leftJoin('products', 'product_variant.product_id', '=', 'products.product_id')
            ->leftJoin('variants', 'product_variant.variant_id', '=', 'variants.variant_id')
            ->select(
                'preorders.school_name',
                'preorders.contact_person',
                'preorders.contact_no',
                'preorders.email',
                'preorder_items.order_qty',
                'preorder_items.price',
                'preorder_items.uom',
                'products.product_name',
                'variants.variant',
                'product_variant.code',
                'preorders.created_at',
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
                PreOrders::where('preorder_id', $orderId)
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
                    "text_mkpmb950" => $item['email'],
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
