<?php

namespace App\Http\Controllers;

use App\Models\PriorityLevel;
use App\Models\TaskStatus;
use Illuminate\Http\Request;

class TaskStatusController extends Controller
{
    public function index() {
        
        $status = TaskStatus::all();

        if ($status->isEmpty()) {
            return response()->json([
                "success" => true,
                "massage" => "Resource data not found!",
                "data" => null
            ], 200);
        }

        return response()->json([
            "success" => true,
            "massage" => "Get All Resource",
            "data" => $status
        ], 200);
    }
}

