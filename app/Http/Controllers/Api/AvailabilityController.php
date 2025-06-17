<?php

namespace App\Http\Controllers\Api;

use App\Models\AvailabilityWindow;
use App\Models\Appointment;
use App\Services\GoogleCalendarService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AvailabilityController extends BaseController
{
    protected $googleCalendar;

    public function __construct(GoogleCalendarService $googleCalendar)
    {
        $this->googleCalendar = $googleCalendar;
    }

    public function getAvailableSlots(Request $request): JsonResponse
    {
        $request->validate([
            'date' => 'required|date',
            'service_type_id' => 'required|exists:service_types,id',
        ]);

        $date = Carbon::parse($request->date);
        $serviceTypeId = $request->service_type_id;

        // Get availability windows for the date
        $windows = AvailabilityWindow::where('is_active', true)
            ->whereDate('start_at', $date)
            ->where(function ($query) use ($serviceTypeId) {
                $query->whereNull('allowed_service_type_ids')
                    ->orWhereJsonContains('allowed_service_type_ids', $serviceTypeId);
            })
            ->get();

        // Get busy times from Google Calendar
        $busyTimes = $this->googleCalendar->getBusyTimes(
            $date->startOfDay()->toDateTimeString(),
            $date->endOfDay()->toDateTimeString()
        );

        $availableSlots = [];

        foreach ($windows as $window) {
            if ($window->hasAvailableSlots()) {
                // Generate time slots within the window, considering Google Calendar conflicts
                $slots = $this->generateTimeSlots($window, $serviceTypeId, $busyTimes);
                $availableSlots = array_merge($availableSlots, $slots);
            }
        }

        return $this->sendResponse($availableSlots);
    }

    private function generateTimeSlots($window, $serviceTypeId, $busyTimes = [])
    {
        $slots = [];
        $serviceDuration = \App\Models\ServiceType::find($serviceTypeId)->duration_min;
        $current = $window->start_at->copy();

        while ($current->copy()->addMinutes($serviceDuration) <= $window->end_at) {
            // Check if this specific slot is available
            $slotEnd = $current->copy()->addMinutes($serviceDuration);
            
            // Check database bookings
            $isBooked = Appointment::where('status', '!=', 'canceled')
                ->where(function ($query) use ($current, $slotEnd) {
                    $query->whereBetween('start_at', [$current, $slotEnd])
                        ->orWhereBetween('end_at', [$current, $slotEnd])
                        ->orWhere(function ($q) use ($current, $slotEnd) {
                            $q->where('start_at', '<=', $current)
                                ->where('end_at', '>=', $slotEnd);
                        });
                })
                ->exists();

            // Check Google Calendar conflicts
            $isConflicted = $this->hasGoogleCalendarConflict($current, $slotEnd, $busyTimes);

            if (!$isBooked && !$isConflicted) {
                $slots[] = [
                    'start_at' => $current->toIso8601String(),
                    'end_at' => $slotEnd->toIso8601String(),
                    'window_id' => $window->id,
                ];
            }

            $current->addMinutes(30); // 30-minute intervals
        }

        return $slots;
    }

    private function hasGoogleCalendarConflict($slotStart, $slotEnd, $busyTimes)
    {
        foreach ($busyTimes as $busy) {
            $busyStart = Carbon::parse($busy['start']);
            $busyEnd = Carbon::parse($busy['end']);
            
            // Check for overlap
            if ($slotStart->lt($busyEnd) && $slotEnd->gt($busyStart)) {
                return true;
            }
        }
        
        return false;
    }
}