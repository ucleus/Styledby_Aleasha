<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Jobs\SendAppointmentReminder;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'service_type_id',
        'start_at',
        'end_at',
        'status',
        'square_payment_id',
        'amount_paid_cents',
        'notes',
    ];

    protected $casts = [
        'start_at' => 'datetime',
        'end_at' => 'datetime',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function serviceType(): BelongsTo
    {
        return $this->belongsTo(ServiceType::class);
    }

    protected static function booted(): void
    {
        $dispatcher = function (Appointment $appointment) {
            if (
                $appointment->status === 'paid' &&
                $appointment->start_at
            ) {
                SendAppointmentReminder::dispatch($appointment)
                    ->delay($appointment->start_at->copy()->subMinutes(15));
            }
        };

        static::created($dispatcher);
        static::updated(function (Appointment $appointment) use ($dispatcher) {
            if ($appointment->getOriginal('status') !== 'paid') {
                $dispatcher($appointment);
            }
        });
    }
}
