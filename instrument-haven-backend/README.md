# ADINAN STORE API

This is the backend API for the ADINAN STORE project, an e-commerce platform for musical instruments built with Laravel 10 and Sanctum for authentication.

## Features

-   User authentication (register, login, logout)
-   Product catalog with categories and subcategories
-   Product search and filtering
-   Shopping cart functionality
-   Wishlist management
-   Order processing
-   Review and rating system
-   Coupon management
-   Admin dashboard with statistics
-   Role-based access control

## Requirements

-   PHP 8.1 or higher
-   Composer
-   MySQL
-   Laravel 10

## Installation

1. Clone the repository

```bash
git clone <repository-url>
cd backend
```

2. Install dependencies

```bash
composer install
```

3. Create and configure .env file

```bash
cp .env.example .env
```

Then edit the .env file to set up your database connection.

4. Generate application key

```bash
php artisan key:generate
```

5. Run migrations and seed the database

```bash
php artisan migrate --seed
```

6. Start the development server

```bash
php artisan serve
```

## API Documentation

The API uses a RESTful design and returns JSON responses. All endpoints are prefixed with `/api/v1`.

You can view all available API endpoints by running:

```bash
php artisan api:list
```

### Authentication

The API uses Laravel Sanctum for token-based authentication. Include the authentication token in the request headers:

```
Authorization: Bearer {your_token}
```

### Default Users

After seeding the database, you can use these default users:

-   Admin:

    -   Email: admin@example.com
    -   Password: password123

-   Customer:
    -   Email: john@example.com
    -   Password: password123

## API Endpoints

### Public Endpoints

-   **Authentication**

    -   `POST /api/v1/auth/register` - Register a new user
    -   `POST /api/v1/auth/login` - Login an existing user

-   **Products**

    -   `GET /api/v1/products` - Get all products (with filtering and pagination)
    -   `GET /api/v1/products/{id}` - Get a specific product
    -   `GET /api/v1/products/{productId}/reviews` - Get reviews for a product

-   **Categories**

    -   `GET /api/v1/categories` - Get all categories
    -   `GET /api/v1/categories/{id}` - Get a specific category with its products

-   **Contact**
    -   `POST /api/v1/contact` - Submit a contact form

### Protected Endpoints (Require Authentication)

-   **User Profile**

    -   `GET /api/v1/auth/user` - Get authenticated user
    -   `PUT /api/v1/auth/user/update` - Update user profile
    -   `POST /api/v1/auth/logout` - Logout user

-   **Cart**

    -   `GET /api/v1/cart` - Get user's cart
    -   `POST /api/v1/cart/items` - Add item to cart
    -   `PUT /api/v1/cart/items/{id}` - Update cart item quantity
    -   `DELETE /api/v1/cart/items/{id}` - Remove item from cart
    -   `POST /api/v1/cart/apply-coupon` - Apply coupon to cart
    -   `POST /api/v1/cart/remove-coupon` - Remove coupon from cart

-   **Wishlist**

    -   `GET /api/v1/wishlist` - Get user's wishlist
    -   `POST /api/v1/wishlist` - Add product to wishlist
    -   `DELETE /api/v1/wishlist/{productId}` - Remove product from wishlist

-   **Orders**

    -   `GET /api/v1/orders` - Get all user orders
    -   `GET /api/v1/orders/{id}` - Get a specific order
    -   `POST /api/v1/orders` - Create a new order
    -   `PUT /api/v1/orders/{id}/cancel` - Cancel an order

-   **Reviews**
    -   `POST /api/v1/products/{productId}/reviews` - Create a review
    -   `PUT /api/v1/products/{productId}/reviews/{id}` - Update a review
    -   `DELETE /api/v1/products/{productId}/reviews/{id}` - Delete a review

### Admin Endpoints (Require Admin Role)

-   **Dashboard**

    -   `GET /api/v1/admin/dashboard` - Get dashboard statistics

-   **Users Management**

    -   `GET /api/v1/admin/users` - Get all users
    -   `GET /api/v1/admin/users/{id}` - Get a specific user
    -   `PUT /api/v1/admin/users/{id}` - Update a user

-   **Orders Management**

    -   `GET /api/v1/admin/orders` - Get all orders
    -   `PUT /api/v1/admin/orders/{id}` - Update order status
    -   `GET /api/v1/admin/orders/statistics` - Get order statistics

-   **Products Management**

    -   `POST /api/v1/admin/products` - Create a product
    -   `PUT /api/v1/admin/products/{id}` - Update a product
    -   `DELETE /api/v1/admin/products/{id}` - Delete a product

-   **Categories Management**

    -   `POST /api/v1/admin/categories` - Create a category
    -   `PUT /api/v1/admin/categories/{id}` - Update a category
    -   `DELETE /api/v1/admin/categories/{id}` - Delete a category

-   **Coupons Management**
    -   `GET /api/v1/admin/coupons` - Get all coupons
    -   `POST /api/v1/admin/coupons` - Create a coupon
    -   `PUT /api/v1/admin/coupons/{id}` - Update a coupon
    -   `DELETE /api/v1/admin/coupons/{id}` - Delete a coupon

## Frontend Integration

This API is designed to work with a React.js frontend. The API supports CORS and is configured to work with the frontend running on a different domain.

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
