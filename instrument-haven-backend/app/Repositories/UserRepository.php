<?php

namespace App\Repositories;

use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Support\Facades\DB;

class UserRepository extends BaseRepository implements UserRepositoryInterface
{
    /**
     * UserRepository constructor.
     *
     * @param User $model
     */
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    /**
     * @inheritDoc
     */
    public function findByEmail(string $email)
    {
        return $this->model->where('email', $email)->first();
    }

    /**
     * @inheritDoc
     */
    public function getByRole(string $role)
    {
        return $this->model->where('role', $role)->get();
    }

    /**
     * @inheritDoc
     */
    public function search(string $term)
    {
        return $this->model->where('name', 'like', "%{$term}%")
            ->orWhere('email', 'like', "%{$term}%")
            ->get();
    }

    /**
     * @inheritDoc
     */
    public function getUserWithOrdersSummary(int $userId)
    {
        $user = $this->model->with('addresses')->find($userId);

        if (!$user) {
            return null;
        }

        $ordersSummary = DB::table('orders')
            ->where('user_id', $userId)
            ->selectRaw('COUNT(*) as total_orders, SUM(total) as total_spent, AVG(total) as avg_order_value, MAX(created_at) as last_order_date')
            ->first();

        $user->orders_summary = $ordersSummary;
        
        return $user;
    }

    /**
     * @inheritDoc
     */
    public function assignRole(int $userId, int $roleId)
    {
        $user = $this->find($userId);
        
        if (!$user) {
            return false;
        }
        
        $user->roles()->syncWithoutDetaching([$roleId]);
        
        return true;
    }

    /**
     * @inheritDoc
     */
    public function removeRole(int $userId, int $roleId)
    {
        $user = $this->find($userId);
        
        if (!$user) {
            return false;
        }
        
        $user->roles()->detach($roleId);
        
        return true;
    }
}
