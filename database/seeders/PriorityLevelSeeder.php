<?php

namespace Database\Seeders;

use App\Models\PriorityLevel;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PriorityLevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PriorityLevel::create([
            'name' => 'Low'
        ]);

        PriorityLevel::create([
            'name' => 'Medium'
        ]);

        PriorityLevel::create([
            'name' => 'Hight'
        ]);
    }
}
