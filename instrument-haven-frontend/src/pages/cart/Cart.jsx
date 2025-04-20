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
  const [storageUrl] = useState(import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage');

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
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.items && cart.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            overflow: 'hidden',
                            borderRadius: 1,
                            mr: 2,
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={
                              item.product?.thumbnail
                                ? `${storageUrl}/${item.product.thumbnail}`
                                : '/placeholder.png'
                            }
                            alt={item.product?.name || 'Product'}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                            }}
                          />
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" component={Link} to={`/products/${item.product_id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                            {item.product?.name || 'Product'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      {item.product?.on_sale && item.product?.sale_price ? (
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                            ${Number(item.product.price).toFixed(2)}
                          </Typography>
                          <Typography variant="body1" color="error">
                            ${Number(item.product.sale_price).toFixed(2)}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body1">
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
                        >
                          <Remove fontSize="small" />
                        </IconButton>
                        <TextField
                          size="small"
                          type="number"
                          value={item.quantity}
                          InputProps={{
                            inputProps: { min: 1, style: { textAlign: 'center' } },
                          }}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          sx={{ width: 60, mx: 1 }}
                          disabled={loading}
                        />
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={loading}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="right">${Number(item.total).toFixed(2)}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="error"
                        onClick={() => removeFromCart(item.id)}
                        disabled={loading}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              component={Link}
              to="/products"
              startIcon={<ArrowBack />}
            >
              Continue Shopping
            </Button>
            <Button
              color="error"
              onClick={handleClearCartDialogOpen}
            >
              Clear Cart
            </Button>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
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