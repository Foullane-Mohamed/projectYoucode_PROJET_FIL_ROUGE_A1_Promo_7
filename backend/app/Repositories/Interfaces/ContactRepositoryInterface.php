<?php

namespace App\Repositories\Interfaces;

interface ContactRepositoryInterface extends BaseRepositoryInterface
{
    public function findByEmail(string $email);
    public function findByStatus(string $status);
}