<?php

namespace Tests\Feature;

use App\Models\Articles\Article;
use App\Models\Articles\ArticleCategory;
use App\Models\Articles\ArticleComment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ArticleTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private string $token;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->token = $this->user->createToken('test')->plainTextToken;
    }

    // ──────────────────────────────────────────────────────────────
    // ARTICLE CATEGORIES
    // ──────────────────────────────────────────────────────────────

    public function test_user_can_list_article_categories(): void
    {
        ArticleCategory::factory()->count(3)->create();

        $response = $this->withToken($this->token)
            ->getJson('/api/v1/article-categories');

        $response->assertOk();
        $response->assertJsonCount(3);
    }

    public function test_user_can_create_article_category(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/v1/article-categories', [
                'nom' => 'Santé féminine',
                'description' => 'Articles sur la santé féminine',
                'icon' => '💊',
                'color' => '#FF5733',
                'display_order' => 1,
            ]);

        $response->assertCreated();
        $response->assertJsonFragment(['message' => 'Category created successfully.']);
        $response->assertJsonPath('category.slug', 'sante-feminine');
    }

    public function test_create_category_fails_without_name(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/v1/article-categories', []);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('nom');
    }

    // ──────────────────────────────────────────────────────────────
    // ARTICLES
    // ──────────────────────────────────────────────────────────────

    public function test_user_can_list_articles(): void
    {
        Article::factory()->count(3)->create(['author_id' => $this->user->id]);

        $response = $this->withToken($this->token)
            ->getJson('/api/v1/articles');

        $response->assertOk();
        $response->assertJsonCount(3);
    }

    public function test_user_can_create_article(): void
    {
        $category = ArticleCategory::factory()->create();

        $response = $this->withToken($this->token)
            ->postJson('/api/v1/articles', [
                'title' => 'Le cycle menstruel expliqué',
                'content' => 'Contenu détaillé de l\'article...',
                'category_id' => $category->id,
                'excerpt' => 'Résumé de l\'article',
                'tags' => ['santé', 'cycle'],
                'status' => 'published',
                'read_time' => 5,
            ]);

        $response->assertCreated();
        $response->assertJsonFragment(['message' => 'Article created successfully.']);
        $response->assertJsonPath('article.is_featured', false);
        $response->assertJsonPath('article.is_premium', false);
    }

    public function test_create_article_defaults(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/v1/articles', [
                'title' => 'Article test',
                'content' => 'Contenu test',
            ]);

        $response->assertCreated();
        $response->assertJsonPath('article.status', 'draft');
        $response->assertJsonPath('article.views_count', 0);
        $response->assertJsonPath('article.likes_count', 0);
    }

    public function test_create_article_fails_without_required_fields(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/v1/articles', []);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['title', 'content']);
    }

    public function test_create_article_fails_with_invalid_status(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/v1/articles', [
                'title' => 'Article test',
                'content' => 'Contenu',
                'status' => 'invalid',
            ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('status');
    }

    public function test_user_can_show_article(): void
    {
        $article = Article::factory()->create(['author_id' => $this->user->id]);
        $initialViews = $article->views_count;

        $response = $this->withToken($this->token)
            ->getJson("/api/v1/articles/{$article->id}");

        $response->assertOk();
        $response->assertJsonPath('id', $article->id);

        // Views count should increment
        $this->assertEquals($initialViews + 1, $article->fresh()->views_count);
    }

    // ──────────────────────────────────────────────────────────────
    // ARTICLE COMMENTS
    // ──────────────────────────────────────────────────────────────

    public function test_user_can_create_comment(): void
    {
        $article = Article::factory()->create(['author_id' => $this->user->id]);

        $response = $this->withToken($this->token)
            ->postJson("/api/v1/articles/{$article->id}/comments", [
                'content' => 'Super article, merci !',
            ]);

        $response->assertCreated();
        $response->assertJsonFragment(['message' => 'Comment created successfully.']);

        $this->assertDatabaseHas('article_comments', [
            'article_id' => $article->id,
            'user_id' => $this->user->id,
            'content' => 'Super article, merci !',
        ]);
    }

    public function test_user_can_reply_to_comment(): void
    {
        $article = Article::factory()->create(['author_id' => $this->user->id]);
        $parentComment = ArticleComment::factory()->create([
            'article_id' => $article->id,
            'user_id' => $this->user->id,
        ]);

        $response = $this->withToken($this->token)
            ->postJson("/api/v1/articles/{$article->id}/comments", [
                'content' => 'Merci pour la réponse !',
                'parent_id' => $parentComment->id,
            ]);

        $response->assertCreated();
        $this->assertDatabaseHas('article_comments', [
            'parent_id' => $parentComment->id,
        ]);
    }

    public function test_create_comment_fails_without_content(): void
    {
        $article = Article::factory()->create(['author_id' => $this->user->id]);

        $response = $this->withToken($this->token)
            ->postJson("/api/v1/articles/{$article->id}/comments", []);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('content');
    }

    // ──────────────────────────────────────────────────────────────
    // RELATIONSHIPS
    // ──────────────────────────────────────────────────────────────

    public function test_article_belongs_to_category(): void
    {
        $category = ArticleCategory::factory()->create();
        $article = Article::factory()->create(['category_id' => $category->id]);

        $this->assertEquals($category->id, $article->category->id);
    }

    public function test_article_belongs_to_author(): void
    {
        $article = Article::factory()->create(['author_id' => $this->user->id]);
        $this->assertInstanceOf(User::class, $article->author);
    }

    public function test_article_has_many_comments(): void
    {
        $article = Article::factory()->create(['author_id' => $this->user->id]);
        ArticleComment::factory()->count(3)->create([
            'article_id' => $article->id,
            'user_id' => $this->user->id,
        ]);

        $this->assertCount(3, $article->comments);
    }

    public function test_category_has_many_articles(): void
    {
        $category = ArticleCategory::factory()->create();
        Article::factory()->count(2)->create(['category_id' => $category->id]);

        $this->assertCount(2, $category->articles);
    }

    public function test_comment_has_replies(): void
    {
        $article = Article::factory()->create(['author_id' => $this->user->id]);
        $parent = ArticleComment::factory()->create([
            'article_id' => $article->id,
            'user_id' => $this->user->id,
        ]);
        ArticleComment::factory()->count(2)->create([
            'article_id' => $article->id,
            'user_id' => $this->user->id,
            'parent_id' => $parent->id,
        ]);

        $this->assertCount(2, $parent->replies);
    }

    public function test_unauthenticated_user_cannot_access_articles(): void
    {
        $response = $this->getJson('/api/v1/articles');
        $response->assertUnauthorized();
    }
}
