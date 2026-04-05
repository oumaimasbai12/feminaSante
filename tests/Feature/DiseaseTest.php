<?php

namespace Tests\Feature;

use App\Models\Diseases\Disease;
use App\Models\Diseases\DiseaseCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DiseaseTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_list_disease_catalog(): void
    {
        Disease::factory()->count(2)->create(['is_active' => true]);
        Disease::factory()->count(3)->create(['is_active' => false]);

        $response = $this->getJson('/api/v1/diseases/catalog');

        $response->assertOk();
        $response->assertJsonPath('message', 'Disease catalog retrieved successfully.');
        $response->assertJsonCount(2, 'data.data');
    }

    public function test_authenticated_user_can_list_disease_catalog(): void
    {
        $user = User::factory()->create();
        Disease::factory()->count(2)->create(['is_active' => true]);

        $response = $this->actingAs($user)->getJson('/api/v1/diseases/catalog');

        $response->assertOk();
        $response->assertJsonCount(2, 'data.data');
    }

    public function test_catalog_show_returns_disease_with_relations(): void
    {
        $category = DiseaseCategory::factory()->create(['nom' => 'Infections', 'slug' => 'infections']);

        $disease = Disease::factory()->create([
            'nom' => 'Infection urinaire',
            'slug' => 'infection-urinaire',
            'category_id' => $category->id,
            'is_active' => true,
        ]);

        $disease->symptoms()->createMany([
            ['symptom_nom' => 'Brulure', 'is_common' => true],
            ['symptom_nom' => 'Douleur', 'is_common' => false],
        ]);
        $disease->treatments()->create(['treatment_type' => 'medication', 'description' => 'Antibiotiques']);
        $disease->faqs()->create(['question' => 'Est-ce grave ?', 'answer' => 'Cela depend.', 'display_order' => 1]);
        $disease->resourceItems()->create(['resource_type' => 'website', 'title' => 'OMS']);

        $response = $this->getJson("/api/v1/diseases/catalog/{$disease->slug}");

        $response->assertOk();
        $response->assertJsonPath('data.slug', 'infection-urinaire');
        $response->assertJsonPath('data.category.slug', 'infections');
        $response->assertJsonCount(2, 'data.symptoms');
        $response->assertJsonCount(1, 'data.treatments');
        $response->assertJsonCount(1, 'data.faqs');
        $response->assertJsonCount(1, 'data.resource_items');
    }

    public function test_catalog_show_inactive_disease_returns_404(): void
    {
        $disease = Disease::factory()->create(['is_active' => false]);

        $this->getJson("/api/v1/diseases/catalog/{$disease->slug}")
            ->assertNotFound();
    }

    public function test_symptom_checker_returns_matching_diseases(): void
    {
        $disease = Disease::factory()->create(['is_active' => true]);
        $disease->symptoms()->create(['symptom_nom' => 'Douleur pelvienne', 'is_common' => true]);

        $response = $this->postJson('/api/v1/diseases/symptom-checker', [
            'symptoms' => ['Douleur pelvienne'],
        ]);

        $response->assertOk();
        $response->assertJsonPath('data.0.slug', $disease->slug);
    }

    public function test_symptom_checker_validates_input(): void
    {
        $this->postJson('/api/v1/diseases/symptom-checker', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('symptoms');
    }

    public function test_categories_index_returns_all_categories(): void
    {
        DiseaseCategory::factory()->count(3)->create();

        $response = $this->getJson('/api/v1/diseases/categories');

        $response->assertOk();
        $response->assertJsonCount(3, 'data');
    }

    public function test_categories_show_returns_category_with_diseases(): void
    {
        $category = DiseaseCategory::factory()->create(['slug' => 'gyneco']);
        Disease::factory()->count(2)->create(['category_id' => $category->id, 'is_active' => true]);
        Disease::factory()->create(['category_id' => $category->id, 'is_active' => false]);

        $response = $this->getJson('/api/v1/diseases/categories/gyneco');

        $response->assertOk();
        $response->assertJsonPath('data.slug', 'gyneco');
        $response->assertJsonCount(2, 'data.diseases');
    }
}
