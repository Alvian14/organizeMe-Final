<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Dotenv\Util\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Request as FacadesRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class TaskController extends Controller
{
    public function index()
    {
        $task = Task::with('user', 'status', 'priority')->get();

        if ($task->isEmpty()) {
            return response()->json([
                "success" => true,
                "message" => "Resource data not found!",
                "data" => null
            ], 200);
        }

        return response()->json([
            "success" => true,
            "message" => "Get All Resource",
            "data" => $task
        ], 200);
    }

    public function store(Request $request)
    {

        // Validasi input
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:100',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
            'deadline' => 'required|date|after:now',
            'user_id' => 'required|exists:users,id',
            'status_id' => 'required|exists:task_statuses,id',
            'priority_id' => 'required|exists:priority_levels,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Cek apakah user ada
        $user = User::find($request->user_id);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        // Proses upload gambar jika ada
        $imageName = null;
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = $image->hashName(); // generate hash name
            $image->move(public_path('storage/tasks/'), $imageName); // move with hash name

            // Hapus file lama jika ada
            if ($user->image) {
                $oldImagePath = public_path('storage/tasks/' . $user->image);
                if (file_exists($oldImagePath)) {
                    @unlink($oldImagePath);
                }
            }
        }

        // Simpan task ke database
        $task = Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'image' => $imageName,
            'deadline' => $request->deadline,
            'user_id' => $request->user_id,
            'status_id' => $request->status_id,
            'priority_id' => $request->priority_id
        ]);

        // Response sukses
        return response()->json([
            "success" => true,
            "message" => "Resource added successfully!",
            "data" => $task
        ], 201);
    }

    public function show(string $id)
    {
        $task = Task::with('user', 'category', 'status', 'priority')->find($id);

        // respone untuk data tidak ditemukan
        if (!$task) {
            return response()->json([
                "success" => false,
                "message" => "Resource not found",
            ], 404);
        }

        // response data ditemukan
        return response()->json([
            "success" => true,
            "message" => "Get detail resource",
            "data" => $task
        ], 200);
    }


    public function update(string $id, Request $request)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json([
                "success" => false,
                "message" => "Task not found!",
            ], 404);
        }

        // Validasi input
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority_id' => 'required|exists:priority_levels,id',
            'status_id' => 'required|exists:task_statuses,id',
            'deadline' => 'required|date|after:now',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Data yang akan diupdate
        $data = [
            'title' => $request->title,
            'description' => $request->description,
            'priority_id' => $request->priority_id,
            'status_id' => $request->status_id,
            'deadline' => $request->deadline,
        ];


        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = $image->hashName(); // generate hash name
            $image->move(public_path('storage/tasks/'), $imageName); // move with hash name

            // Hapus file lama jika ada
            if ($task->image) {
                $oldImagePath = public_path('storage/tasks/' . $task->image);
                if (file_exists($oldImagePath)) {
                    @unlink($oldImagePath);
                }
            }
            $data['image'] = $imageName;
        }


        // Update ke database
        $task->update($data);

        return response()->json([
            "success" => true,
            "message" => "Task updated successfully!",
            "data" => $task
        ], 200);
    }


    // diguanakan untuk menghapus data
    public function destroy($id)
    {
        $task = Task::find($id);
        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        // Cek apakah ada kolom 'image' dan nilainya tidak null/kosong
        if (!empty($task->image)) {
            $imagePath = public_path('uploads/' . $task->image);
            if (file_exists($imagePath)) {
                @unlink($imagePath);
            }
            // Jika file tidak ada, lanjut saja tanpa error
        }

        $task->delete();
        return response()->json(['message' => 'Task deleted'], 200);
    }


    // TaskController.php
    public function getTasksByUserId($id)
    {
        $user = User::with('tasks')->find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
                'data' => null
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Tasks retrieved successfully',
            'data' => $user->tasks
        ]);
    }

    public function getTasksByUserIdFull($id)
    {
        $tasks = Task::select(
            'tasks.id',
            'tasks.title',
            'tasks.description',
            'tasks.deadline',
            'tasks.created_at',
            'tasks.priority_id',
            'tasks.status_id',
            'tasks.image',
            'priority_levels.name as priority_name',
            'task_statuses.name as status_name'
        )
            ->leftJoin('priority_levels', 'tasks.priority_id', '=', 'priority_levels.id')
            ->leftJoin('task_statuses', 'tasks.status_id', '=', 'task_statuses.id')
            ->where('tasks.user_id', $id)
            ->get();

        if (!$tasks) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
                'data' => null
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Tasks retrieved successfully',
            'data' => $tasks
        ]);
    }
}
