<?php

namespace App\Repositories\Interfaces;

interface RepositoryInterface
{
    /**
     * Get all records
     * 
     * @param array $columns
     * @return mixed
     */
    public function all($columns = ['*']);
    
    /**
     * Get paginated records
     * 
     * @param int $perPage
     * @param array $columns
     * @return mixed
     */
    public function paginate($perPage = 15, $columns = ['*']);
    
    /**
     * Create new record
     * 
     * @param array $data
     * @return mixed
     */
    public function create(array $data);
    
    /**
     * Update record
     * 
     * @param array $data
     * @param int $id
     * @return mixed
     */
    public function update(array $data, $id);
    
    /**
     * Delete record
     * 
     * @param int $id
     * @return mixed
     */
    public function delete($id);
    
    /**
     * Find record by id
     * 
     * @param int $id
     * @param array $columns
     * @return mixed
     */
    public function find($id, $columns = ['*']);
    
    /**
     * Find record by field
     * 
     * @param string $field
     * @param mixed $value
     * @param array $columns
     * @return mixed
     */
    public function findByField($field, $value, $columns = ['*']);
}
