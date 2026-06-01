<?php


use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Cycle;
use App\Models\Pregnancy\Pregnancy;
use App\Models\Menopause\Menopause;
use App\Http\Controllers\Gynecologist\DashboardController;

// ─────────────────────────────────────────────
// PUBLIC
// ─────────────────────────────────────────────
Route::get("/", fn() => Inertia::render("Welcome"))->name("home");
Route::get("/login", fn() => Inertia::render("Auth/Login"))->name("login");
Route::get("/register", fn() => Inertia::render("Auth/Register"))->name("register");
Route::get("/privacy", fn() => Inertia::render("Legal/Privacy"))->name("privacy");
Route::get("/terms", fn() => Inertia::render("Legal/Terms"))->name("terms");
Route::get("/contact", fn() => Inertia::render("Legal/Contact"))->name("contact");

// ─────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────
Route::get("/dashboard", fn() => Inertia::render("Dashboard/Index"))->name("dashboard");
Route::get("/cycles", fn() => Inertia::render("Cycles/Index"))->name("cycles");
Route::get("/articles", fn() => Inertia::render("Articles/Index"))->name("articles");
Route::get("/articles/{id}", fn($id) => Inertia::render("Articles/Show", ["id" => $id]))->name("articles.show");
Route::get("/chat", fn() => Inertia::render("Chat/Index"))->name("chat");
Route::get("/gynecologists", fn() => Inertia::render("Gynecologists/Index"))->name("gynecologists");
Route::get("/gynecologists/{id}", fn() => Inertia::render("Gynecologists/Show"))->name("gynecologists.show");
Route::get("/pregnancies", fn() => Inertia::render("Pregnancies/Index"))->name("pregnancies");
Route::get("/quizzes", fn() => Inertia::render("Quizzes/Index"))->name("quizzes");
Route::get("/appointments", fn() => Inertia::render("Appointments/Index"))->name("appointments");
Route::get("/profile", fn() => Inertia::render("Profile/Index"))->name("profile");
Route::get("/menopause", fn() => Inertia::render("Menopause/Index"))->name("menopause");
Route::get("/forgot-password", fn() => Inertia::render("Auth/ForgotPassword"))->name("forgot-password");
Route::get("/reset-password", fn() => Inertia::render("Auth/ResetPassword"))->name("reset-password");

// ─────────────────────────────────────────────
// ADMIN — auth gérée côté React + API (intentionnel, même pattern existant)
// ─────────────────────────────────────────────
Route::prefix("admin")->group(function () {

    Route::get("/dashboard", function () {
        return Inertia::render("Admin/Dashboard", [
            "stats" => [
                "total_users"         => User::count(),
                "total_cycles_logged" => Cycle::count(),
                "total_pregnancies"   => Pregnancy::count(),
                "total_menopauses"    => Menopause::count(),
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

    Route::get('/gynecologists', fn() => Inertia::render('Admin/Gynecologists/Index'))->name('admin.gynecologists');
    Route::get('/gynecologists/create', fn() => Inertia::render('Admin/Gynecologists/Form'))->name('admin.gynecologists.create');
    Route::get('/gynecologists/{id}/edit', fn() => Inertia::render('Admin/Gynecologists/Form'))->name('admin.gynecologists.edit');

    Route::get('/articles', fn() => Inertia::render('Admin/Articles/Index'))->name('admin.articles');
    Route::get('/articles/create', fn() => Inertia::render('Admin/Articles/Form'))->name('admin.articles.create');
    Route::get('/articles/{id}/edit', fn($id) => Inertia::render('Admin/Articles/Form', ['articleId' => $id]))->name('admin.articles.edit');
});

// ─────────────────────────────────────────────
// GYNECOLOGIST
// Pas de middleware 'auth' web — votre projet utilise Bearer token
// (même pattern que les routes /admin ci-dessus).
// La protection réelle est assurée par :
//   1. Le DashboardController qui appelle $request->user() via Sanctum
//   2. Le middleware 'gynecologist' sur les routes API PUT
// ─────────────────────────────────────────────
Route::prefix('gynecologist')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('gynecologist.dashboard');
    Route::get('/appointments', [DashboardController::class, 'index'])->name('gynecologist.appointments');
    Route::redirect('/', '/gynecologist/dashboard');
});
