<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeed extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Category::create([
            'name' => 'Daily'
        ]);

        Category::create([
            'name' => 'Weekly'
        ]);

        Category::create([
            'name' => 'Monthly'
        ]);
    }
}
