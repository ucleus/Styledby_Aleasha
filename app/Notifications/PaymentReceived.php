<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentReceived extends Notification
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
        return (new MailMessage)
            ->subject('Payment Confirmed - Styles By Aleasha')
            ->greeting('Thank you, ' . $notifiable->name . '!')
            ->line('Your payment has been successfully processed.')
            ->line('**Appointment Details:**')
            ->line('Service: ' . $this->appointment->serviceType->name)
            ->line('Date: ' . $this->appointment->start_at->format('l, F j, Y'))
            ->line('Time: ' . $this->appointment->start_at->format('g:i A'))
            ->line('Duration: ' . $this->appointment->serviceType->duration_min . ' minutes')
            ->line('Amount Paid: $' . number_format($this->appointment->amount_paid_cents / 100, 2))
            ->line('Your appointment is now confirmed. We\'ll send you a reminder 24 hours before your appointment.')
            ->action('View Receipt', url('/appointments/' . $this->appointment->id . '/receipt'))
            ->line('If you have any questions, please don\'t hesitate to contact us.')
            ->salutation('See you soon, Aleasha');
    }
}