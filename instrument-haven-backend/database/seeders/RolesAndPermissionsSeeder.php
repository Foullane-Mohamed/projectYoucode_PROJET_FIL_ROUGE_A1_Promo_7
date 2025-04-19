<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles
        $adminRole = Role::create([
            'name' => 'admin',
            'description' => 'Administrator role with full access'
        ]);

        $customerRole = Role::create([
            'name' => 'customer',
            'description' => 'Regular customer role'
        ]);

        // Create permissions
        // Users management
        $viewUsersPermission = Permission::create(['name' => 'view-users', 'description' => 'View all users']);
        $createUsersPermission = Permission::create(['name' => 'create-users', 'description' => 'Create new users']);
        $updateUsersPermission = Permission::create(['name' => 'update-users', 'description' => 'Update user information']);
        $deleteUsersPermission = Permission::create(['name' => 'delete-users', 'description' => 'Delete users']);

        // Products management
        $viewProductsPermission = Permission::create(['name' => 'view-products', 'description' => 'View all products']);
        $createProductsPermission = Permission::create(['name' => 'create-products', 'description' => 'Create new products']);
        $updateProductsPermission = Permission::create(['name' => 'update-products', 'description' => 'Update product information']);
        $deleteProductsPermission = Permission::create(['name' => 'delete-products', 'description' => 'Delete products']);

        // Categories management
        $viewCategoriesPermission = Permission::create(['name' => 'view-categories', 'description' => 'View all categories']);
        $createCategoriesPermission = Permission::create(['name' => 'create-categories', 'description' => 'Create new categories']);
        $updateCategoriesPermission = Permission::create(['name' => 'update-categories', 'description' => 'Update category information']);
        $deleteCategoriesPermission = Permission::create(['name' => 'delete-categories', 'description' => 'Delete categories']);

        // Orders management
        $viewOrdersPermission = Permission::create(['name' => 'view-orders', 'description' => 'View all orders']);
        $createOrdersPermission = Permission::create(['name' => 'create-orders', 'description' => 'Create new orders']);
        $updateOrdersPermission = Permission::create(['name' => 'update-orders', 'description' => 'Update order information']);
        $deleteOrdersPermission = Permission::create(['name' => 'delete-orders', 'description' => 'Delete orders']);

        // Coupons management
        $viewCouponsPermission = Permission::create(['name' => 'view-coupons', 'description' => 'View all coupons']);
        $createCouponsPermission = Permission::create(['name' => 'create-coupons', 'description' => 'Create new coupons']);
        $updateCouponsPermission = Permission::create(['name' => 'update-coupons', 'description' => 'Update coupon information']);
        $deleteCouponsPermission = Permission::create(['name' => 'delete-coupons', 'description' => 'Delete coupons']);

        // Dashboard access
        $viewDashboardPermission = Permission::create(['name' => 'view-dashboard', 'description' => 'View admin dashboard']);

        // Assign permissions to roles
        // Admin role gets all permissions
        $adminRole->permissions()->attach([
            $viewUsersPermission->id,
            $createUsersPermission->id,
            $updateUsersPermission->id,
            $deleteUsersPermission->id,
            $viewProductsPermission->id,
            $createProductsPermission->id,
            $updateProductsPermission->id,
            $deleteProductsPermission->id,
            $viewCategoriesPermission->id,
            $createCategoriesPermission->id,
            $updateCategoriesPermission->id,
            $deleteCategoriesPermission->id,
            $viewOrdersPermission->id,
            $createOrdersPermission->id,
            $updateOrdersPermission->id,
            $deleteOrdersPermission->id,
            $viewCouponsPermission->id,
            $createCouponsPermission->id,
            $updateCouponsPermission->id,
            $deleteCouponsPermission->id,
            $viewDashboardPermission->id,
        ]);

        // Customer role gets limited permissions
        $customerRole->permissions()->attach([
            $viewProductsPermission->id,
            $viewCategoriesPermission->id,
            $createOrdersPermission->id,
        ]);
    }
}
