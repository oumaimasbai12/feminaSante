<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // decimal(4,2) caps at 99.99 — too small for realistic body weight (20–250 kg).
        if (Schema::getConnection()->getDriverName() !== 'mysql') {
            return;
        }

        DB::statement('ALTER TABLE weight_gains MODIFY weight DECIMAL(5, 2) NOT NULL');
    }

    public function down(): void
    {
        if (Schema::getConnection()->getDriverName() !== 'mysql') {
            return;
        }

        DB::statement('ALTER TABLE weight_gains MODIFY weight DECIMAL(4, 2) NOT NULL');
    }
};
