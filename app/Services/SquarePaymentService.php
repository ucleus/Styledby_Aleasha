<?php

namespace App\Services;

use App\Models\Appointment;
use Square\SquareClient;
use Square\Models\CreatePaymentLinkRequest;
use Square\Models\Money;
use Square\Models\QuickPay;
use Square\Models\PrePopulatedData;
use Square\Models\CheckoutOptions;

class SquarePaymentService
{
    protected $client;
    protected $locationId;

    public function __construct()
    {
        // Use a mock client for now to avoid errors
        $this->client = null;
        $this->locationId = config('services.square.location_id', 'placeholder');

        // Only try to instantiate the real client if we have the necessary configuration
        if (config('services.square.access_token')) {
            try {
                $this->client = new SquareClient(
                    config('services.square.access_token'),
                    config('services.square.environment', 'sandbox')
                );
            } catch (\Throwable $e) {
                // Log error but don't crash
                \Log::error('Failed to initialize Square client: ' . $e->getMessage());
            }
        }
    }

    public function createCheckout(Appointment $appointment, int $amountCents, string $email): string
    {
        // If we don't have a client, return a mock URL for development
        if ($this->client === null) {
            // Store a placeholder payment ID
            $appointment->update(['square_payment_id' => 'mock_' . uniqid()]);
            
            // Return a mock URL that points back to the app
            return config('app.url') . '/booking/success?mock=true';
        }

        try {
            $checkoutApi = $this->client->getCheckoutApi();

            $money = new Money();
            $money->setAmount($amountCents);
            $money->setCurrency('USD');

            $quickPay = new QuickPay(
                'Appointment Deposit - ' . $appointment->serviceType->name,
                $money,
                $this->locationId
            );

            $prePopulatedData = new PrePopulatedData();
            $prePopulatedData->setBuyerEmail($email);

            $checkoutOptions = new CheckoutOptions();
            $checkoutOptions->setRedirectUrl(config('app.url') . '/booking/success');

            $request = new CreatePaymentLinkRequest();
            $request->setIdempotencyKey(uniqid('appointment_', true));
            $request->setQuickPay($quickPay);
            $request->setPrePopulatedData($prePopulatedData);
            $request->setCheckoutOptions($checkoutOptions);
            $request->setPaymentNote('Appointment ID: ' . $appointment->id);

            $response = $checkoutApi->createPaymentLink($request);

            if ($response->isSuccess()) {
                $paymentLink = $response->getResult()->getPaymentLink();
                
                // Store the payment link order ID
                $appointment->update(['square_payment_id' => $paymentLink->getOrderId()]);
                
                return $paymentLink->getUrl();
            }

            throw new \Exception('Failed to create payment link: ' . $response->getErrors()[0]->getDetail());
        } catch (\Throwable $e) {
            \Log::error('Square payment error: ' . $e->getMessage());
            
            // Store a placeholder payment ID
            $appointment->update(['square_payment_id' => 'error_' . uniqid()]);
            
            // Return a mock URL for development
            return config('app.url') . '/booking/error?reason=square_error';
        }
    }
}