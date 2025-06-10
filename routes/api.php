<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ServiceTypeController;
use App\Http\Controllers\Api\AvailabilityController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Admin\DashboardController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
// Public routes
Route::post('/auth/verify-token', [AuthController::class, 'verifyToken']);
Route::get('/services', [ServiceTypeController::class, 'index']);
Route::get('/services/{id}', [ServiceTypeController::class, 'show']);
Route::post('/availability/slots', [AvailabilityController::class, 'getAvailableSlots']);
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Protected routes
Route::middleware(['auth.firebase'])->group(function () {
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::get('/appointments/{id}', [AppointmentController::class, 'show']);
    Route::post('/appointments/{id}/cancel', [AppointmentController::class, 'cancel']);
});

// Admin routes
Route::middleware(['auth.firebase', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::post('/availability', [DashboardController::class, 'updateAvailability']);
});