<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        User::create([
            'username' => 'admin',
            'email' => 'admin@gmail.com',
            'password' => 'admin123',
            'image' => 'admin.jpg',
            'role' => 'admin'
        ]);

        User::create([
            'username' => 'alka',
            'email' => 'alka@gmail.com',
            'password' => 'alka123',
            'image' => 'alka.jpg',
            'role' => 'user'
        ]);

         User::create([
            'username' => 'bagas',
            'email' => 'bagas@gmail.com',
            'password' => 'bagas123',
            'image' => 'bagas.jpg',
            'role' => 'user'
        ]);

         User::create([
            'username' => 'alvian',
            'email' => 'alvian@gmail.com',
            'password' => 'alvian123',
            'image' => 'alvian.jpg',
            'role' => 'user'
        ]);


    }
}
