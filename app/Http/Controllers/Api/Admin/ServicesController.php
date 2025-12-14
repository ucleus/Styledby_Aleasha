<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ServiceType;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

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
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'duration_min' => 'required|integer|min:1',
            'price_cents' => 'nullable|integer|min:0',
            'price' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'image_url' => 'nullable|url',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $priceCents = $request->price_cents ?? ($request->has('price') ? (int) round($request->price * 100) : null);

        if ($priceCents === null) {
            return response()->json([
                'success' => false,
                'message' => 'Price is required'
            ], 422);
        }

        try {
            $service = ServiceType::create([
                'name' => $request->name,
                'category' => $request->category,
                'duration_min' => $request->duration_min,
                'price_cents' => $priceCents,
                'description' => $request->description,
                'image_url' => $request->image_url,
                'is_active' => $request->boolean('is_active', true),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Service created successfully',
                'data' => [
                    'id' => $service->id,
                    'name' => $service->name,
                    'category' => $service->category,
                    'duration_min' => $service->duration_min,
                    'price_cents' => $service->price_cents,
                    'price' => $service->price_cents / 100,
                    'description' => $service->description,
                    'image_url' => $service->image_url,
                    'is_active' => $service->is_active,
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create service: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a service
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string|max:255',
            'duration_min' => 'sometimes|required|integer|min:1',
            'price_cents' => 'nullable|integer|min:0',
            'price' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'image_url' => 'nullable|url',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $service = ServiceType::findOrFail($id);

            $priceCents = $request->price_cents;
            if ($priceCents === null && $request->has('price')) {
                $priceCents = (int) round($request->price * 100);
            }

            $service->update(array_filter([
                'name' => $request->name,
                'category' => $request->category,
                'duration_min' => $request->duration_min,
                'price_cents' => $priceCents,
                'description' => $request->description,
                'image_url' => $request->image_url,
                'is_active' => $request->has('is_active') ? $request->boolean('is_active') : null,
            ], function ($value) {
                return !is_null($value);
            }));

            return response()->json([
                'success' => true,
                'message' => 'Service updated successfully',
                'data' => [
                    'id' => $service->id,
                    'name' => $service->name,
                    'category' => $service->category,
                    'duration_min' => $service->duration_min,
                    'price_cents' => $service->price_cents,
                    'price' => $service->price_cents / 100,
                    'description' => $service->description,
                    'image_url' => $service->image_url,
                    'is_active' => $service->is_active,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update service: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a service
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $service = ServiceType::findOrFail($id);
            $service->delete();

            return response()->json([
                'success' => true,
                'message' => 'Service deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete service: ' . $e->getMessage()
            ], 500);
        }
    }
}
