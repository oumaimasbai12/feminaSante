<?php

namespace Tests\Unit;

use App\Models\Cycle;
use App\Services\CycleService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CycleServiceTest extends TestCase
{
    use RefreshDatabase;

    protected CycleService $cycleService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->cycleService = app(CycleService::class);
    }

    public function test_calculate_average_cycle_length_with_two_cycles(): void
    {
        $cycles = collect([
            Cycle::factory()->make(['start_date' => '2026-01-01']),
            Cycle::factory()->make(['start_date' => '2026-01-29']),
        ]);

        $average = $this->cycleService->calculateAverageCycleLength($cycles);
        $this->assertEquals(28, $average);
    }

    public function test_calculate_average_cycle_length_with_outlier(): void
    {
        $cycles = collect([
            Cycle::factory()->make(['start_date' => '2026-01-01']),
            Cycle::factory()->make(['start_date' => '2026-01-29']), // 28 days
            Cycle::factory()->make(['start_date' => '2026-02-26']), // 28 days
            Cycle::factory()->make(['start_date' => '2026-04-26']), // 60 days (outlier, should be excluded)
            Cycle::factory()->make(['start_date' => '2026-05-24']), // 28 days
        ]);

        $average = $this->cycleService->calculateAverageCycleLength($cycles);
        $this->assertEquals(28, $average);
    }

    public function test_calculate_next_period(): void
    {
        $lastCycle = Cycle::factory()->make(['start_date' => '2026-01-01']);
        $nextPeriod = $this->cycleService->calculateNextPeriod($lastCycle, 28);
        
        $this->assertEquals('2026-01-29', $nextPeriod->toDateString());
    }

    public function test_calculate_ovulation_date(): void
    {
        $nextPeriod = Carbon::parse('2026-01-29');
        $ovulation = $this->cycleService->calculateOvulationDate($nextPeriod);
        
        $this->assertEquals('2026-01-15', $ovulation->toDateString());
    }

    public function test_calculate_fertile_window(): void
    {
        $ovulation = Carbon::parse('2026-01-15');
        $fertileWindow = $this->cycleService->calculateFertileWindow($ovulation);
        
        $this->assertEquals('2026-01-10', $fertileWindow['start']->toDateString());
        $this->assertEquals('2026-01-16', $fertileWindow['end']->toDateString());
    }

    public function test_get_current_cycle_day(): void
    {
        Carbon::setTestNow('2026-01-15');
        $lastCycle = Cycle::factory()->make(['start_date' => '2026-01-01']);
        
        $currentDay = $this->cycleService->getCurrentCycleDay($lastCycle, 28);
        $this->assertEquals(15, $currentDay);
    }

    public function test_get_current_cycle_day_after_cycle_end(): void
    {
        Carbon::setTestNow('2026-02-01');
        $lastCycle = Cycle::factory()->make(['start_date' => '2026-01-01']);
        
        $currentDay = $this->cycleService->getCurrentCycleDay($lastCycle, 28);
        $this->assertEquals(4, $currentDay); // 28 days later, wraps around to day 4
    }

    public function test_get_cycle_phase_menstruation(): void
    {
        $phase = $this->cycleService->getCyclePhase(3);
        $this->assertEquals('menstruation', $phase);
    }

    public function test_get_cycle_phase_follicular(): void
    {
        $phase = $this->cycleService->getCyclePhase(8);
        $this->assertEquals('follicular', $phase);
    }

    public function test_get_cycle_phase_ovulation(): void
    {
        $phase = $this->cycleService->getCyclePhase(14);
        $this->assertEquals('ovulation', $phase);
    }

    public function test_get_cycle_phase_luteal(): void
    {
        $phase = $this->cycleService->getCyclePhase(20);
        $this->assertEquals('luteal', $phase);
    }

    public function test_get_predictions(): void
    {
        Carbon::setTestNow('2026-03-01');

        $cycles = collect([
            Cycle::factory()->make(['start_date' => '2026-01-01', 'end_date' => '2026-01-06']),
            Cycle::factory()->make(['start_date' => '2026-01-29', 'end_date' => '2026-02-03']),
            Cycle::factory()->make(['start_date' => '2026-02-26', 'end_date' => '2026-03-03']),
        ]);

        $predictions = $this->cycleService->getPredictions($cycles);

        $this->assertCount(36, $predictions);

        $periodPrediction = collect($predictions)->firstWhere('type', 'period');
        $this->assertEquals('2026-03-26', $periodPrediction['predicted_date']);
        $this->assertEquals('2026-03-31', $periodPrediction['end_date']);

        $ovulationPrediction = collect($predictions)->firstWhere('type', 'ovulation');
        $this->assertEquals('2026-03-12', $ovulationPrediction['predicted_date']);

        Carbon::setTestNow();
    }
}
