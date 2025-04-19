<?php

namespace App\Repositories\Interfaces;

interface BaseRepositoryInterface
{
    /**
     * Get all resources
     *
     * @param array $columns
     * @return mixed
     */
    public function all(array $columns = ['*']);

    /**
     * Get paginated resources
     *
     * @param int $perPage
     * @param array $columns
     * @return mixed
     */
    public function paginate(int $perPage = 15, array $columns = ['*']);

    /**
     * Create new resource
     *
     * @param array $data
     * @return mixed
     */
    public function create(array $data);

    /**
     * Update resource
     *
     * @param int $id
     * @param array $data
     * @return mixed
     */
    public function update(int $id, array $data);

    /**
     * Delete resource
     *
     * @param int $id
     * @return mixed
     */
    public function delete(int $id);

    /**
     * Find resource by id
     *
     * @param int $id
     * @param array $columns
     * @return mixed
     */
    public function find(int $id, array $columns = ['*']);

    /**
     * Find resource by field
     *
     * @param string $field
     * @param mixed $value
     * @param array $columns
     * @return mixed
     */
    public function findByField(string $field, $value, array $columns = ['*']);

    /**
     * Find resource by multiple fields
     *
     * @param array $where
     * @param array $columns
     * @return mixed
     */
    public function findWhere(array $where, array $columns = ['*']);
}
