<?php

namespace App\Repositories;

use App\Models\User;

class UserRepository extends BaseRepository
{
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    public function getUsersByRole($role)
    {
        return $this->model->where('role', $role)->get();
    }
}