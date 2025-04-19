# Instrument Haven Frontend

This is the frontend application for the Instrument Haven e-commerce platform, built with React and Material UI.

## Requirements

- Node.js 18.x or higher
- npm 9.x or higher

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/instrument-haven.git
   cd instrument-haven-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your API URL:
   ```
   VITE_APP_NAME="Instrument Haven"
   VITE_APP_VERSION="1.0.0"
   VITE_API_URL="http://localhost:8000/api/v1"
   VITE_STORAGE_URL="http://localhost:8000/storage"
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Features

- User authentication (login, register, profile management)
- Product browsing with filtering and search
- Product details with reviews
- Shopping cart management
- Wishlist functionality
- Checkout process
- Order history
- Admin dashboard with product, category, order management

## Folder Structure

- `src/components` - Reusable React components
- `src/pages` - Page components
- `src/context` - React context providers
- `src/services` - API services
- `src/assets` - Static assets
- `src/utils` - Utility functions

## Technology Stack

- React 19
- Material UI 7
- React Router 7
- Axios for API requests
- Formik and Yup for form validation
- Tailwind CSS for utility styling

## Admin Access

After setting up the backend and running the seeders, you can use these admin credentials to access the admin dashboard:

- Email: admin@instrumenthaven.com
- Password: password123

## Commands

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Lint the code
