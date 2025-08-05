<?php

namespace App\Jobs;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Kreait\Laravel\Firebase\Facades\Firebase;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification;
use Illuminate\Support\Facades\Log;

class SendAppointmentReminder implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(public Appointment $appointment)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->appointment->load(['customer', 'serviceType']);
        $customer = $this->appointment->customer;

        if (!$customer || !$customer->firebase_uid) {
            Log::warning('Skipping appointment reminder: missing customer or firebase UID', [
                'appointment_id' => $this->appointment->id,
            ]);
            return;
        }

        try {
            $messaging = Firebase::messaging();

            $message = CloudMessage::fromArray([
                // Assumes client subscribes to a topic based on firebase UID
                'topic' => 'user_' . $customer->firebase_uid,
                'notification' => [
                    'title' => 'Appointment Reminder',
                    'body' => 'Your ' . $this->appointment->serviceType->name . ' appointment starts at ' .
                        $this->appointment->start_at->format('g:i A'),
                ],
                'data' => [
                    'appointment_id' => (string) $this->appointment->id,
                    'start_at' => $this->appointment->start_at->toIso8601String(),
                ],
            ]);

            $messaging->send($message);
            Log::info('Appointment reminder sent', ['appointment_id' => $this->appointment->id]);
        } catch (\Throwable $e) {
            Log::error('Failed to send appointment reminder', [
                'appointment_id' => $this->appointment->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
