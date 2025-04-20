<?php

namespace App\Repositories;

use App\Repositories\Interfaces\RepositoryInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

abstract class BaseRepository implements RepositoryInterface
{
    /**
     * @var Model
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct()
    {
        $this->setModel();
    }

    /**
     * Set model
     */
    abstract public function setModel();

    /**
     * Get all records
     * 
     * @param array $columns
     * @return Collection
     */
    public function all($columns = ['*'])
    {
        return $this->model->all($columns);
    }
    
    /**
     * Get paginated records
     * 
     * @param int $perPage
     * @param array $columns
     * @return mixed
     */
    public function paginate($perPage = 15, $columns = ['*'])
    {
        return $this->model->paginate($perPage, $columns);
    }
    
    /**
     * Create new record
     * 
     * @param array $data
     * @return Model
     */
    public function create(array $data)
    {
        return $this->model->create($data);
    }
    
    /**
     * Update record
     * 
     * @param array $data
     * @param int $id
     * @return bool
     */
    public function update(array $data, $id)
    {
        $record = $this->find($id);
        return $record->update($data);
    }
    
    /**
     * Delete record
     * 
     * @param int $id
     * @return bool
     */
    public function delete($id)
    {
        return $this->model->destroy($id);
    }
    
    /**
     * Find record by id
     * 
     * @param int $id
     * @param array $columns
     * @return Model
     */
    public function find($id, $columns = ['*'])
    {
        return $this->model->findOrFail($id, $columns);
    }
    
    /**
     * Find record by field
     * 
     * @param string $field
     * @param mixed $value
     * @param array $columns
     * @return Collection
     */
    public function findByField($field, $value, $columns = ['*'])
    {
        return $this->model->where($field, $value)->get($columns);
    }
}
