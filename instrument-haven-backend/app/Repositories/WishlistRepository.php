<?php

namespace App\Repositories;

use App\Models\Wishlist;

class WishlistRepository extends BaseRepository
{
    public function __construct(Wishlist $model)
    {
        parent::__construct($model);
    }

    public function getWishlistByUser($userId)
    {
        return $this->model->where('user_id', $userId)->with('product')->get();
    }
}