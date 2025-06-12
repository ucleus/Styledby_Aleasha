<?php

namespace App\Http\Controllers\Api;

use App\Models\Appointment;
use App\Models\Customer;
use App\Models\ServiceType;
use App\Services\SquarePaymentService;
use App\Notifications\AppointmentBooked;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AppointmentController extends BaseController
{
    protected $squareService;

    public function __construct(SquarePaymentService $squareService)
    {
        $this->squareService = $squareService;
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'firebase_uid' => 'required|string',
            'service_type_id' => 'required|exists:service_types,id',
            'start_at' => 'required|date|after:now',
            'notes' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $customer = Customer::where('firebase_uid', $request->firebase_uid)->first();
            if (!$customer) {
                return $this->sendError('Customer not found', [], 404);
            }

            $serviceType = ServiceType::find($request->service_type_id);
            $startAt = Carbon::parse($request->start_at);
            $endAt = $startAt->copy()->addMinutes($serviceType->duration_min);

            // Check availability
            $isBooked = Appointment::where('status', '!=', 'canceled')
                ->where(function ($query) use ($startAt, $endAt) {
                    $query->whereBetween('start_at', [$startAt, $endAt])
                        ->orWhereBetween('end_at', [$startAt, $endAt]);
                })
                ->exists();

            if ($isBooked) {
                return $this->sendError('This time slot is no longer available', [], 400);
            }

            // Create appointment
            $appointment = Appointment::create([
                'customer_id' => $customer->id,
                'service_type_id' => $serviceType->id,
                'start_at' => $startAt,
                'end_at' => $endAt,
                'status' => 'booked',
                'notes' => $request->notes,
            ]);

            // Create Square checkout
            $depositAmount = $serviceType->deposit_amount_cents;
            $checkoutUrl = $this->squareService->createCheckout(
                $appointment,
                $depositAmount,
                $customer->email
            );

            DB::commit();

            // Send notifications
            $customer->notify(new AppointmentBooked($appointment));

            return $this->sendResponse([
                'appointment' => $appointment->load(['customer', 'serviceType']),
                'checkout_url' => $checkoutUrl,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Failed to create appointment', [$e->getMessage()], 500);
        }
    }

    public function show($id): JsonResponse
    {
        $appointment = Appointment::with(['customer', 'serviceType'])->find($id);
        
        if (!$appointment) {
            return $this->sendError('Appointment not found');
        }

        return $this->sendResponse($appointment);
    }

    public function cancel($id, Request $request): JsonResponse
    {
        $appointment = Appointment::find($id);
        
        if (!$appointment) {
            return $this->sendError('Appointment not found');
        }

        $customer = Customer::where('firebase_uid', $request->firebase_uid)->first();
        
        if ($appointment->customer_id !== $customer->id) {
            return $this->sendError('Unauthorized', [], 403);
        }

        if ($appointment->status === 'canceled') {
            return $this->sendError('Appointment already canceled', [], 400);
        }

        $appointment->update(['status' => 'canceled']);

        return $this->sendResponse($appointment, 'Appointment canceled successfully');
    }
}
