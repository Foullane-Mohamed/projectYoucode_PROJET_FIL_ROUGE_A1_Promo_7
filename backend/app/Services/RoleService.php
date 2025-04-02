<?php

namespace App\Services;

use App\Repositories\Interfaces\RoleRepositoryInterface;
use Exception;
use Illuminate\Support\Facades\Log;

class RoleService
{
    protected $roleRepository;

    public function __construct(RoleRepositoryInterface $roleRepository)
    {
        $this->roleRepository = $roleRepository;
    }

    public function getAllRoles()
    {
        return $this->roleRepository->all();
    }

    public function getRoleById(int $id)
    {
        return $this->roleRepository->findById($id);
    }

    public function createRole(array $attributes)
    {
        try {
            return $this->roleRepository->create($attributes);
        } catch (Exception $e) {
            Log::error('Error creating role: ' . $e->getMessage());
            throw new Exception('Unable to create role: ' . $e->getMessage());
        }
    }

    public function updateRole(int $id, array $attributes)
    {
        try {
            return $this->roleRepository->update($id, $attributes);
        } catch (Exception $e) {
            Log::error('Error updating role: ' . $e->getMessage());
            throw new Exception('Unable to update role: ' . $e->getMessage());
        }
    }

    public function deleteRole(int $id)
    {
        try {
            return $this->roleRepository->delete($id);
        } catch (Exception $e) {
            Log::error('Error deleting role: ' . $e->getMessage());
            throw new Exception('Unable to delete role: ' . $e->getMessage());
        }
    }

    public function findRoleByName(string $name)
    {
        return $this->roleRepository->findByName($name);
    }
}