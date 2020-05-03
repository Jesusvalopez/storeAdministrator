<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class PriceTypeTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testGetPriceTypes()
    {
        $response = $this->json('GET', '/api/price-type');

        $response->assertStatus(200)
        ->assertJsonStructure(['id', 'name','deleted_at','created_at','updated_at']);
    }
}
