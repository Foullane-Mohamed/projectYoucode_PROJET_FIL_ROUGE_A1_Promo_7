<?php

namespace App\Repositories\Interfaces;

interface UserRepositoryInterface extends BaseRepositoryInterface
{
    public function findByEmail(string $email);
    public function findByRole(int $roleId);
    public function searchUsers(string $term);
    public function updateProfile(int $id, array $attributes);
}