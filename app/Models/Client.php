<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'fName',
        'lName',
        'address',
        'apt',
        'city',
        'state',
        'zip',
        'phone',
        'phone2',
        'email',
        'photo_path',
        'instagram',
        'facebook',
        'twitter',
        'tiktok',
        'linkedin',
        'notes',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Accessor for full name
    public function getFullNameAttribute()
    {
        return $this->fName . ' ' . $this->lName;
    }

    // Accessor for formatted address
    public function getFormattedAddressAttribute()
    {
        $address = $this->address;
        if ($this->apt) {
            $address .= ', ' . $this->apt;
        }
        return $address . ', ' . $this->city . ', ' . $this->state . ' ' . $this->zip;
    }
}
