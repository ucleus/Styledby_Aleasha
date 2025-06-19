<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Customer;
use App\Models\ServiceType;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class AppointmentsController extends Controller
{
    /**
     * Display a listing of appointments
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Appointment::with(['customer', 'serviceType'])
                ->orderBy('start_at', 'desc');

            // Filter by date if provided
            if ($request->has('date')) {
                $date = $request->date;
                $query->whereDate('start_at', $date);
            }

            // Filter by status if provided
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            $appointments = $query->get()->map(function ($appointment) {
                return [
                    'id' => $appointment->id,
                    'customer' => [
                        'id' => $appointment->customer->id,
                        'name' => $appointment->customer->name,
                        'email' => $appointment->customer->email,
                        'phone' => $appointment->customer->phone,
                    ],
                    'service' => [
                        'id' => $appointment->serviceType->id,
                        'name' => $appointment->serviceType->name,
                        'category' => $appointment->serviceType->category,
                        'duration' => $appointment->serviceType->duration_min,
                        'price' => $appointment->serviceType->price_cents / 100,
                    ],
                    'date' => $appointment->start_at->format('Y-m-d'),
                    'time' => $appointment->start_at->format('H:i'),
                    'end_time' => $appointment->end_at->format('H:i'),
                    'status' => $appointment->status,
                    'payment_status' => $appointment->amount_paid_cents > 0 ? 'paid' : 'pending',
                    'amount_paid' => $appointment->amount_paid_cents / 100,
                    'notes' => $appointment->notes,
                    'created_at' => $appointment->created_at->format('Y-m-d H:i:s'),
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $appointments
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch appointments: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created appointment
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'customer.name' => 'required|string|max:255',
            'customer.email' => 'required|email|max:255',
            'customer.phone' => 'required|string|max:20',
            'service_type_id' => 'required|exists:service_types,id',
            'start_at' => 'required|date|after:now',
            'end_at' => 'required|date|after:start_at',
            'status' => 'required|in:booked,paid,completed,canceled',
            'notes' => 'nullable|string|max:1000',
            'amount_paid_cents' => 'integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Find or create customer
            $customer = Customer::where('email', $request->customer['email'])->first();
            
            if (!$customer) {
                $customer = Customer::create([
                    'firebase_uid' => 'admin_created_' . uniqid(), // Temporary UID for admin-created customers
                    'name' => $request->customer['name'],
                    'email' => $request->customer['email'],
                    'phone' => $request->customer['phone'],
                ]);
            } else {
                // Update customer info if it changed
                $customer->update([
                    'name' => $request->customer['name'],
                    'phone' => $request->customer['phone'],
                ]);
            }

            // Get service details
            $service = ServiceType::findOrFail($request->service_type_id);

            // Create appointment
            $appointment = Appointment::create([
                'customer_id' => $customer->id,
                'service_type_id' => $request->service_type_id,
                'start_at' => $request->start_at,
                'end_at' => $request->end_at,
                'status' => $request->status,
                'amount_paid_cents' => $request->amount_paid_cents ?? 0,
                'notes' => $request->notes,
            ]);

            DB::commit();

            // Load relationships for response
            $appointment->load(['customer', 'serviceType']);

            return response()->json([
                'success' => true,
                'message' => 'Appointment created successfully',
                'data' => [
                    'id' => $appointment->id,
                    'customer' => [
                        'name' => $appointment->customer->name,
                        'email' => $appointment->customer->email,
                        'phone' => $appointment->customer->phone,
                    ],
                    'service' => [
                        'name' => $appointment->serviceType->name,
                        'duration' => $appointment->serviceType->duration_min,
                        'price' => $appointment->serviceType->price_cents / 100,
                    ],
                    'date' => $appointment->start_at->format('Y-m-d'),
                    'time' => $appointment->start_at->format('H:i'),
                    'status' => $appointment->status,
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create appointment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update appointment status
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => 'sometimes|in:booked,paid,completed,canceled',
            'notes' => 'sometimes|nullable|string|max:1000',
            'amount_paid_cents' => 'sometimes|integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $appointment = Appointment::findOrFail($id);
            
            $appointment->update($request->only([
                'status', 'notes', 'amount_paid_cents'
            ]));

            return response()->json([
                'success' => true,
                'message' => 'Appointment updated successfully',
                'data' => [
                    'id' => $appointment->id,
                    'status' => $appointment->status,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update appointment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cancel an appointment
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $appointment = Appointment::findOrFail($id);
            $appointment->update(['status' => 'canceled']);

            return response()->json([
                'success' => true,
                'message' => 'Appointment canceled successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel appointment: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get appointment statistics
     */
    public function stats(): JsonResponse
    {
        try {
            $today = now()->toDateString();
            $thisWeek = now()->startOfWeek();
            $thisMonth = now()->startOfMonth();

            $stats = [
                'today' => Appointment::whereDate('start_at', $today)->count(),
                'this_week' => Appointment::where('start_at', '>=', $thisWeek)->count(),
                'this_month' => Appointment::where('start_at', '>=', $thisMonth)->count(),
                'total_revenue' => Appointment::sum('amount_paid_cents') / 100,
                'status_counts' => [
                    'booked' => Appointment::where('status', 'booked')->count(),
                    'paid' => Appointment::where('status', 'paid')->count(),
                    'completed' => Appointment::where('status', 'completed')->count(),
                    'canceled' => Appointment::where('status', 'canceled')->count(),
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch stats: ' . $e->getMessage()
            ], 500);
        }
    }
}
