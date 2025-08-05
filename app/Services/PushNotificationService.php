<?php

namespace App\Services;

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
