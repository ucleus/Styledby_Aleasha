<?php

namespace App\Http\Controllers;

use App\Constants\HttpStatusCodes;
use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Notifications\PaymentReceived;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    public function handleSquareWebhook(Request $request): JsonResponse
    {
        $signature = $request->header('x-square-hmacsha256-signature');
        $body = $request->getContent();
        
        // Verify webhook signature
        $hash = base64_encode(
            hash_hmac('sha256', $body, config('services.square.webhook_signature_key'), true)
        );

        if ($hash !== $signature) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid signature'
            ], HttpStatusCodes::UNAUTHORIZED);
        }

        $data = json_decode($body, true);

        if (!isset($data['type'])) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid webhook payload'
            ], HttpStatusCodes::BAD_REQUEST);
        }

        switch ($data['type']) {
            case 'payment.created':
                $this->handlePaymentCreated($data['data']);
                break;
            default:
                return response()->json([
                    'success' => false,
                    'message' => 'Unsupported webhook event type'
                ], HttpStatusCodes::BAD_REQUEST);
        }

        return response()->json([
            'success' => true,
            'data' => [],
            'message' => 'Webhook processed successfully'
        ]);
    }

    private function handlePaymentCreated($data): void
    {
        $paymentId = $data['object']['payment']['id'] ?? null;
        $orderId = $data['object']['payment']['order_id'] ?? null;

        if (!$orderId) {
            Log::error('Missing order ID in Square payment webhook', ['data' => $data]);
            return;
        }

        $appointment = Appointment::where('square_payment_id', $orderId)->first();
        
        if ($appointment) {
            $appointment->update([
                'status' => 'paid',
                'amount_paid_cents' => $data['object']['payment']['amount_money']['amount'] ?? 0,
            ]);

            $appointment->customer->notify(new PaymentReceived($appointment));
        } else {
            Log::warning('Appointment not found for Square payment', [
                'order_id' => $orderId,
                'payment_id' => $paymentId,
            ]);
        }
    }
}