<?php

namespace App\Http\Controllers\Api;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Kreait\Laravel\Firebase\Facades\Firebase;
use App\Constants\HttpStatusCodes;

class AuthController extends BaseController
{
    public function verifyToken(Request $request): JsonResponse
    {
        $request->validate([
            'idToken' => 'required|string',
        ]);

        try {
            $auth = Firebase::auth();
            $verifiedIdToken = $auth->verifyIdToken($request->idToken);
            $uid = $verifiedIdToken->claims()->get('sub');
            $email = $verifiedIdToken->claims()->get('email');
            $name = $verifiedIdToken->claims()->get('name');

            $customer = Customer::updateOrCreate(
                ['firebase_uid' => $uid],
                [
                    'email' => $email,
                    'name' => $name ?? 'Guest User',
                ]
            );

            return $this->sendResponse([
                'customer' => $customer,
                'isAdmin' => $verifiedIdToken->claims()->get('admin', false),
            ]);
        } catch (\Exception $e) {
            return $this->sendError('Invalid token', [$e->getMessage()], HttpStatusCodes::UNAUTHORIZED);
        }
    }
}
