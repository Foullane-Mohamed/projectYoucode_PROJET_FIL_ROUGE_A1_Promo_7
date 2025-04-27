import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  IconButton,
  Divider,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Delete,
  Add,
  Remove,
  ShoppingCart,
  ArrowBack,
} from '@mui/icons-material';

const Cart = () => {
  const { cart, totalItems, loading, error, updateQuantity, removeFromCart, clearCart, applyCoupon, removeCoupon } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [clearCartDialogOpen, setClearCartDialogOpen] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    
    setApplyingCoupon(true);
    try {
      const result = await applyCoupon(couponCode);
      if (!result) {
        // The error is already handled in the context with toast
      }
      setCouponCode('');
    } catch (err) {
      toast.error('Failed to apply coupon');
    } finally {
      setApplyingCoupon(false);
    }
  };
  
  const handleRemoveCoupon = async () => {
    try {
      await removeCoupon();
    } catch (err) {
      toast.error('Failed to remove coupon');
    }
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  const handleClearCart = () => {
    clearCart();
    setClearCartDialogOpen(false);
  };

  const handleClearCartDialogOpen = () => {
    setClearCartDialogOpen(true);
  };

  const handleClearCartDialogClose = () => {
    setClearCartDialogOpen(false);
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            py: 6,
          }}
        >
          <ShoppingCart sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Looks like you haven't added any products to your cart yet.
          </Typography>
          <Button
            component={Link}
            to="/products"
            variant="contained"
            startIcon={<ArrowBack />}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Shopping Cart
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f7fa' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Product</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Price</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Quantity</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Total</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.items && cart.items.map((item) => (
                  <TableRow key={item.id} sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.02)'
                    },
                    borderBottom: '1px solid rgba(224, 224, 224, 1)'
                  }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            borderRadius: 2,
                            mr: 2,
                            bgcolor: '#f5f7fa',
                            border: '1px solid #e0e0e0',
                            p: 1,
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={
                              item.product?.thumbnail
                                ? `/images/products/${item.product.thumbnail}`
                                : (item.product?.images && Array.isArray(item.product.images) && item.product.images.length > 0
                                  ? `/images/products/${item.product.images[0]}`
                                  : '/images/categories/placeholder.jpg')
                            }
                            alt={item.product?.name || 'Product'}
                            style={{
                              maxWidth: '100%',
                              maxHeight: '100%',
                              objectFit: 'contain',
                            }}
                            onError={(e) => {
                              e.target.onerror = null; // Prevent infinite error loop
                              e.target.src = '/images/categories/placeholder.jpg';
                            }}
                          />
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" component={Link} to={`/products/${item.product_id}`} sx={{ textDecoration: 'none', color: 'text.primary', fontWeight: 500, '&:hover': { color: 'primary.main' } }}>
                            {item.product?.name || 'Product'}
                          </Typography>
                          {item.product?.brand && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              Brand: {item.product.brand}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      {item.product?.on_sale && item.product?.sale_price ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through', fontSize: '0.85rem' }}>
                            ${Number(item.product.price).toFixed(2)}
                          </Typography>
                          <Typography variant="body1" color="error" sx={{ fontWeight: 600 }}>
                            ${Number(item.product.sale_price).toFixed(2)}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          ${Number(item.price).toFixed(2)}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || loading}
                          sx={{
                            border: '1px solid rgba(0, 0, 0, 0.12)',
                            borderRadius: '4px',
                            p: 0.5,
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.04)'
                            }
                          }}
                        >
                          <Remove fontSize="small" />
                        </IconButton>
                        
                        <TextField
                          size="small"
                          type="number"
                          value={item.quantity}
                          InputProps={{
                            inputProps: { min: 1, style: { textAlign: 'center', padding: '4px 0' } },
                            sx: { borderRadius: 0 }
                          }}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          sx={{ width: 45, mx: 1 }}
                          disabled={loading}
                        />
                        
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={loading}
                          sx={{
                            border: '1px solid rgba(0, 0, 0, 0.12)',
                            borderRadius: '4px',
                            p: 0.5,
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.04)'
                            }
                          }}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" sx={{ fontWeight: 700, color: '#FF2B52' }}>
                        ${Number(item.total).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() => removeFromCart(item.id)}
                        disabled={loading}
                        size="small"
                        sx={{
                          border: '1px solid rgba(211, 47, 47, 0.5)',
                          '&:hover': {
                            backgroundColor: 'rgba(211, 47, 47, 0.04)'
                          }
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              component={Link}
              to="/products"
              startIcon={<ArrowBack />}
              variant="outlined"
              sx={{ 
                borderRadius: 6,
                px: 3,
                py: 1,
                borderColor: '#ccc',
                color: '#666',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'rgba(0,0,0,0.02)'
                }
              }}
            >
              Continue Shopping
            </Button>
            <Button
              color="error"
              onClick={handleClearCartDialogOpen}
              variant="outlined"
              sx={{ 
                borderRadius: 6,
                px: 3,
                py: 1,
                '&:hover': {
                  bgcolor: 'rgba(211, 47, 47, 0.04)'
                }
              }}
            >
              Clear Cart
            </Button>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            
            <Box sx={{ my: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Subtotal ({totalItems} items):</Typography>
                <Typography variant="body1">${Number(cart.subtotal || 0).toFixed(2)}</Typography>
              </Box>
              {cart.discount > 0 && cart.coupon && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                    Discount ({cart.coupon.code})
                    {user && (
                      <Button 
                        size="small" 
                        color="error" 
                        onClick={handleRemoveCoupon}
                        disabled={loading}
                        sx={{ ml: 1, minWidth: 'auto', p: 0 }}
                      >
                        Remove
                      </Button>
                    )}
                  </Typography>
                  <Typography variant="body1" color="error">
                    -${Number(cart.discount).toFixed(2)}
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Shipping:</Typography>
                <Typography variant="body1">Free</Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" color="primary">
                ${Number(cart.total || 0).toFixed(2)}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Coupon Code
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  disabled={loading || applyingCoupon || !user}
                />
                <Button 
                  variant="outlined" 
                  onClick={handleApplyCoupon}
                  disabled={loading || applyingCoupon || !user || !couponCode}
                >
                  {applyingCoupon ? 'Applying...' : 'Apply'}
                </Button>
              </Box>
              {cart.coupon && (
                <Alert severity="success" sx={{ mt: 1 }}>
                  Coupon "{cart.coupon.code}" applied successfully!
                </Alert>
              )}
              {!user && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  Please log in to apply coupon codes.
                </Alert>
              )}
            </Box>
            
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleCheckout}
              sx={{
                py: 1.5,
                borderRadius: 6,
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(255, 43, 82, 0.25)',
                backgroundColor: '#FF2B52',
                '&:hover': {
                  backgroundColor: '#e01e41',
                  boxShadow: '0 6px 15px rgba(255, 43, 82, 0.3)'
                }
              }}
            >
              Proceed to Checkout
            </Button>
            
            {!user && (
              <Alert severity="info" sx={{ mt: 2 }}>
                You'll need to sign in before checkout.
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Clear Cart Confirmation Dialog */}
      <Dialog
        open={clearCartDialogOpen}
        onClose={handleClearCartDialogClose}
      >
        <DialogTitle>Clear Shopping Cart</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove all items from your cart? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClearCartDialogClose}>Cancel</Button>
          <Button onClick={handleClearCart} color="error" autoFocus>
            Clear Cart
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Cart;