<?php

namespace App\Services;

use App\Repositories\Interfaces\UserRepositoryInterface;
use Exception;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UserService
{
    protected $userRepository;

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function getAllUsers()
    {
        return $this->userRepository->all(['*'], ['role']);
    }

    public function getUserById(int $id)
    {
        return $this->userRepository->findById($id, ['*'], ['role']);
    }

    public function createUser(array $attributes)
    {
        try {
            // Hash the password
            if (isset($attributes['password'])) {
                $attributes['password'] = Hash::make($attributes['password']);
            }

            return $this->userRepository->create($attributes);
        } catch (Exception $e) {
            Log::error('Error creating user: ' . $e->getMessage());
            throw new Exception('Unable to create user: ' . $e->getMessage());
        }
    }

    public function updateUser(int $id, array $attributes)
    {
        try {
            // Hash the password if provided
            if (isset($attributes['password']) && $attributes['password']) {
                $attributes['password'] = Hash::make($attributes['password']);
            } else {
                // Remove password from attributes if it's empty
                unset($attributes['password']);
            }

            return $this->userRepository->update($id, $attributes);
        } catch (Exception $e) {
            Log::error('Error updating user: ' . $e->getMessage());
            throw new Exception('Unable to update user: ' . $e->getMessage());
        }
    }

    public function deleteUser(int $id)
    {
        try {
            return $this->userRepository->delete($id);
        } catch (Exception $e) {
            Log::error('Error deleting user: ' . $e->getMessage());
            throw new Exception('Unable to delete user: ' . $e->getMessage());
        }
    }

    public function getUsersByRole(int $roleId)
    {
        return $this->userRepository->findByRole($roleId);
    }

    public function searchUsers(string $term)
    {
        return $this->userRepository->searchUsers($term);
    }
}