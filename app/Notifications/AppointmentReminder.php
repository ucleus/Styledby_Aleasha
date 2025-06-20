<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AppointmentReminder extends Notification
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
            ->subject('Appointment Reminder - Styles By Aleasha')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('This is a friendly reminder about your upcoming appointment.')
            ->line('**Service:** ' . $this->appointment->serviceType->name)
            ->line('**Date:** ' . $this->appointment->start_at->format('l, F j, Y'))
            ->line('**Time:** ' . $this->appointment->start_at->format('g:i A'))
            ->line('**Duration:** ' . $this->appointment->serviceType->duration_min . ' minutes')
            ->line('Please make sure to be ready for your mobile styling appointment.')
            ->line('If you need to cancel or reschedule, please let us know as soon as possible.')
            ->action('View Appointment Details', url('/appointments/' . $this->appointment->id))
            ->line('Looking forward to seeing you!')
            ->salutation('Best regards, Aleasha');
    }
}