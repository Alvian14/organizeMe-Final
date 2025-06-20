<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function index()
    {

        $user = User::all();

        if ($user->isEmpty()) {
            return response()->json([
                "success" => true,
                "message" => "Resource data not found!",
                "data" => null
            ], 200);
        }

        return response()->json([
            "success" => true,
            "message" => "Get All Resource",
            "data" => $user
        ], 200);
    }

    // fungsi untuk menghapus data
    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully'
        ], 200);
    }

    // fungsi untuk update data
    public function updateRole(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found!',
                'data' => null
            ], 404);
        }

        // Validasi hanya field role
        $request->validate([
            'role' => 'required|string|in:admin,user'
        ]);

        // Update hanya role
        $user->role = $request->role;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Role updated successfully',
            'data' => $user
        ], 200);
    }



    public function update(string $id, Request $request)
    {
        // mencari data
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                "success" => false,
                "message" => "Resource not found",
            ], 404);
        }

        // validator
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:50',
            'email' => 'required|email|max:255|unique:users,email,' . $id,
            'image' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()
            ], 422);
        }

        // data diupdate
        $data = [
            'username' => $request->username,
            'email' => $request->email,
        ];

        // handle image (upload & delete image)
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $image->store('users', 'public');

            if ($user->image) {
                Storage::disk('public')->delete('users/' . $user->image);
            }

            $data['image'] = $image->hashName();
        }

        // update data baru ke database
        $user->update($data);
        return response()->json([
            "success" => true,
            "message" => "Resource updated successfully!.",
            "data" => $user
        ], 200);
    }



    public function login(Request $request)
    {
        // Validasi input
        $validator = Validator::make($request->all(), [
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $credentials = $request->only('username', 'password');

        // Cek kredensial, buat token JWT
        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Jika berhasil login, kembalikan data user dan token
        return response()->json([
            'success' => true,
            'message' => 'Login Successfully',
            'user' => auth('api')->user(),
            'token' => $token,
        ], 200);
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|min:8'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'image' => $request->username . '.jpg',  // Set default image sesuai username
        ]);

        if ($user) {
            return response()->json([
                'success' => true,
                'message' => 'User created successfully',
                'data' => $user
            ], 201);
        }

        return response()->json([
            'success' => false,
            'message' => 'User creation failed'
        ], 400);
    }



    public function logout(Request $request)
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json([
                'success' => true,
                'message' => 'Logout successfully'
            ], 200);
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Logout failed!'
            ], 500);
        }
    }


    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Email tidak ditemukan'], 404);
        }

        return response()->json(['message' => 'Email ditemukan. Silakan reset password.']);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6|confirmed'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Email tidak ditemukan'], 404);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json(['message' => 'Password berhasil diubah.']);
    }

    
    public function updatePassword(Request $request, $id)
    {
        try {
            // Cari user berdasarkan ID
            $user = User::findOrFail($id);

            // Validasi password dan konfirmasi
            $request->validate([
                'password' => 'required|string|min:6|confirmed',
            ], [
                'password.required' => 'Password wajib diisi.',
                'password.min' => 'Password minimal 6 karakter.',
                'password.confirmed' => 'Konfirmasi password tidak cocok.',
            ]);

            // Update password
            $user->update([
                'password' => Hash::make($request->password),
                'updated_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Password berhasil diperbarui!',
                'data' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'updated_at' => $user->updated_at->format('Y-m-d H:i:s'),
                ]
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan.',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat memperbarui password.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
            ], 500);
        }
    }
}
