<?php

namespace Database\Seeders;

use App\Models\TaskStatus;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TaskStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TaskStatus::create([
            'name' => 'Not Started'
        ]);

        TaskStatus::create([
            'name' => 'In Progress'
        ]);

        TaskStatus::create([
            'name' => 'Completed'
        ]);
    }
}
