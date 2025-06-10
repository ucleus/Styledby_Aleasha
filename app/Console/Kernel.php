<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Models\Appointment;
use App\Notifications\AppointmentReminder;
use Illuminate\Support\Facades\Log;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Send appointment reminders 24 hours before
        $schedule->call(function () {
            try {
                $tomorrow = now()->addDay();
                
                $appointments = Appointment::with(['customer', 'serviceType'])
                    ->where('status', 'paid')
                    ->whereBetween('start_at', [
                        $tomorrow->startOfDay(),
                        $tomorrow->endOfDay()
                    ])
                    ->get();

                Log::info('Sending appointment reminders', [
                    'count' => $appointments->count(),
                    'date' => $tomorrow->toDateString()
                ]);

                foreach ($appointments as $appointment) {
                    try {
                        if ($appointment->customer) {
                            $appointment->customer->notify(new AppointmentReminder($appointment));
                            Log::info('Reminder sent', [
                                'appointment_id' => $appointment->id,
                                'customer_email' => $appointment->customer->email
                            ]);
                        } else {
                            Log::warning('Appointment missing customer', [
                                'appointment_id' => $appointment->id
                            ]);
                        }
                    } catch (\Exception $e) {
                        Log::error('Failed to send reminder', [
                            'appointment_id' => $appointment->id,
                            'error' => $e->getMessage()
                        ]);
                    }
                }

                Log::info('Appointment reminder task completed');
            } catch (\Exception $e) {
                Log::error('Appointment reminder task failed', [
                    'error' => $e->getMessage()
                ]);
            }
        })->daily()->at('10:00')->name('appointment-reminders');

        // Optional: Clean up old canceled appointments (older than 6 months)
        $schedule->call(function () {
            try {
                $sixMonthsAgo = now()->subMonths(6);
                
                $deleted = Appointment::where('status', 'canceled')
                    ->where('created_at', '<', $sixMonthsAgo)
                    ->delete();
                    
                Log::info('Cleaned up old appointments', ['count' => $deleted]);
            } catch (\Exception $e) {
                Log::error('Cleanup task failed', ['error' => $e->getMessage()]);
            }
        })->monthly()->name('cleanup-old-appointments');
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}