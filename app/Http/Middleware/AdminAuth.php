<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminAuth
{
    public function handle(Request $request, Closure $next)
    {
        $claims = $request->get('firebase_claims', []);
        
        if (!isset($claims['admin']) || $claims['admin'] !== true) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return $next($request);
    }
}