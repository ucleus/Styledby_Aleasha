<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlockedDate;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class BlockedDatesController extends Controller
{
    /**
     * Display a listing of blocked dates
     */
    public function index(): JsonResponse
    {
        $blockedDates = BlockedDate::future()
            ->orderBy('blocked_date')
            ->get()
            ->map(function ($date) {
                return [
                    'id' => $date->id,
                    'date' => $date->blocked_date->format('Y-m-d'),
                    'type' => $date->type,
                    'start_time' => $date->start_time,
                    'end_time' => $date->end_time,
                    'reason' => $date->reason
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $blockedDates
        ]);
    }

    /**
     * Store a newly blocked date
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date|after_or_equal:today',
            'type' => 'in:full-day,partial',
            'start_time' => 'nullable|required_if:type,partial',
            'end_time' => 'nullable|required_if:type,partial',
            'reason' => 'nullable|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $blockedDate = BlockedDate::create([
                'blocked_date' => $request->date,
                'type' => $request->type ?? 'full-day',
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
                'reason' => $request->reason
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Date blocked successfully',
                'data' => [
                    'id' => $blockedDate->id,
                    'date' => $blockedDate->blocked_date->format('Y-m-d'),
                    'type' => $blockedDate->type,
                    'reason' => $blockedDate->reason
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to block date: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove a blocked date
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $blockedDate = BlockedDate::findOrFail($id);
            $blockedDate->delete();

            return response()->json([
                'success' => true,
                'message' => 'Blocked date removed successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove blocked date: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle a date's blocked status
     */
    public function toggle(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date|after_or_equal:today'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $existingBlock = BlockedDate::where('blocked_date', $request->date)->first();

            if ($existingBlock) {
                $existingBlock->delete();
                $message = 'Date unblocked successfully';
                $blocked = false;
            } else {
                BlockedDate::create([
                    'blocked_date' => $request->date,
                    'type' => 'full-day'
                ]);
                $message = 'Date blocked successfully';
                $blocked = true;
            }

            return response()->json([
                'success' => true,
                'message' => $message,
                'blocked' => $blocked
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to toggle date: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check if a date is blocked
     */
    public function check(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $isBlocked = BlockedDate::isDateBlocked($request->date);

        return response()->json([
            'success' => true,
            'blocked' => $isBlocked
        ]);
    }
}
