<?php

namespace App\Repositories\Interfaces;

interface UserRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Find user by email
     *
     * @param string $email
     * @return mixed
     */
    public function findByEmail(string $email);

    /**
     * Get users by role
     *
     * @param string $role
     * @return mixed
     */
    public function getByRole(string $role);

    /**
     * Search users
     *
     * @param string $term
     * @return mixed
     */
    public function search(string $term);

    /**
     * Get user with orders summary
     *
     * @param int $userId
     * @return mixed
     */
    public function getUserWithOrdersSummary(int $userId);

    /**
     * Assign role to user
     *
     * @param int $userId
     * @param int $roleId
     * @return mixed
     */
    public function assignRole(int $userId, int $roleId);

    /**
     * Remove role from user
     *
     * @param int $userId
     * @param int $roleId
     * @return mixed
     */
    public function removeRole(int $userId, int $roleId);
}
