<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LogSensitiveData
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $sensitiveFields = ['motDePasse', 'password', 'password_confirmation', 'token'];
        $requestData = $request->except($sensitiveFields);

        Log::info('Sensitive Data Access', [
            'user_id' => $request->user() ? $request->user()->id : null,
            'ip' => $request->ip(),
            'url' => $request->fullUrl(),
            'method' => $request->method(),
            'payload' => $requestData,
        ]);

        return $response;
    }
}
