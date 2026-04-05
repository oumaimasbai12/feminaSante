<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AppNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = AppNotification::where('user_id', $request->user()->id)
            ->latest('created_at');

        if ($request->has('read')) {
            if ($request->boolean('read')) {
                $query->whereNotNull('read_at');
            } else {
                $query->whereNull('read_at');
            }
        }

        return response()->json($query->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'type' => ['required', 'string', 'max:100'],
            'title' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string'],
            'data' => ['nullable', 'array'],
            'read_at' => ['nullable', 'date'],
        ]);

        $notification = AppNotification::create([
            ...$data,
            'user_id' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Notification created successfully.',
            'notification' => $notification,
        ], 201);
    }

    public function show(Request $request, AppNotification $notification): JsonResponse
    {
        if ($notification->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json($notification);
    }

    public function update(Request $request, AppNotification $notification): JsonResponse
    {
        if ($notification->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $data = $request->validate([
            'type' => ['sometimes', 'string', 'max:100'],
            'title' => ['sometimes', 'string', 'max:255'],
            'message' => ['sometimes', 'string'],
            'data' => ['sometimes', 'nullable', 'array'],
            'read_at' => ['sometimes', 'nullable', 'date'],
            'mark_as_read' => ['sometimes', 'boolean'],
        ]);

        if (($data['mark_as_read'] ?? false) === true && ! array_key_exists('read_at', $data)) {
            $data['read_at'] = now();
        }

        unset($data['mark_as_read']);

        $notification->update($data);

        return response()->json([
            'message' => 'Notification updated successfully.',
            'notification' => $notification->fresh(),
        ]);
    }

    public function destroy(Request $request, AppNotification $notification): JsonResponse
    {
        if ($notification->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $notification->delete();

        return response()->json([
            'message' => 'Notification deleted successfully.',
        ]);
    }
}
