<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WebhookController;

// Square webhook
Route::post('/webhooks/square', [WebhookController::class, 'handleSquareWebhook']);

// SPA fallback
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');