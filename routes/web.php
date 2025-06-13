<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WebhookController;
use App\Http\Controllers\HomeController;

// Square webhook
Route::post('/webhooks/square', [WebhookController::class, 'handleSquareWebhook']);

// Main application route for SPA
Route::get('/', [HomeController::class, 'index'])->name('home');

// SPA fallback for all other routes
Route::get('/{any}', [HomeController::class, 'index'])->where('any', '.*');