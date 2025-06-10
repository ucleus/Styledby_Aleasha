<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Notifications\PaymentReceived;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    public function handleSquareWebhook(Request $request)
    {
        $signature = $request->header('x-square-hmacsha256-signature');
        $body = $request->getContent();
        
        // Verify webhook signature
        $hash = base64_encode(
            hash_hmac('sha256', $body, config('services.square.webhook_signature_key'), true)
        );

        if ($hash !== $signature) {
            return response()->json(['error' => 'Invalid signature'], 401);
        }

        $data = json_decode($body, true);

        switch ($data['type']) {
            case 'payment.created':
                $this->handlePaymentCreated($data['data']);
                break;
        }

        return response()->json(['success' => true]);
    }

    private function handlePaymentCreated($data)
    {
        $paymentId = $data['object']['payment']['id'];
        $orderId = $data['object']['payment']['order_id'];

        $appointment = Appointment::where('square_payment_id', $orderId)->first();
        
        if ($appointment) {
            $appointment->update([
                'status' => 'paid',
                'amount_paid_cents' => $data['object']['payment']['amount_money']['amount'],
            ]);

            $appointment->customer->notify(new PaymentReceived($appointment));
        }
    }
}