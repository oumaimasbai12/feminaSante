<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('article_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('article_id')->constrained('articles')->cascadeOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('article_comments')->cascadeOnDelete();
            $table->text('content');
            $table->boolean('is_approved')->default(false);
            $table->integer('likes_count')->default(0);
            $table->timestamp('created_at')->useCurrent();

            $table->index('article_id', 'article_comments_idx_article_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('article_comments');
    }
};
