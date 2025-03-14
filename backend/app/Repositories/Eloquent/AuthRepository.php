<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Interfaces\AuthRepositoryInterface;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthRepository implements AuthRepositoryInterface
{
    protected $userRepository;

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function register(array $data)
    {
        $user = $this->userRepository->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'role' => 'client', 
            'telephone' => $data['telephone'] ?? null,
            'adresse' => $data['adresse'] ?? null,
            'image_profil' => $data['image_profil'] ?? null,
            'derniere_connexion' => now(),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ];
    }

    public function login(array $credentials)
    {
        if (!Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user = $this->userRepository->findByEmail($credentials['email']);

        if (!$user->est_actif) {
            throw ValidationException::withMessages([
                'email' => ['Your account has been deactivated. Please contact an administrator.'],
            ]);
        }

        // Update last login time
        $this->userRepository->updateLastLogin($user->id);

        // Revoke previous tokens (optional)
        $user->tokens()->delete();
        
        // Create new token
        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ];
    }

    public function logout($user)
    {
        return $user->currentAccessToken()->delete();
    }

    public function updateProfile($user, array $data)
    {
        // Check current password if user wants to change password
        if (isset($data['current_password']) && isset($data['password'])) {
            if (!Hash::check($data['current_password'], $user->password)) {
                throw ValidationException::withMessages([
                    'current_password' => ['The provided current password is incorrect.'],
                ]);
            }
        }

        $userData = array_filter($data, function ($key) {
            return in_array($key, ['name', 'email', 'password', 'telephone', 'adresse', 'image_profil']);
        }, ARRAY_FILTER_USE_KEY);

        return $this->userRepository->update($user->id, $userData);
    }
}