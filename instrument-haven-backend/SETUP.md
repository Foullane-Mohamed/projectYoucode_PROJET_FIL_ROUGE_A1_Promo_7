# Instrument Haven API - Setup Guide

## Project Structure

The Instrument Haven API has been built with Laravel 10 using the Repository pattern. Here's an overview of the main components:

### Models
- User
- Product
- Category
- Cart & CartItem
- Wishlist
- Order & OrderItem
- Coupon
- Review
- Tag

### Repositories
Each model has its corresponding repository interface and implementation, following the Repository pattern to separate data access logic from business logic.

### Controllers
- AuthController - Handles user authentication
- ProductController - Manages product-related operations
- CategoryController - Manages category-related operations
- CartController - Handles shopping cart operations
- WishlistController - Manages user wishlists
- OrderController - Processes orders
- ContactController - Handles contact form submissions
- Admin controllers for administrative operations

### Middlewares
- IsAdmin - Restricts access to admin-only endpoints

## Setup Instructions

1. Make sure your database is set up in the `.env` file:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
```

2. Run migrations to create the database tables:
```bash
php artisan migrate
```

3. Seed the database with initial data:
```bash
php artisan db:seed
```

4. Start the Laravel development server:
```bash
php artisan serve
```

5. The API will be available at `http://localhost:8000/api/v1/`

## Default Users

After seeding the database, you can use these default accounts:

- Admin:
  - Email: admin@example.com
  - Password: password123

- Customer:
  - Email: john@example.com
  - Password: password123

## API Testing

A Postman collection is included in the project (`postman_collection.json`). You can import this into Postman to test the API endpoints.

1. Import the collection into Postman
2. Create an environment and set the `baseUrl` variable to `http://localhost:8000`
3. Use the "Login" request to get an authentication token
4. The token will be automatically stored and used for subsequent requests

## Next Steps

### Frontend Integration
- Implement a React.js frontend using the API endpoints
- Use Tailwind CSS for styling as specified in the requirements

### Stripe Integration
- Implement Stripe payment gateway in the OrderController
- Create necessary webhook endpoints for handling payment events

### File Storage
- Configure file storage for product images
- Implement file upload functionality for products and categories

### Additional Features
- Implement email notifications for order status changes
- Add password reset functionality
- Implement social login (Google, Facebook)

## Command Reference

- List all API endpoints:
```bash
php artisan api:list
```

- Clear cache:
```bash
php artisan cache:clear
```

- Generate API documentation (requires additional packages):
```bash
php artisan apidoc:generate
```

## Troubleshooting

If you encounter any issues:

1. Make sure your database is correctly configured and accessible
2. Check the Laravel logs in `storage/logs/laravel.log`
3. Ensure that all migrations have run successfully
4. Verify that your PHP version is 8.1 or higher
5. Make sure you've set up proper permissions for Laravel storage and bootstrap directories

## Conclusion

The API is now set up and ready to be integrated with a frontend application. All the required endpoints are implemented according to the API documentation.
