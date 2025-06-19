<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlockedDate extends Model
{
    use HasFactory;

    protected $fillable = [
        'blocked_date',
        'type',
        'start_time',
        'end_time',
        'reason'
    ];

    protected $casts = [
        'blocked_date' => 'date',
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i'
    ];

    /**
     * Scope for getting future blocked dates
     */
    public function scopeFuture($query)
    {
        return $query->where('blocked_date', '>=', now()->toDateString());
    }

    /**
     * Check if a date is blocked
     */
    public static function isDateBlocked($date)
    {
        return self::where('blocked_date', $date)->exists();
    }
}
