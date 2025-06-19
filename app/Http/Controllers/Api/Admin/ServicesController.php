<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ServiceType;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ServicesController extends Controller
{
    /**
     * Display a listing of services
     */
    public function index(): JsonResponse
    {
        try {
            $services = ServiceType::where('is_active', true)
                ->orderBy('category')
                ->orderBy('name')
                ->get()
                ->map(function ($service) {
                    return [
                        'id' => $service->id,
                        'name' => $service->name,
                        'category' => $service->category,
                        'duration_min' => $service->duration_min,
                        'price_cents' => $service->price_cents,
                        'price' => $service->price_cents / 100,
                        'description' => $service->description,
                        'is_active' => $service->is_active,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $services
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch services: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created service
     */
    public function store(Request $request): JsonResponse
    {
        // TODO: Implement service creation
        return response()->json([
            'success' => false,
            'message' => 'Service creation not yet implemented'
        ], 501);
    }

    /**
     * Update a service
     */
    public function update(Request $request, string $id): JsonResponse
    {
        // TODO: Implement service update
        return response()->json([
            'success' => false,
            'message' => 'Service update not yet implemented'
        ], 501);
    }

    /**
     * Delete a service
     */
    public function destroy(string $id): JsonResponse
    {
        // TODO: Implement service deletion
        return response()->json([
            'success' => false,
            'message' => 'Service deletion not yet implemented'
        ], 501);
    }
}
