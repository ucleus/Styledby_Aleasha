<?php

namespace App\Services;

use App\Models\DeviceToken;
use Illuminate\Support\Facades\Log;
use Kreait\Laravel\Firebase\Facades\Firebase;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification;

class AdminNotificationService
{
    /**
     * Send an FCM notification to all admin device tokens.
     */
    public function send(string $title, string $body): void
    {
        $tokens = DeviceToken::where('is_admin', true)->pluck('token')->all();

        if (empty($tokens)) {
            return;
        }

        $messaging = Firebase::messaging();
        $notification = Notification::create($title, $body);

        foreach ($tokens as $token) {
            $message = CloudMessage::new()
                ->withNotification($notification)
                ->withChangedTarget('token', $token);

            try {
                $messaging->send($message);
            } catch (\Throwable $e) {
                Log::error('Failed to send admin FCM message', [
                    'token' => $token,
                    'error' => $e->getMessage(),
                ]);
            }
        }
    }
}
