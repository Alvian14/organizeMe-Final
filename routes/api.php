<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PriorityLevelController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TaskStatusController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('users', AuthController::class);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::put('/update-role/{id}', [AuthController::class, 'updateRole']);
Route::post('/update-role/{id}', [AuthController::class, 'updateRole']);
Route::post('/users/{id}/update-password', [AuthController::class, 'updatePassword']);


Route::post('/tasks', [TaskController::class, 'store']);

Route::get('/users/{id}/tasks', [TaskController::class, 'getTasksByUserId']);
Route::get('/users/{id}/myTasks', [TaskController::class, 'getTasksByUserIdFull']);
Route::post('/tasks/{id}/update', [TaskController::class, 'update']);
Route::delete('/tasks/{id}/delete', [TaskController::class, 'destroy']);
Route::post('/tasks/insert', [TaskController::class, 'store']);


//api priority
Route::apiResource('/priority', PriorityLevelController::class);

//api statuses
Route::apiResource('/statuses', TaskStatusController::class);

//api task
Route::apiResource('/tasks', TaskController::class);


