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
        $this->client = new SquareClient([
            'accessToken' => config('services.square.access_token'),
            'environment' => config('services.square.environment'),
        ]);
        
        $this->locationId = config('services.square.location_id');
    }

    public function createCheckout(Appointment $appointment, int $amountCents, string $email): string
    {
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
    }
}
