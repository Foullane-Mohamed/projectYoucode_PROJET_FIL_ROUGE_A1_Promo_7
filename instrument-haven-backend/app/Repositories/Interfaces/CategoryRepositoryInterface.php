<?php

namespace App\Repositories\Interfaces;

interface CategoryRepositoryInterface extends RepositoryInterface
{

    

    public function getCategoryWithProducts($id);
    

    public function paginateWithFilters($perPage, array $filters, $orderBy, $direction);
}
