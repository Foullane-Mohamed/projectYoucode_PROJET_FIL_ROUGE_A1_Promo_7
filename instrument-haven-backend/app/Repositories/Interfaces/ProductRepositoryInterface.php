<?php

namespace App\Repositories\Interfaces;

interface ProductRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get products with filters
     *
     * @param array $filters
     * @param int $perPage
     * @return mixed
     */
    public function getWithFilters(array $filters, int $perPage = 15);

    /**
     * Get product with details
     *
     * @param int $id
     * @return mixed
     */
    public function getWithDetails(int $id);

    /**
     * Find product by slug
     *
     * @param string $slug
     * @return mixed
     */
    public function findBySlug(string $slug);

    /**
     * Search products
     *
     * @param string $term
     * @return mixed
     */
    public function search(string $term);

    /**
     * Get product reviews
     *
     * @param int $productId
     * @param array $filters
     * @param int $perPage
     * @return mixed
     */
    public function getReviews(int $productId, array $filters = [], int $perPage = 10);

    /**
     * Update product stock
     *
     * @param int $productId
     * @param int $quantity
     * @param bool $increment
     * @return mixed
     */
    public function updateStock(int $productId, int $quantity, bool $increment = false);

    /**
     * Get top selling products
     *
     * @param int $limit
     * @return mixed
     */
    public function getTopSelling(int $limit = 5);

    /**
     * Get low stock products
     *
     * @param int $threshold
     * @param int $limit
     * @return mixed
     */
    public function getLowStock(int $threshold = 5, int $limit = 10);
}
