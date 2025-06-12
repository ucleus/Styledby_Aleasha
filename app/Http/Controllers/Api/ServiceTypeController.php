<?php

namespace App\Http\Controllers\Api;

use App\Models\ServiceType;
use Illuminate\Http\JsonResponse;

class ServiceTypeController extends BaseController
{
    public function index(): JsonResponse
    {
        $services = ServiceType::where('is_active', true)->get();
        return $this->sendResponse($services);
    }

    public function show($id): JsonResponse
    {
        $service = ServiceType::find($id);
        
        if (!$service) {
            return $this->sendError('Service not found');
        }

        return $this->sendResponse($service);
    }
}
