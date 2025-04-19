# Instrument Haven API

This is the backend API for the Instrument Haven e-commerce platform, built with Laravel 12 and MySQL.

## Requirements

- PHP 8.2 or higher
- Composer
- MySQL
- Laravel 12

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/instrument-haven.git
   cd instrument-haven-backend
   ```

2. Install dependencies:
   ```bash
   composer install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. Create a symbolic link to the storage directory:
   ```bash
   php artisan storage:link
   ```

5. Configure your database connection in the `.env` file:
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=instrument_haven
   DB_USERNAME=root
   DB_PASSWORD=
   ```

5. Run migrations and seed the database:
   ```bash
   php artisan migrate:fresh --seed
   ```

6. Start the development server:
   ```bash
   php artisan serve
   ```

## API Documentation

The API provides endpoints for the following resources:

- Authentication (register, login, logout)
- Products (list, search, filter, details)
- Categories (hierarchical structure)
- Cart (add, update, remove items, apply coupons)
- Orders (create, manage, track)
- Wishlist (add, remove products)
- Reviews (view, add, update, delete)
- Contact (submit contact form)
- Admin features (dashboard statistics, user management, order management, etc.)

## Default Users

After seeding the database, you can use these credentials to log in:

- Admin:
  - Email: admin@instrumenthaven.com
  - Password: password123

- Customer:
  - Email: customer@example.com
  - Password: password123

## Authentication

The API uses Laravel Sanctum for authentication. Include the token in the Authorization header for protected routes:

```
Authorization: Bearer {your_token}
```

## API Routes

### Public Routes

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Log in a user
- `GET /api/v1/products` - Get list of products
- `GET /api/v1/products/{id}` - Get product details
- `GET /api/v1/categories` - Get list of categories
- `GET /api/v1/categories/{id}` - Get category details
- `GET /api/v1/products/{productId}/reviews` - Get product reviews
- `POST /api/v1/contact` - Send a contact message

### Protected Routes

- `POST /api/v1/auth/logout` - Log out the authenticated user
- `GET /api/v1/auth/user` - Get authenticated user details
- `GET /api/v1/cart` - Get user's cart
- `POST /api/v1/cart/items` - Add item to cart
- `PUT /api/v1/cart/items/{id}` - Update cart item quantity
- `DELETE /api/v1/cart/items/{id}` - Remove item from cart
- `POST /api/v1/cart/apply-coupon` - Apply a coupon to the cart
- `POST /api/v1/cart/remove-coupon` - Remove a coupon from the cart
- `GET /api/v1/wishlist` - Get user's wishlist
- `POST /api/v1/wishlist` - Add product to wishlist
- `DELETE /api/v1/wishlist/{productId}` - Remove product from wishlist
- `GET /api/v1/orders` - Get user's orders
- `GET /api/v1/orders/{id}` - Get order details
- `POST /api/v1/orders` - Create a new order
- `PUT /api/v1/orders/{id}/cancel` - Cancel an order
- `POST /api/v1/products/{productId}/reviews` - Add a product review
- `PUT /api/v1/products/{productId}/reviews/{id}` - Update a review
- `DELETE /api/v1/products/{productId}/reviews/{id}` - Delete a review

### Admin Routes

- `GET /api/v1/admin/dashboard` - Get dashboard statistics
- `GET /api/v1/admin/users` - Get list of users
- `GET /api/v1/admin/users/{id}` - Get user details
- `PUT /api/v1/admin/users/{id}` - Update user information
- `GET /api/v1/admin/orders` - Get list of orders
- `PUT /api/v1/admin/orders/{id}` - Update order status
- `GET /api/v1/admin/orders/statistics` - Get order statistics
- `POST /api/v1/admin/products` - Create a new product
- `PUT /api/v1/admin/products/{id}` - Update a product
- `DELETE /api/v1/admin/products/{id}` - Delete a product
- `POST /api/v1/admin/categories` - Create a new category
- `PUT /api/v1/admin/categories/{id}` - Update a category
- `DELETE /api/v1/admin/categories/{id}` - Delete a category
- `GET /api/v1/admin/coupons` - Get list of coupons
- `POST /api/v1/admin/coupons` - Create a new coupon
- `PUT /api/v1/admin/coupons/{id}` - Update a coupon
- `DELETE /api/v1/admin/coupons/{id}` - Delete a coupon

## Commands for Project Setup

Here's a summary of all the commands needed to set up the project:

```bash
# Clone repository
git clone https://github.com/yourusername/instrument-haven.git
cd instrument-haven-backend

# Install dependencies
composer install

# Set up environment
cp .env.example .env
php artisan key:generate

# Create storage symbolic link
php artisan storage:link

# Run migrations and seeders
php artisan migrate:fresh --seed

# Start the server
php artisan serve
```

## Developer Information

This project follows the repository pattern for data access. The code is organized as follows:

- `app/Models` - Eloquent models
- `app/Http/Controllers` - API controllers
- `app/Repositories` - Repository implementations
- `app/Repositories/Interfaces` - Repository interfaces
- `database/migrations` - Database migrations
- `database/seeders` - Database seeders
