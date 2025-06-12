<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\AvailabilityWindow;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $startDate = $request->get('start_date', Carbon::now()->startOfMonth());
        $endDate = $request->get('end_date', Carbon::now()->endOfMonth());

        $appointments = Appointment::with(['customer', 'serviceType'])
            ->whereBetween('start_at', [$startDate, $endDate])
            ->orderBy('start_at')
            ->get();

        $stats = [
            'total_appointments' => $appointments->count(),
            'completed' => $appointments->where('status', 'completed')->count(),
            'canceled' => $appointments->where('status', 'canceled')->count(),
            'revenue' => $appointments->where('status', '!=', 'canceled')->sum('amount_paid_cents') / 100,
        ];

        return response()->json([
            'appointments' => $appointments,
            'stats' => $stats,
        ]);
    }

    public function updateAvailability(Request $request): JsonResponse
    {
        $request->validate([
            'date' => 'required|date',
            'windows' => 'required|array',
            'windows.*.start_time' => 'required|date_format:H:i',
            'windows.*.end_time' => 'required|date_format:H:i',
            'windows.*.max_slots' => 'required|integer|min:1',
            'windows.*.allowed_service_type_ids' => 'nullable|array',
        ]);

        $date = Carbon::parse($request->date);

        // Delete existing windows for this date
        AvailabilityWindow::whereDate('start_at', $date)->delete();

        // Create new windows
        foreach ($request->windows as $window) {
            $startAt = $date->copy()->setTimeFromTimeString($window['start_time']);
            $endAt = $date->copy()->setTimeFromTimeString($window['end_time']);

            AvailabilityWindow::create([
                'stylist_id' => 1,
                'start_at' => $startAt,
                'end_at' => $endAt,
                'max_slots' => $window['max_slots'],
                'allowed_service_type_ids' => $window['allowed_service_type_ids'] ?? null,
            ]);
        }

        return response()->json(['message' => 'Availability updated successfully']);
    }
}
