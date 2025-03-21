<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Interfaces\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

abstract class BaseRepository implements BaseRepositoryInterface
{
    protected $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    public function all(array $columns = ['*'], array $relations = [])
    {
        return $this->model->with($relations)->get($columns);
    }

    public function findById(int $id, array $columns = ['*'], array $relations = [], array $appends = [])
    {
        $model = $this->model->select($columns)->with($relations)->findOrFail($id);
        
        if (!empty($appends)) {
            $model->append($appends);
        }
        
        return $model;
    }

    public function create(array $attributes)
    {
        return $this->model->create($attributes);
    }

    public function update(int $id, array $attributes)
    {
        $model = $this->findById($id);
        $model->update($attributes);
        return $model;
    }

    public function delete(int $id)
    {
        $model = $this->findById($id);
        return $model->delete();
    }

    public function findByCondition(array $condition, array $columns = ['*'], array $relations = [])
    {
        return $this->model->select($columns)->with($relations)->where($condition)->get();
    }

    public function paginate(int $perPage = 10, array $columns = ['*'], array $relations = [])
    {
        return $this->model->select($columns)->with($relations)->paginate($perPage);
    }
}