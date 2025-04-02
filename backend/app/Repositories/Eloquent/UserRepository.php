<?php

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;

class UserRepository extends BaseRepository implements UserRepositoryInterface
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    public function findByEmail(string $email)
    {
        return $this->model->where('email', $email)->first();
    }

    public function findByRole(int $roleId)
    {
        return $this->model->where('role_id', $roleId)->with('role')->get();
    }

    public function searchUsers(string $term)
    {
        return $this->model->where('name', 'like', "%{$term}%")
                          ->orWhere('email', 'like', "%{$term}%")
                          ->with('role')
                          ->get();
    }

    public function updateProfile(int $id, array $attributes)
    {
        $user = $this->findById($id);
        $user->update($attributes);
        return $user;
    }
}