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

=======
use App\Models\Appointment;
use Illuminate\Support\Facades\Http;

class PushNotificationService
{
    protected $serverKey;

    public function __construct()
    {
        $this->serverKey = config('services.fcm.server_key');
    }

    public function sendAppointmentNotification(string $token, Appointment $appointment): bool
    {
        if (empty($this->serverKey) || empty($token)) {
            \Log::warning('FCM notification skipped: missing server key or token');
            return false;
        }

        $response = Http::withToken($this->serverKey)
            ->post('https://fcm.googleapis.com/fcm/send', [
                'to' => $token,
                'notification' => [
                    'title' => 'Appointment Booked',
                    'body' => sprintf(
                        'Your %s appointment is scheduled for %s.',
                        $appointment->serviceType->name,
                        $appointment->start_at->format('M d, Y g:i A')
                    ),
                ],
                'data' => [
                    'appointment_id' => $appointment->id,
                    'start_at' => $appointment->start_at->toIso8601String(),
                    'end_at' => $appointment->end_at->toIso8601String(),
                ],
            ]);

        return $response->successful();
    }
}
