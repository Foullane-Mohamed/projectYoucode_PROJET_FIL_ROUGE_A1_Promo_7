<?php

namespace App\Repositories\Interfaces;

interface UserRepositoryInterface extends RepositoryInterface
{

    public function findByEmail($email);
    

    public function createUser(array $data);
    
    public function updateUser(array $data, $id);
    
    public function paginateWithFilters($perPage, array $filters, $orderBy, $direction);
}
