<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Hash;

class UserRepository extends BaseRepository implements UserRepositoryInterface
{
    /**
     * Set model
     */
    public function setModel()
    {
        $this->model = new User();
    }

    /**
     * Find user by email
     * 
     * @param string $email
     * @return mixed
     */
    public function findByEmail($email)
    {
        return $this->model->where('email', $email)->first();
    }
    
    /**
     * Create a new user
     * 
     * @param array $data
     * @return User
     */
    public function createUser(array $data)
    {
        // Hash password if provided
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        
        return $this->create($data);
    }
    
    /**
     * Update user
     * 
     * @param array $data
     * @param int $id
     * @return bool
     */
    public function updateUser(array $data, $id)
    {
        // Hash password if provided
        if (isset($data['password']) && !empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            // Remove empty password from data
            unset($data['password']);
        }
        
        return $this->update($data, $id);
    }
    
    /**
     * Get paginated users with search and filters
     * 
     * @param int $perPage
     * @param array $filters
     * @param string $orderBy
     * @param string $direction
     * @return mixed
     */
    public function paginateWithFilters($perPage = 15, array $filters = [], $orderBy = 'id', $direction = 'asc')
    {
        $query = $this->model->query();
        
        // Apply search filter
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function (Builder $q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        
        // Apply role filter
        if (!empty($filters['role'])) {
            $query->where('role', $filters['role']);
        }
        
        // Apply ordering
        $query->orderBy($orderBy, $direction);
        
        return $query->paginate($perPage);
    }
}
