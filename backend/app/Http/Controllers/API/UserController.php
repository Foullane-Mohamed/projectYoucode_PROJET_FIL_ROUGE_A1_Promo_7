<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    protected $userRepository;

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function index()
    {
        $users = $this->userRepository->all();
        return response()->json($users);
    }

    public function show($id)
    {
        try {
            $user = $this->userRepository->find($id);
            return response()->json($user);
        } catch (\Exception $e) {
            return response()->json(['message' => 'User not found'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,'.$id,
            'role' => 'sometimes|in:visiteur,client,admin',
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string',
            'image_profil' => 'nullable|string',
            'est_actif' => 'sometimes|boolean',
            'password' => 'sometimes|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $user = $this->userRepository->update($id, $request->all());

            return response()->json([
                'message' => 'User updated successfully',
                'user' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'User not found'], 404);
        }
    }

    public function destroy(Request $request, $id)
    {
        // Prevent self-deletion
        if ($request->user()->id == $id) {
            return response()->json([
                'message' => 'You cannot delete your own account'
            ], 403);
        }

        try {
            $this->userRepository->delete($id);

            return response()->json([
                'message' => 'User deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'User not found'], 404);
        }
    }
}