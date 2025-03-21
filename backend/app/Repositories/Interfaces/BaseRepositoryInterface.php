<?php

namespace App\Repositories\Interfaces;

interface BaseRepositoryInterface
{
    public function all(array $columns = ['*'], array $relations = []);
    public function findById(int $id, array $columns = ['*'], array $relations = [], array $appends = []);
    public function create(array $attributes);
    public function update(int $id, array $attributes);
    public function delete(int $id);
    public function findByCondition(array $condition, array $columns = ['*'], array $relations = []);
    public function paginate(int $perPage = 10, array $columns = ['*'], array $relations = []);
}