<?php

namespace App\Repositories;

use App\Repositories\Interfaces\RepositoryInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

abstract class BaseRepository implements RepositoryInterface
{

    protected $model;


    public function __construct()
    {
        $this->setModel();
    }

  
    abstract public function setModel();

    public function all($columns = ['*'])
    {
        return $this->model->all($columns);
    }
    
  
    public function paginate($perPage = 15, $columns = ['*'])
    {
        return $this->model->paginate($perPage, $columns);
    }
    

    public function create(array $data)
    {
        return $this->model->create($data);
    }
    

    public function update(array $data, $id)
    {
        $record = $this->find($id);
        return $record->update($data);
    }
    

    public function delete($id)
    {
        return $this->model->destroy($id);
    }

    public function find($id, $columns = ['*'])
    {
        return $this->model->findOrFail($id, $columns);
    }
    

    public function findByField($field, $value, $columns = ['*'])
    {
        return $this->model->where($field, $value)->get($columns);
    }
}
