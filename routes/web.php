<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get("/", fn() => Inertia::render("Welcome"))->name("home");
Route::get("/login", fn() => Inertia::render("Auth/Login"))->name("login");
Route::get("/register", fn() => Inertia::render("Auth/Register"))->name("register");
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
