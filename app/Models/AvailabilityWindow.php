<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AvailabilityWindow extends Model
{
    use HasFactory;

    protected $fillable = [
        'stylist_id',
        'start_at',
        'end_at',
        'max_slots',
        'allowed_service_type_ids',
        'is_active',
    ];

    protected $casts = [
        'start_at' => 'datetime',
        'end_at' => 'datetime',
        'allowed_service_type_ids' => 'array',
        'is_active' => 'boolean',
    ];

    public function getBookedSlotsCount(): int
    {
        return Appointment::where('status', '!=', 'canceled')
            ->where('start_at', '>=', $this->start_at)
            ->where('end_at', '<=', $this->end_at)
            ->count();
    }

    public function hasAvailableSlots(): bool
    {
        return $this->getBookedSlotsCount() < $this->max_slots;
    }
}
