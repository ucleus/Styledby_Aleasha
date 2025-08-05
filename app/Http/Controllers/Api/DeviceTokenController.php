<?php

namespace App\Http\Controllers\Api;

use App\Models\Customer;
use App\Models\DeviceToken;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Constants\HttpStatusCodes;

class DeviceTokenController extends BaseController
{
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'firebase_uid' => 'required|string',
            'token' => 'required|string',
            'platform' => 'required|string',
        ]);

        $customer = Customer::where('firebase_uid', $request->firebase_uid)->first();

        if (!$customer) {
            return $this->sendError('Customer not found', [], HttpStatusCodes::NOT_FOUND);
        }

        DeviceToken::updateOrCreate(
            ['token' => $request->token],
            [
                'customer_id' => $customer->id,
                'platform' => $request->platform,
            ]
        );

        return $this->sendResponse([], 'Device token saved successfully');
    }
}
