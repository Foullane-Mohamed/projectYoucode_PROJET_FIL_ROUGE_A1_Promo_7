import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../api/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useUI } from '../context/UIContext';
import Breadcrumb from '../components/common/Breadcrumb';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import Alert from '../components/common/Alert';
import { formatCurrency } from '../utils/formatCurrency';
import { getImageUrl } from '../utils/helpers';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);
  
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const { addNotification } = useUI();
  
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get product details
        const productResponse = await productService.getProductById(id);
        
        if (productResponse.status === 'success') {
          setProduct(productResponse.data);
          
          // Reset quantity and selected image when product changes
          setQuantity(1);
          setSelectedImage(0);
          
          // Fetch related products by subcategory
          const subcategoryId = productResponse.data.subcategory_id;
          const subcategoryProductsResponse = await productService.getProductsBySubcategory(subcategoryId);
          
          if (subcategoryProductsResponse.status === 'success') {
            // Filter out the current product and limit to 4 products
            const filtered = subcategoryProductsResponse.data
              .filter(p => p.id !== Number(id))
              .slice(0, 4);
            
            setRelatedProducts(filtered);
          }
          
          // Fetch product comments
          const commentsResponse = await productService.getProductComments(id);
          
          if (commentsResponse.status === 'success') {
            setComments(commentsResponse.data);
          }
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [id]);
  
  const handleIncrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };
  
  const handleDecrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity);
      addNotification({
        title: 'Added to Cart',
        message: `${product.name} has been added to your cart.`,
        variant: 'success'
      });
    }
  };
  
  const handleToggleWishlist = () => {
    if (product) {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
        addNotification({
          title: 'Removed from Wishlist',
          message: `${product.name} has been removed from your wishlist.`,
          variant: 'info'
        });
      } else {
        addToWishlist(product);
        addNotification({
          title: 'Added to Wishlist',
          message: `${product.name} has been added to your wishlist.`,
          variant: 'success'
        });
      }
    }
  };
  
  // Create breadcrumb items based on product data
  const getBreadcrumbItems = () => {
    const items = [
      { label: 'Home', path: '/' },
      { label: 'Products', path: '/products' }
    ];
    
    if (product && product.subcategory) {
      if (product.subcategory.category) {
        items.push({
          label: product.subcategory.category.name,
          path: `/products?category=${product.subcategory.category.id}`
        });
      }
      
      items.push({
        label: product.subcategory.name,
        path: `/products?subcategory=${product.subcategory.id}`
      });
    }
    
    if (product) {
      items.push({ label: product.name, path: `/products/${product.id}` });
    }
    
    return items;
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="error" message={error} />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert 
          variant="warning" 
          title="Product Not Found" 
          message="The product you are looking for does not exist or has been removed." 
        />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb items={getBreadcrumbItems()} className="mb-8" />
      
      {/* Product details */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Product images */}
          <div>
            <div className="mb-4 aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className="w-full h-full object-center object-cover"
              />
            </div>
            
            {/* Additional images would go here if available */}
            <div className="grid grid-cols-4 gap-2">
              <button 
                className={`border-2 rounded-md overflow-hidden ${selectedImage === 0 ? 'border-indigo-500' : 'border-transparent'}`}
                onClick={() => setSelectedImage(0)}
              >
                <img
src={getImageUrl(product.image)}
alt={`${product.name} thumbnail`}
className="w-full h-full object-center object-cover"
/>
</button>
{/* Additional image thumbnails would go here */}
</div>
</div>

{/* Product info */}
<div>
<h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

{/* Price */}
<p className="text-3xl text-gray-900 font-semibold mb-4">
{formatCurrency(product.price)}
</p>

{/* Stock status */}
<div className="mb-6">
{product.stock > 0 ? (
<div className="flex items-center">
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
  <svg className="h-2 w-2 text-green-500 mr-1" fill="currentColor" viewBox="0 0 8 8">
    <circle cx="4" cy="4" r="3" />
  </svg>
  In Stock
</span>
<span className="text-sm text-gray-500">
  {product.stock} {product.stock === 1 ? 'item' : 'items'} left
</span>
</div>
) : (
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
<svg className="h-2 w-2 text-red-500 mr-1" fill="currentColor" viewBox="0 0 8 8">
  <circle cx="4" cy="4" r="3" />
</svg>
Out of Stock
</span>
)}
</div>

{/* Short description */}
<div className="mb-6">
<p className="text-gray-700">{product.description.slice(0, 150)}...</p>
</div>

{/* Category & SKU */}
<div className="mb-6">
<p className="text-sm text-gray-600 mb-1">
<span className="font-medium">Category:</span>{' '}
{product.subcategory?.category?.name || 'N/A'} &gt; {product.subcategory?.name || 'N/A'}
</p>
<p className="text-sm text-gray-600">
<span className="font-medium">SKU:</span> {product.id}
</p>
</div>

{/* Quantity selector */}
{product.stock > 0 && (
<div className="mb-6">
<label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
Quantity
</label>
<div className="flex">
<button
  type="button"
  className="p-2 border border-gray-300 rounded-l-md text-gray-700 hover:bg-gray-100"
  onClick={handleDecrementQuantity}
  disabled={quantity <= 1}
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
  </svg>
</button>
<input
  type="number"
  id="quantity"
  name="quantity"
  min="1"
  max={product.stock}
  value={quantity}
  onChange={(e) => setQuantity(Math.min(Math.max(1, parseInt(e.target.value) || 1), product.stock))}
  className="p-2 w-16 text-center border-t border-b border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300"
/>
<button
  type="button"
  className="p-2 border border-gray-300 rounded-r-md text-gray-700 hover:bg-gray-100"
  onClick={handleIncrementQuantity}
  disabled={quantity >= product.stock}
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
</button>
</div>
</div>
)}

{/* Action buttons */}
<div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
<Button
variant="primary"
fullWidth
disabled={product.stock <= 0}
onClick={handleAddToCart}
icon={
<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
</svg>
}
>
{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
</Button>

<Button
variant={isInWishlist(product.id) ? 'danger' : 'outline'}
fullWidth
onClick={handleToggleWishlist}
icon={
<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
</svg>
}
>
{isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
</Button>
</div>
</div>
</div>

{/* Tabs: Description, Specifications, Reviews */}
<div className="border-t border-gray-200 px-6 py-4">
<div className="border-b border-gray-200">
<nav className="-mb-px flex space-x-8">
<button
className={`${
activeTab === 'description'
  ? 'border-indigo-500 text-indigo-600'
  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
onClick={() => setActiveTab('description')}
>
Description
</button>

<button
className={`${
activeTab === 'specifications'
  ? 'border-indigo-500 text-indigo-600'
  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
onClick={() => setActiveTab('specifications')}
>
Specifications
</button>

<button
className={`${
activeTab === 'reviews'
  ? 'border-indigo-500 text-indigo-600'
  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
onClick={() => setActiveTab('reviews')}
>
Reviews ({comments.length})
</button>
</nav>
</div>

<div className="py-6">
{activeTab === 'description' && (
<div className="prose max-w-none">
<p>{product.description}</p>
</div>
)}

{activeTab === 'specifications' && (
<div className="overflow-hidden">
<table className="min-w-full divide-y divide-gray-200">
<tbody className="divide-y divide-gray-200">
  <tr>
    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/3">Brand</td>
    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">N/A</td>
  </tr>
  <tr>
    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Model</td>
    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">N/A</td>
  </tr>
  <tr>
    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Category</td>
    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
      {product.subcategory?.category?.name || 'N/A'}
    </td>
  </tr>
  <tr>
    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">Subcategory</td>
    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
      {product.subcategory?.name || 'N/A'}
    </td>
  </tr>
</tbody>
</table>
</div>
)}

{activeTab === 'reviews' && (
<div>
{comments.length === 0 ? (
<div className="text-center py-8">
  <p className="text-gray-500 mb-4">No reviews yet. Be the first to review this product.</p>
  <Button variant="primary">Write a Review</Button>
</div>
) : (
<div className="space-y-8">
  {comments.map((comment) => (
    <div key={comment.id} className="flex space-x-4">
      <div className="flex-shrink-0">
        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
          {comment.user?.name?.charAt(0) || 'U'}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center mb-1">
          <h4 className="text-sm font-medium text-gray-900">{comment.user?.name || 'Anonymous'}</h4>
          <span className="ml-2 text-xs text-gray-500">
            {new Date(comment.created_at).toLocaleDateString()}
          </span>
        </div>
        <div className="flex mb-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <svg
              key={index}
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ${
                index < comment.rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <p className="text-sm text-gray-700">{comment.content}</p>
      </div>
    </div>
  ))}
</div>
)}
</div>
)}
</div>
</div>
</div>

{/* Related Products */}
{relatedProducts.length > 0 && (
<div className="mt-12">
<h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
{relatedProducts.map((relatedProduct) => (
<Link 
key={relatedProduct.id} 
to={`/products/${relatedProduct.id}`}
className="group"
>
<div className="bg-white rounded-lg shadow-sm overflow-hidden">
<div className="aspect-w-1 aspect-h-1 bg-gray-100">
  <img
    src={getImageUrl(relatedProduct.image)}
    alt={relatedProduct.name}
    className="w-full h-full object-center object-cover group-hover:opacity-75"
  />
</div>
<div className="p-4">
  <h3 className="text-sm font-medium text-gray-900">{relatedProduct.name}</h3>
  <p className="mt-1 text-lg font-medium text-gray-900">
    {formatCurrency(relatedProduct.price)}
  </p>
</div>
</div>
</Link>
))}
</div>
</div>
)}
</div>
);
};

export default ProductDetailsPage;