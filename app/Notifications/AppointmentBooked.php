<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AppointmentBooked extends Notification
{
    use Queueable;

    protected $appointment;

    public function __construct(Appointment $appointment)
    {
        $this->appointment = $appointment;
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $depositAmount = $this->appointment->serviceType->deposit_amount_cents / 100;
        
        return (new MailMessage)
            ->subject('Appointment Booking - Styles By Aleasha')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Your appointment request has been received!')
            ->line('**Appointment Details:**')
            ->line('Service: ' . $this->appointment->serviceType->name)
            ->line('Date: ' . $this->appointment->start_at->format('l, F j, Y'))
            ->line('Time: ' . $this->appointment->start_at->format('g:i A'))
            ->line('Duration: ' . $this->appointment->serviceType->duration_min . ' minutes')
            ->line('Total Price: $' . number_format($this->appointment->serviceType->price_cents / 100, 2))
            ->line('**Required Deposit: $' . number_format($depositAmount, 2) . '**')
            ->line('Please complete your deposit payment within 30 minutes to confirm your appointment.')
            ->action('Complete Payment Now', url('/booking/payment/' . $this->appointment->id))
            ->line('If payment is not received within 30 minutes, your appointment will be automatically canceled.')
            ->line('Thank you for choosing Styles By Aleasha!')
            ->salutation('Best regards, Aleasha');
    }
}
