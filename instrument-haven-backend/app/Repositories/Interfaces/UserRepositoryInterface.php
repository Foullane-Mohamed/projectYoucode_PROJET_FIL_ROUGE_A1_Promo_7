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
}
