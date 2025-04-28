<?php

namespace App\Repositories\Interfaces;

interface UserRepositoryInterface extends RepositoryInterface
{
    /**
     * Find user by email
     * 
     * @param string $email
     * @return mixed
     */
    public function findByEmail($email);
    
    /**
     * Create a new user
     * 
     * @param array $data
     * @return mixed
     */
    public function createUser(array $data);
    
    /**
     * Update user
     * 
     * @param array $data
     * @param int $id
     * @return bool
     */
    public function updateUser(array $data, $id);
    
    /**
     * Get paginated users with search and filters
     * 
     * @param int $perPage
     * @param array $filters
     * @param string $orderBy
     * @param string $direction
     * @return mixed
     */
    public function paginateWithFilters($perPage, array $filters, $orderBy, $direction);
}
