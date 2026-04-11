<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Cycle;
use App\Models\Pregnancy\Pregnancy;
use App\Models\Menopause\Menopause;

// ─────────────────────────────────────────────
// PUBLIC
// ─────────────────────────────────────────────
Route::get("/", fn() => Inertia::render("Welcome"))->name("home");
Route::get("/login", fn() => Inertia::render("Auth/Login"))->name("login");
Route::get("/register", fn() => Inertia::render("Auth/Register"))->name("register");

// ─────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────
Route::get("/dashboard", fn() => Inertia::render("Dashboard/Index"))->name("dashboard");
Route::get("/cycles", fn() => Inertia::render("Cycles/Index"))->name("cycles");
Route::get("/articles", fn() => Inertia::render("Articles/Index"))->name("articles");
Route::get("/articles/{id}", fn($id) => Inertia::render("Articles/Show", ["id" => $id]))->name("articles.show");
Route::get("/chat", fn() => Inertia::render("Chat/Index"))->name("chat");
Route::get("/gynecologists", fn() => Inertia::render("Gynecologists/Index"))->name("gynecologists");
Route::get("/pregnancies", fn() => Inertia::render("Pregnancies/Index"))->name("pregnancies");
Route::get("/quizzes", fn() => Inertia::render("Quizzes/Index"))->name("quizzes");
Route::get("/appointments", fn() => Inertia::render("Appointments/Index"))->name("appointments");
Route::get("/profile", fn() => Inertia::render("Profile/Index"))->name("profile");

// ─────────────────────────────────────────────
// ADMIN — protected: must be logged in + is_admin
// ─────────────────────────────────────────────
Route::prefix("admin")->middleware(["auth:sanctum", "admin"])->group(function () {
    Route::get("/dashboard", function () {
        return Inertia::render("Admin/Dashboard", [
            "stats" => [
                "total_users" => User::count(),
                "total_cycles_logged" => Cycle::count(),
                "total_pregnancies" => Pregnancy::count(),
                "total_menopauses" => Menopause::count(),
            ],
        ]);
    })->name("admin.dashboard");

    Route::get("/users", function () {
        return Inertia::render("Admin/Users/Index", [
            "users" => User::select("id", "nom", "email", "is_admin", "created_at")
                ->latest()
                ->paginate(15),
        ]);
    })->name("admin.users");

    Route::get("/users/{id}", function ($id) {
        return Inertia::render("Admin/Users/Show", [
            "userData" => User::with(["pregnancies", "menopauses"])->findOrFail($id),
        ]);
    })->name("admin.users.show");
});