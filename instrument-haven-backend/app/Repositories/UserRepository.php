<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Hash;

class UserRepository extends BaseRepository implements UserRepositoryInterface
{

    public function setModel()
    {
        $this->model = new User();
    }


    public function findByEmail($email)
    {
        return $this->model->where('email', $email)->first();
    }
    

    public function createUser(array $data)
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        
        return $this->create($data);
    }
    

    public function updateUser(array $data, $id)
    {
        if (isset($data['password']) && !empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }
        
        return $this->update($data, $id);
    }

    public function paginateWithFilters($perPage = 15, array $filters = [], $orderBy = 'id', $direction = 'asc')
    {
        $query = $this->model->query();
        
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function (Builder $q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        
        if (!empty($filters['role'])) {
            $query->where('role', $filters['role']);
        }
        
        $query->orderBy($orderBy, $direction);
        
        return $query->paginate($perPage);
    }
}
