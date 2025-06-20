<?php

namespace Database\Seeders;

use App\Models\Task;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Task::create([
            'title' => 'Implementasi Sistem Login',
                'description' => 'Membuat sistem autentikasi dan otorisasi untuk aplikasi web dengan fitur login, logout, dan middleware authentication.',
                'image' => 'images/tasks/login-system.jpg',
                'deadline' => '2025-06-07 10:27:00',
                'category_id' => 1,
                'user_id' => 1,
                'status_id' => 1,
                'priority_id' => 1,
        ]);
    }
}
