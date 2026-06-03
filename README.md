# FeminaSante

Women's health web platform — cycle tracking, pregnancy, menopause, gynecologist appointments, articles, quizzes, and a conversational assistant.

**Repository:** [github.com/oumaimasbai12/feminaSante](https://github.com/oumaimasbai12/feminaSante)

## Stack

| Layer | Technologies |
|-------|--------------|
| Backend | PHP 8.2+, Laravel 11, Sanctum |
| Frontend | React 19, Inertia.js, Vite, Tailwind CSS |
| Database | MySQL |
| PDF | DomPDF |
| AI (optional) | Google Gemini (`GEMINI_API_KEY`) |

## Features

### Patient
- Dashboard and personalized health journey
- Menstrual cycle tracking and predictions
- Pregnancy, menopause, conditions, and health library
- Appointment booking and consultation messaging
- Articles, quizzes, profile, and data export

### Gynecologist (Practitioner portal)
- Dashboard and appointment management
- Availability and time slots
- Patient list and clinical records

### Administrator
- User, gynecologist, and article management
- Appointments overview

## Requirements

- PHP 8.2+
- Composer
- Node.js 18+ and npm
- MySQL 8+ (or MariaDB)

## Installation

```bash
# Clone the repository
git clone https://github.com/oumaimasbai12/feminaSante.git
cd feminaSante

# PHP dependencies
composer install

# Environment
cp .env.example .env
php artisan key:generate
```

### MySQL database

Create the database, then configure `.env`:

```sql
CREATE DATABASE feminasante CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=feminasante
DB_USERNAME=root
DB_PASSWORD=
```

Then migrate and seed:

```bash
php artisan migrate --seed
```

### Frontend

```bash
npm install
npm run build
```

## Development

One command starts the Laravel server, queue worker, logs, and Vite:

```bash
composer dev
```

Open [http://localhost:8000](http://localhost:8000).

> `composer dev` runs in parallel: `php artisan serve`, `php artisan queue:listen`, `php artisan pail`, and `npm run dev`.

## Test accounts

Available after `php artisan migrate --seed`. Full list: [TEST_CREDENTIALS.md](TEST_CREDENTIALS.md).

### Administrator

| Email | Password |
|-------|----------|
| `admin@feminasante.ma` | `Admin123!` |

### Patient

| Email | Password | Profile |
|-------|----------|---------|
| `demo@feminasante.ma` | `Demo123!` | Fatima (demo) |

### Gynecologists

Password for all practitioner accounts: **`Gynecologue123!`**

| Practitioner | Email | Specialty | City |
|--------------|-------|-------------|------|
| Dr. Fatima Benali | `dr.fatima.benali@feminasante.ma` | Obstetrics & Gynecology | Casablanca |
| Dr. Nadia El Idrissi | `dr.nadia.el.idrissi@feminasante.ma` | Medical Gynecology | Rabat |
| Dr. Samira Tazi | `dr.samira.tazi@feminasante.ma` | Obstetrics | Fès |
| Dr. Houda Mansouri | `dr.houda.mansouri@feminasante.ma` | Obstetrics & Gynecology | Marrakech |
| Dr. Leila Chraibi | `dr.leila.chraibi@feminasante.ma` | Fertility & Reproductive Medicine | Casablanca |
| Dr. Zineb Ouhssine | `dr.zineb.ouhssine@feminasante.ma` | Obstetrics & Gynecology | Tanger |
| Dr. Amina Karimi | `dr.amina.karimi@feminasante.ma` | Gynecologic Oncology | Casablanca |
| Dr. Meriem Bousfiha | `dr.meriem.bousfiha@feminasante.ma` | Obstetrics & Gynecology | Meknès |
| Dr. Khadija Alaoui | `dr.khadija.alaoui@feminasante.ma` | Medical Gynecology | Rabat |
| Dr. Soukaina Rharbaoui | `dr.soukaina.rharbaoui@feminasante.ma` | Obstetrics & Gynecology | Agadir |
| Dr. Sophie Martin | `dr.sophie.martin@feminasante.ma` | General Gynecology | Casablanca |
| Dr. Amina Belkaid | `dr.amina.belkaid@feminasante.ma` | Obstetrics & Gynecology | Casablanca |

**Login destinations**

| Role | URL after login |
|------|-----------------|
| Patient | `/dashboard` |
| Admin | `/admin/dashboard` |
| Gynecologist | `/gynecologist/dashboard` |

## Environment variables

Copy `.env.example` to `.env`. Defaults target a local MySQL database named `feminasante`.

```env
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_DATABASE=feminasante
DB_USERNAME=root
DB_PASSWORD=

# Optional — AI content (articles, assistant)
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.1-flash-lite-preview
```

## Project structure

```
app/                    # Laravel controllers, models, middleware
database/               # Migrations and seeders
resources/
  js/
    Pages/              # Inertia pages (Patient, Admin, Gynecologist)
    Components/         # Shared UI (AppShell, GlassCard, FilterPills…)
    hooks/              # React hooks (useApiQuery, useDeferredLoading)
  css/app.css           # Design system and transitions
routes/
  web.php               # Inertia routes
  api.php               # REST API (Sanctum)
```

## Useful commands

```bash
# Development (server + queue + logs + Vite)
composer dev

# Production frontend build
npm run build

# Reset database with demo data
php artisan migrate:fresh --seed

# PHP tests
php artisan test

# PHP formatting (Laravel Pint)
./vendor/bin/pint
```

## Authentication

The app uses **Laravel Sanctum** with a Bearer token stored on the client. Inertia web routes are public; data protection is enforced via the API (`/api/v1/...`) and the `auth:sanctum`, `admin`, and `gynecologist` middleware.

## License

MIT
