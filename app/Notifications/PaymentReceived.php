<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\VonageMessage;

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
        $channels = ['mail'];
        
        if ($notifiable->phone) {
            $channels[] = 'vonage';
        }
        
        return $channels;
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
            ->line('Amount Paid:  . ($this->appointment->amount_paid_cents / 100))
            ->line('Your appointment is now confirmed. We'll send you a reminder 24 hours before your appointment.')
            ->action('View Receipt', url('/appointments/' . $this->appointment->id . '/receipt'))
            ->line('If you have any questions, please don't hesitate to contact us.')
            ->salutation('See you soon, Aleasha');
    }

    public function toVonage($notifiable): VonageMessage
    {
        return (new VonageMessage)
            ->content('Payment confirmed! Your appointment at Styles By Aleasha on ' . 
                     $this->appointment->start_at->format('M j @ g:i A') . 
                     ' is confirmed. Thank you!');
    }
}