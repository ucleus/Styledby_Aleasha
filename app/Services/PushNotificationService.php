<?php

namespace App\Services;

use App\Models\Customer;
use Kreait\Firebase\Messaging;
use Kreait\Firebase\Exception\FirebaseException;
use Kreait\Firebase\Exception\MessagingException;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification;

class PushNotificationService
{
    protected Messaging $messaging;
    protected string $adminTopic;

    public function __construct(Messaging $messaging)
    {
        $this->messaging = $messaging;
        $this->adminTopic = config('services.firebase_admin_topic', 'admins');
    }

    /**
     * Send a push notification to a specific customer.
     */
    public function sendToCustomer(Customer $customer, string $title, string $body, array $data = []): void
    {
        $target = $customer->fcm_token ?? null;
        $targetType = 'token';

        if (!$target) {
            $targetType = 'topic';
            $target = 'customer-' . $customer->firebase_uid;
        }

        $message = CloudMessage::withTarget($targetType, $target)
            ->withNotification(Notification::create($title, $body))
            ->withData($data);

        try {
            $this->messaging->send($message);
        } catch (MessagingException|FirebaseException $e) {
            \Log::error('Failed to send push notification to customer', [
                'customer_id' => $customer->id,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Send a push notification to all admins.
     */
    public function sendToAdmin(string $title, string $body, array $data = []): void
    {
        $message = CloudMessage::withTarget('topic', $this->adminTopic)
            ->withNotification(Notification::create($title, $body))
            ->withData($data);

        try {
            $this->messaging->send($message);
        } catch (MessagingException|FirebaseException $e) {
            \Log::error('Failed to send push notification to admins', [
                'error' => $e->getMessage(),
            ]);
        }
    }
}

