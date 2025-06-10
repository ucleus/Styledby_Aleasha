<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Kreait\Laravel\Firebase\Facades\Firebase;

class FirebaseAuth
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        try {
            $auth = Firebase::auth();
            $verifiedIdToken = $auth->verifyIdToken($token);
            $request->merge(['firebase_uid' => $verifiedIdToken->claims()->get('sub')]);
            $request->merge(['firebase_claims' => $verifiedIdToken->claims()->all()]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid token'], 401);
        }

        return $next($request);
    }
}