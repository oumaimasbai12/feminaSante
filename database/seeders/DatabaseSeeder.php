<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            ArticleCategorySeeder::class,
            DiseaseCategorySeeder::class,
            StaticQuizSeeder::class,
            GynecologistSeeder::class,
            WikipediaArticleSeeder::class,
            GeminiContentSeeder::class,
        ]);
    }
}