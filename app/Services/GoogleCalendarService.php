<?php

namespace App\Services;

use Google_Client;
use Google_Service_Calendar;
use Google_Service_Calendar_Event;
use Google_Service_Calendar_EventDateTime;
use Carbon\Carbon;
use Exception;

class GoogleCalendarService
{
    private $client;
    private $service;
    private $calendarId;

    public function __construct()
    {
        $this->client = new Google_Client();
        $this->client->setApplicationName('Styles by Aleasha');
        $this->client->setScopes([Google_Service_Calendar::CALENDAR]);
        
        // Set up authentication with service account
        $keyPath = storage_path('app/google-service-account.json');
        if (file_exists($keyPath)) {
            $this->client->setAuthConfig($keyPath);
        } else {
            // Fallback to OAuth if service account not available
            $this->client->setClientId(config('services.google.client_id'));
            $this->client->setClientSecret(config('services.google.client_secret'));
            $this->client->setRedirectUri(config('app.url') . '/auth/google/callback');
        }

        $this->service = new Google_Service_Calendar($this->client);
        $this->calendarId = config('services.google.calendar_id', 'primary');
    }

    /**
     * Get busy times for a specific date range
     */
    public function getBusyTimes($startDate, $endDate)
    {
        try {
            $timeMin = Carbon::parse($startDate)->startOfDay()->toRfc3339String();
            $timeMax = Carbon::parse($endDate)->endOfDay()->toRfc3339String();

            $events = $this->service->events->listEvents($this->calendarId, [
                'timeMin' => $timeMin,
                'timeMax' => $timeMax,
                'singleEvents' => true,
                'orderBy' => 'startTime',
            ]);

            $busyTimes = [];
            foreach ($events->getItems() as $event) {
                $start = $event->getStart();
                $end = $event->getEnd();
                
                $busyTimes[] = [
                    'start' => $start->getDateTime() ?? $start->getDate(),
                    'end' => $end->getDateTime() ?? $end->getDate(),
                    'summary' => $event->getSummary(),
                ];
            }

            return $busyTimes;
        } catch (Exception $e) {
            \Log::error('Google Calendar API error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Create an appointment in Google Calendar
     */
    public function createAppointment($appointment)
    {
        try {
            $event = new Google_Service_Calendar_Event([
                'summary' => $appointment['title'] ?? 'Hair Appointment',
                'description' => $appointment['description'] ?? '',
                'start' => new Google_Service_Calendar_EventDateTime([
                    'dateTime' => Carbon::parse($appointment['start_time'])->toRfc3339String(),
                    'timeZone' => config('app.timezone', 'America/New_York'),
                ]),
                'end' => new Google_Service_Calendar_EventDateTime([
                    'dateTime' => Carbon::parse($appointment['end_time'])->toRfc3339String(),
                    'timeZone' => config('app.timezone', 'America/New_York'),
                ]),
                'attendees' => [
                    ['email' => $appointment['customer_email'] ?? ''],
                ],
                'reminders' => [
                    'useDefault' => false,
                    'overrides' => [
                        ['method' => 'email', 'minutes' => 24 * 60], // 24 hours
                        ['method' => 'popup', 'minutes' => 10],
                    ],
                ],
            ]);

            $event = $this->service->events->insert($this->calendarId, $event);
            
            return [
                'success' => true,
                'event_id' => $event->getId(),
                'event_link' => $event->getHtmlLink(),
            ];
        } catch (Exception $e) {
            \Log::error('Failed to create Google Calendar event: ' . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Update an appointment in Google Calendar
     */
    public function updateAppointment($eventId, $appointment)
    {
        try {
            $event = $this->service->events->get($this->calendarId, $eventId);
            
            $event->setSummary($appointment['title'] ?? $event->getSummary());
            $event->setDescription($appointment['description'] ?? $event->getDescription());
            
            if (isset($appointment['start_time'])) {
                $event->setStart(new Google_Service_Calendar_EventDateTime([
                    'dateTime' => Carbon::parse($appointment['start_time'])->toRfc3339String(),
                    'timeZone' => config('app.timezone', 'America/New_York'),
                ]));
            }
            
            if (isset($appointment['end_time'])) {
                $event->setEnd(new Google_Service_Calendar_EventDateTime([
                    'dateTime' => Carbon::parse($appointment['end_time'])->toRfc3339String(),
                    'timeZone' => config('app.timezone', 'America/New_York'),
                ]));
            }

            $updatedEvent = $this->service->events->update($this->calendarId, $eventId, $event);
            
            return [
                'success' => true,
                'event_id' => $updatedEvent->getId(),
            ];
        } catch (Exception $e) {
            \Log::error('Failed to update Google Calendar event: ' . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Cancel an appointment in Google Calendar
     */
    public function cancelAppointment($eventId)
    {
        try {
            $this->service->events->delete($this->calendarId, $eventId);
            
            return [
                'success' => true,
            ];
        } catch (Exception $e) {
            \Log::error('Failed to delete Google Calendar event: ' . $e->getMessage());
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Check if a time slot is available
     */
    public function isTimeSlotAvailable($startTime, $endTime)
    {
        $busyTimes = $this->getBusyTimes($startTime, $endTime);
        
        $requestStart = Carbon::parse($startTime);
        $requestEnd = Carbon::parse($endTime);
        
        foreach ($busyTimes as $busy) {
            $busyStart = Carbon::parse($busy['start']);
            $busyEnd = Carbon::parse($busy['end']);
            
            // Check for overlap
            if ($requestStart->lt($busyEnd) && $requestEnd->gt($busyStart)) {
                return false;
            }
        }
        
        return true;
    }
}