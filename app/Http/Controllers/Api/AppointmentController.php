<?php

namespace App\Http\Controllers\Api;

use App\Constants\HttpStatusCodes;
use App\Models\Appointment;
use App\Models\Customer;
use App\Models\ServiceType;
use App\Services\SquarePaymentService;
use App\Services\GoogleCalendarService;
use App\Notifications\AppointmentBooked;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AppointmentController extends BaseController
{
    protected $squareService;
    protected $googleCalendar;

    public function __construct(SquarePaymentService $squareService, GoogleCalendarService $googleCalendar)
    {
        $this->squareService = $squareService;
        $this->googleCalendar = $googleCalendar;
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
                return $this->sendError('Customer not found', [], HttpStatusCodes::NOT_FOUND);
            }

            $serviceType = ServiceType::find($request->service_type_id);
            $startAt = Carbon::parse($request->start_at);
            $endAt = $startAt->copy()->addMinutes($serviceType->duration_min);

            // Check availability in database
            $isBooked = Appointment::where('status', '!=', 'canceled')
                ->where(function ($query) use ($startAt, $endAt) {
                    $query->whereBetween('start_at', [$startAt, $endAt])
                        ->orWhereBetween('end_at', [$startAt, $endAt])
                        ->orWhere(function ($query) use ($startAt, $endAt) {
                            $query->where('start_at', '<', $startAt)
                                  ->where('end_at', '>', $endAt);
                        });
                })
                ->exists();

            if ($isBooked) {
                return $this->sendError('This time slot is no longer available', [], HttpStatusCodes::CONFLICT);
            }

            // Check availability in Google Calendar
            $isAvailable = $this->googleCalendar->isTimeSlotAvailable(
                $startAt->toDateTimeString(),
                $endAt->toDateTimeString()
            );

            if (!$isAvailable) {
                return $this->sendError('This time slot is no longer available', [], HttpStatusCodes::CONFLICT);
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

            // Create Google Calendar event
            $calendarEvent = $this->googleCalendar->createAppointment([
                'title' => $serviceType->name . ' - ' . $customer->name,
                'description' => $request->notes ?? '',
                'start_time' => $startAt->toDateTimeString(),
                'end_time' => $endAt->toDateTimeString(),
                'customer_email' => $customer->email,
            ]);

            if ($calendarEvent['success']) {
                $appointment->update(['google_event_id' => $calendarEvent['event_id']]);
            }

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
            return $this->sendError('Failed to create appointment', [$e->getMessage()], HttpStatusCodes::INTERNAL_SERVER_ERROR);
        }
    }

    public function show($id): JsonResponse
    {
        $appointment = Appointment::with(['customer', 'serviceType'])->find($id);
        
        if (!$appointment) {
            return $this->sendError('Appointment not found', [], HttpStatusCodes::NOT_FOUND);
        }

        return $this->sendResponse($appointment);
    }

    public function cancel($id, Request $request): JsonResponse
    {
        $appointment = Appointment::find($id);
        
        if (!$appointment) {
            return $this->sendError('Appointment not found', [], HttpStatusCodes::NOT_FOUND);
        }

        $customer = Customer::where('firebase_uid', $request->firebase_uid)->first();
        
        if ($appointment->customer_id !== $customer->id) {
            return $this->sendError('Unauthorized', [], HttpStatusCodes::FORBIDDEN);
        }

        if ($appointment->status === 'canceled') {
            return $this->sendError('Appointment already canceled', [], HttpStatusCodes::BAD_REQUEST);
        }

        // Cancel Google Calendar event if it exists
        if ($appointment->google_event_id) {
            $this->googleCalendar->cancelAppointment($appointment->google_event_id);
        }

        $appointment->update(['status' => 'canceled']);

        return $this->sendResponse($appointment, 'Appointment canceled successfully');
    }
}