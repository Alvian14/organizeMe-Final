<?php

namespace App\Http\Controllers;

use App\Models\PriorityLevel;
use Illuminate\Http\Request;

class PriorityLevelController extends Controller
{
    public function index() {
        $priority = PriorityLevel::all();

        if ($priority->isEmpty()) {
            return response()->json([
                "success" => true,
                "massage" => "Resource data not found!",
                "data" => null
            ], 200);
        }

        return response()->json([
            "success" => true,
            "massage" => "Get All Resource",
            "data" => $priority
        ], 200);
    }
}
