<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any}', function () {
    return view('welcome'); // Di sini akan dimuat React app dari welcome.blade.php
})->where('any', '.*');
