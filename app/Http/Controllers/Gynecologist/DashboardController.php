<?php

namespace App\Http\Controllers\Gynecologist;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Rend simplement la page Inertia.
     * Les données (appointments, stats) sont chargées côté React
     * via axios avec le Bearer token stocké dans localStorage.
     * C'est le même pattern que vos autres pages (Dashboard, Admin, etc.)
     */
    public function index(Request $request)
    {
        return Inertia::render('Gynecologist/Dashboard');
    }
}
