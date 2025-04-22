import { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import apiService from '../../services/api';
import { LoadingContext } from '../../context/LoadingContext';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  CircularProgress,
  Pagination,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Breadcrumbs,
  Link as MuiLink,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Drawer,
  Divider,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  useMediaQuery,
  Alert,
  IconButton,
  InputAdornment,
  Skeleton,
  Paper,
  Stack
} from '@mui/material';
import {
  Search,
  FilterList,
  GridView,
  ViewList,
  Close,
  NavigateNext,
  ArrowUpward,
  ArrowDownward,
  SortRounded,
  FilterAltOutlined,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import EnhancedProductCard from '../../components/common/EnhancedProductCard';
import EnhancedListProductCard from '../../components/common/EnhancedListProductCard';

const ProductList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { id: categoryId } = useParams();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { showLoading, hideLoading } = useContext(LoadingContext);
  
  // STATE MANAGEMENT
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  
  // PAGINATION
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [perPage, setPerPage] = useState(12);
  
  // FILTER AND SORT OPTIONS
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  
  // Extract query parameters on component mount and location change
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    
    // Extract filters from URL
    const query = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'newest';
    const categoryIds = searchParams.get('categories') ? searchParams.get('categories').split(',') : [];
    const minPrice = searchParams.get('min_price') ? parseInt(searchParams.get('min_price')) : 0;
    const maxPrice = searchParams.get('max_price') ? parseInt(searchParams.get('max_price')) : 5000;
    const inStock = searchParams.get('in_stock') === 'true';
    const onSale = searchParams.get('on_sale') === 'true';
    const view = searchParams.get('view') || 'grid';
    const currentPage = searchParams.get('page') ? parseInt(searchParams.get('page')) : 1;
    const itemsPerPage = searchParams.get('per_page') ? parseInt(searchParams.get('per_page')) : 12;
    
    // Update state with URL parameters
    setSearchQuery(query);
    setSortOption(sort);
    setSelectedCategories(categoryIds);
    setPriceRange([minPrice, maxPrice]);
    setInStockOnly(inStock);
    setOnSaleOnly(onSale);
    setViewMode(view);
    setPage(currentPage);
    setPerPage(itemsPerPage);
  }, [location.search]);
  
  // Fetch all categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.categories.getAll();
        // Handle differences in API response structure
        const categoriesData = response.data?.data?.categories || response.data?.categories || [];
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please refresh the page.');
      }
    };
    
    fetchCategories();
  }, []);
  
  // Fetch products when filters, sort, pagination, or category changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      const queryParams = {
        page,
        per_page: perPage
      };
      
      // Add search query if present
      if (searchQuery.trim()) {
        queryParams.search = searchQuery.trim();
      }
      
      // Add sort options
      switch (sortOption) {
        case 'newest':
          queryParams.sort_by = 'created_at';
          queryParams.sort_dir = 'desc';
          break;
        case 'oldest':
          queryParams.sort_by = 'created_at';
          queryParams.sort_dir = 'asc';
          break;
        case 'price_asc':
          queryParams.sort_by = 'price';
          queryParams.sort_dir = 'asc';
          break;
        case 'price_desc':
          queryParams.sort_by = 'price';
          queryParams.sort_dir = 'desc';
          break;
        case 'name_asc':
          queryParams.sort_by = 'name';
          queryParams.sort_dir = 'asc';
          break;
        case 'name_desc':
          queryParams.sort_by = 'name';
          queryParams.sort_dir = 'desc';
          break;
        case 'popularity':
          queryParams.sort_by = 'popularity';
          queryParams.sort_dir = 'desc';
          break;
        case 'rating':
          queryParams.sort_by = 'average_rating';
          queryParams.sort_dir = 'desc';
          break;
      }
      
      // Add price range
      if (priceRange[0] > 0) {
        queryParams.min_price = priceRange[0];
      }
      if (priceRange[1] < 5000) {
        queryParams.max_price = priceRange[1];
      }
      
      // Add category filter
      if (categoryId) {
        queryParams.category_id = categoryId;
      } else if (selectedCategories.length > 0) {
        queryParams.categories = selectedCategories.join(',');
      }
      
      // Add stock and sale filters
      if (inStockOnly) {
        queryParams.in_stock = true;
      }
      if (onSaleOnly) {
        queryParams.on_sale = true;
      }
      
      try {
        showLoading();
        
        // Fetch the current category details if categoryId is provided
        if (categoryId) {
          try {
            const categoryResponse = await apiService.categories.getById(categoryId);
            const categoryData = categoryResponse.data?.data?.category || categoryResponse.data?.category;
            setCurrentCategory(categoryData);
          } catch (err) {
            console.error('Error fetching category details:', err);
          }
        } else {
          setCurrentCategory(null);
        }
        
        // Fetch products
        const response = await apiService.products.getAll(queryParams);
        
        // Handle different API response structures
        const productsData = response.data?.data?.products || response.data?.products || [];
        const meta = response.data?.meta || response.data?.data?.meta || {};
        
        setProducts(productsData);
        setTotalPages(meta.last_page || 1);
        setTotalProducts(meta.total || productsData.length);
        
        // Update URL with current filters without causing a navigation
        updateUrl();
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setProducts([]);
        setTotalPages(1);
        setTotalProducts(0);
      } finally {
        setLoading(false);
        hideLoading();
      }
    };
    
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page, 
    perPage, 
    sortOption, 
    categoryId, 
    // Intentionally excluding the following filters to prevent auto-fetch
    // They will only be applied when the "Apply Filters" button is clicked
    // searchQuery,
    // priceRange,
    // selectedCategories,
    // inStockOnly,
    // onSaleOnly
  ]);
  
  // Helper function to update URL with current filters
  const updateUrl = () => {
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (sortOption !== 'newest') params.set('sort', sortOption);
    if (selectedCategories.length > 0) params.set('categories', selectedCategories.join(','));
    if (priceRange[0] > 0) params.set('min_price', priceRange[0].toString());
    if (priceRange[1] < 5000) params.set('max_price', priceRange[1].toString());
    if (inStockOnly) params.set('in_stock', 'true');
    if (onSaleOnly) params.set('on_sale', 'true');
    if (viewMode !== 'grid') params.set('view', viewMode);
    if (page > 1) params.set('page', page.toString());
    if (perPage !== 12) params.set('per_page', perPage.toString());
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  };
  
  // Handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle view mode change
  const handleViewModeChange = (event, newViewMode) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
      const params = new URLSearchParams(location.search);
      params.set('view', newViewMode);
      navigate(`${location.pathname}?${params.toString()}`);
    }
  };
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
    const params = new URLSearchParams(location.search);
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    navigate(`${location.pathname}?${params.toString()}`);
  };
  
  // Handle sort change
  const handleSortChange = (event) => {
    const newSortOption = event.target.value;
    setSortOption(newSortOption);
    setPage(1); // Reset to first page on sort change
    
    const params = new URLSearchParams(location.search);
    params.set('sort', newSortOption);
    params.set('page', '1');
    navigate(`${location.pathname}?${params.toString()}`);
  };
  
  // Handle "per page" change
  const handlePerPageChange = (event) => {
    const newPerPage = event.target.value;
    setPerPage(newPerPage);
    setPage(1); // Reset to first page when changing items per page
    
    const params = new URLSearchParams(location.search);
    params.set('per_page', newPerPage.toString());
    params.set('page', '1');
    navigate(`${location.pathname}?${params.toString()}`);
  };
  
  // Handle price range change
  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
  };
  
  // Handle category selection
  const handleCategoryChange = (categoryId) => {
    const currentIndex = selectedCategories.indexOf(categoryId);
    const newSelectedCategories = [...selectedCategories];
    
    if (currentIndex === -1) {
      newSelectedCategories.push(categoryId);
    } else {
      newSelectedCategories.splice(currentIndex, 1);
    }
    
    setSelectedCategories(newSelectedCategories);
  };
  
  // Apply all filters
  const applyFilters = () => {
    setPage(1); // Reset to first page when applying filters
    setFilterDrawerOpen(false); // Close filter drawer on mobile
    
    const params = new URLSearchParams(location.search);
    
    // Update search params with current filter values
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    } else {
      params.delete('search');
    }
    
    if (selectedCategories.length > 0) {
      params.set('categories', selectedCategories.join(','));
    } else {
      params.delete('categories');
    }
    
    if (priceRange[0] > 0) {
      params.set('min_price', priceRange[0].toString());
    } else {
      params.delete('min_price');
    }
    
    if (priceRange[1] < 5000) {
      params.set('max_price', priceRange[1].toString());
    } else {
      params.delete('max_price');
    }
    
    if (inStockOnly) {
      params.set('in_stock', 'true');
    } else {
      params.delete('in_stock');
    }
    
    if (onSaleOnly) {
      params.set('on_sale', 'true');
    } else {
      params.delete('on_sale');
    }
    
    params.set('page', '1');
    navigate(`${location.pathname}?${params.toString()}`);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setPriceRange([0, 5000]);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setPage(1);
    
    // Clear all filter params from URL
    const params = new URLSearchParams();
    params.set('sort', sortOption); // Keep current sort
    params.set('view', viewMode); // Keep current view mode
    params.set('per_page', perPage.toString()); // Keep current per page
    navigate(`${location.pathname}?${params.toString()}`);
  };
  
  // Calculate active filter count for badge
  const activeFilterCount = 
    (searchQuery.trim() ? 1 : 0) +
    (selectedCategories.length > 0 ? 1 : 0) +
    ((priceRange[0] > 0 || priceRange[1] < 5000) ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (onSaleOnly ? 1 : 0);
    
  // Format price with currency
  const formatPrice = (price) => {
    return `$${price}`;
  };
  
  // Generate skeleton placeholders when loading
  const renderSkeletons = () => {
    return Array(perPage).fill(0).map((_, index) => (
      <Grid item xs={12} sm={6} md={4} lg={viewMode === 'grid' ? 3 : 4} key={`skeleton-${index}`}>
        <Skeleton 
          variant="rectangular" 
          height={viewMode === 'grid' ? 300 : 200} 
          sx={{ borderRadius: 2, mb: 1 }}
        />
        <Skeleton width="60%" height={24} sx={{ mb: 1 }}/>
        <Skeleton width="40%" height={20} sx={{ mb: 1 }}/>
        <Skeleton width="30%" height={20} />
      </Grid>
    ));
  };
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNext fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <MuiLink 
          component={Link} 
          to="/" 
          color="inherit" 
          underline="hover"
          sx={{ cursor: 'pointer' }}
        >
          Home
        </MuiLink>
        <MuiLink 
          component={Link} 
          to="/products" 
          color="inherit" 
          underline="hover"
          sx={{ cursor: 'pointer' }}
        >
          Products
        </MuiLink>
        {currentCategory && (
          <Typography color="text.primary">
            {currentCategory.name}
          </Typography>
        )}
      </Breadcrumbs>
      
      {/* Page Title */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            mb: 2, 
            fontWeight: 600,
            position: 'relative',
            display: 'inline-block',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60px',
              height: '3px',
              backgroundColor: 'primary.main',
              borderRadius: '2px'
            }
          }}
        >
          {currentCategory 
            ? `${currentCategory.name}` 
            : (searchQuery.trim() 
                ? `Search Results for "${searchQuery}"` 
                : 'All Products')}
        </Typography>
        
        {currentCategory && currentCategory.description && (
          <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
            {currentCategory.description}
          </Typography>
        )}
      </Box>
      
      {/* Filters and Controls */}
      <Paper 
        elevation={1} 
        sx={{ 
          mb: 4, 
          p: 3, 
          borderRadius: 3, 
          backgroundColor: '#fff',
          boxShadow: 'rgba(149, 157, 165, 0.1) 0px 8px 24px' 
        }}
      >
        <Grid container spacing={2} alignItems="center">
          {/* Search Bar */}
          <Grid item xs={12} md={4}>
            <form onSubmit={handleSearch}>
              <TextField 
                fullWidth
                variant="outlined"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="clear search"
                        onClick={() => {
                          setSearchQuery('');
                          const params = new URLSearchParams(location.search);
                          params.delete('search');
                          navigate(`${location.pathname}?${params.toString()}`);
                        }}
                        edge="end"
                        size="small"
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2 }
                }}
                size="small"
              />
            </form>
          </Grid>
          
          {/* Filter Button (Mobile) */}
          <Grid item xs={6} sm={3} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterAltOutlined />}
              endIcon={activeFilterCount > 0 && (
                <Chip 
                  label={activeFilterCount} 
                  size="small" 
                  color="primary"
                  sx={{ height: 20, minWidth: 20 }}
                />
              )}
              onClick={() => setFilterDrawerOpen(true)}
              sx={{ 
                borderRadius: 2,
                display: { xs: 'flex', lg: 'none' },
                justifyContent: 'space-between',
                px: 2,
                borderColor: activeFilterCount > 0 ? 'primary.main' : 'divider'
              }}
            >
              Filters
            </Button>
          </Grid>
          
          {/* Sort Dropdown */}
          <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="sort-label" sx={{ backgroundColor: 'white', px: 1 }}>Sort By</InputLabel>
              <Select
                labelId="sort-label"
                value={sortOption}
                onChange={handleSortChange}
                sx={{ borderRadius: 2 }}
                startAdornment={<SortRounded sx={{ mr: 1, ml: -0.5, color: 'action.active' }} />}
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
                <MenuItem value="price_asc">Price: Low to High</MenuItem>
                <MenuItem value="price_desc">Price: High to Low</MenuItem>
                <MenuItem value="name_asc">Name: A to Z</MenuItem>
                <MenuItem value="name_desc">Name: Z to A</MenuItem>
                <MenuItem value="popularity">Popularity</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {/* Items Per Page */}
          <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="per-page-label" sx={{ backgroundColor: 'white', px: 1 }}>Per Page</InputLabel>
              <Select
                labelId="per-page-label"
                value={perPage}
                onChange={handlePerPageChange}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value={12}>12 Items</MenuItem>
                <MenuItem value={24}>24 Items</MenuItem>
                <MenuItem value={48}>48 Items</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {/* View Mode Toggle */}
          <Grid item xs={6} sm={3} md={2}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              aria-label="view mode"
              fullWidth
              sx={{ 
                height: 40, 
                '& .MuiToggleButton-root': {
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider'
                }
              }}
            >
              <ToggleButton value="grid" aria-label="grid view">
                <GridView />
              </ToggleButton>
              <ToggleButton value="list" aria-label="list view">
                <ViewList />
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          {searchQuery && (
            <Chip 
              label={`Search: ${searchQuery}`} 
              onDelete={() => {
                setSearchQuery('');
                const params = new URLSearchParams(location.search);
                params.delete('search');
                navigate(`${location.pathname}?${params.toString()}`);
              }}
              sx={{ borderRadius: 2 }}
            />
          )}
          
          {selectedCategories.length > 0 && (
            <Chip 
              label={`Categories: ${selectedCategories.length} selected`} 
              onDelete={() => {
                setSelectedCategories([]);
                const params = new URLSearchParams(location.search);
                params.delete('categories');
                navigate(`${location.pathname}?${params.toString()}`);
              }}
              sx={{ borderRadius: 2 }}
            />
          )}
          
          {(priceRange[0] > 0 || priceRange[1] < 5000) && (
            <Chip 
              label={`Price: ${formatPrice(priceRange[0])} - ${formatPrice(priceRange[1])}`} 
              onDelete={() => {
                setPriceRange([0, 5000]);
                const params = new URLSearchParams(location.search);
                params.delete('min_price');
                params.delete('max_price');
                navigate(`${location.pathname}?${params.toString()}`);
              }}
              sx={{ borderRadius: 2 }}
            />
          )}
          
          {inStockOnly && (
            <Chip 
              label="In Stock Only" 
              onDelete={() => {
                setInStockOnly(false);
                const params = new URLSearchParams(location.search);
                params.delete('in_stock');
                navigate(`${location.pathname}?${params.toString()}`);
              }}
              sx={{ borderRadius: 2 }}
            />
          )}
          
          {onSaleOnly && (
            <Chip 
              label="On Sale Only" 
              onDelete={() => {
                setOnSaleOnly(false);
                const params = new URLSearchParams(location.search);
                params.delete('on_sale');
                navigate(`${location.pathname}?${params.toString()}`);
              }}
              sx={{ borderRadius: 2 }}
            />
          )}
          
          <Chip 
            label="Clear All Filters" 
            onClick={resetFilters}
            sx={{ borderRadius: 2, fontWeight: 'bold' }}
          />
        </Box>
      )}
      
      {/* Content */}
      <Grid container spacing={3}>
        {/* Desktop Filters Sidebar */}
        <Grid item xs={3} sx={{ display: { xs: 'none', lg: 'block' } }}>
          <Paper 
            elevation={1} 
            sx={{ 
              p: 3, 
              borderRadius: 3, 
              position: 'sticky', 
              top: 20,
              backgroundColor: '#fff',
              boxShadow: 'rgba(149, 157, 165, 0.1) 0px 8px 24px'
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterList />
              Filters
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            {/* Price Range */}
            <Typography variant="subtitle1" gutterBottom>
              Price Range
            </Typography>
            <Box sx={{ px: 1, pt: 1, pb: 3 }}>
              <Slider
                value={priceRange}
                onChange={handlePriceRangeChange}
                min={0}
                max={5000}
                step={10}
                valueLabelDisplay="auto"
                valueLabelFormat={formatPrice}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  ${priceRange[0]}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ${priceRange[1]}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            
            {/* Categories */}
            <Typography variant="subtitle1" gutterBottom>
              Categories
            </Typography>
            <FormGroup sx={{ ml: 1, mt: 1 }}>
              {categories.map((category) => (
                <FormControlLabel
                  key={category.id}
                  control={
                    <Checkbox
                      checked={selectedCategories.includes(category.id.toString())}
                      onChange={() => handleCategoryChange(category.id.toString())}
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="body2">
                      {category.name}
                      {/* Could add product count if available in API */}
                      {/* {category.product_count && ` (${category.product_count})`} */}
                    </Typography>
                  }
                />
              ))}
            </FormGroup>
            <Divider sx={{ my: 2 }} />
            
            {/* Additional Filters */}
            <Typography variant="subtitle1" gutterBottom>
              Additional Filters
            </Typography>
            <FormGroup sx={{ ml: 1, mt: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    size="small"
                  />
                }
                label={<Typography variant="body2">In Stock Only</Typography>}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={onSaleOnly}
                    onChange={(e) => setOnSaleOnly(e.target.checked)}
                    size="small"
                  />
                }
                label={<Typography variant="body2">On Sale Only</Typography>}
              />
            </FormGroup>
            <Divider sx={{ my: 2 }} />
            
            {/* Apply/Reset buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={resetFilters}
                fullWidth
                sx={{ borderRadius: 2 }}
              >
                Reset
              </Button>
              <Button 
                variant="contained" 
                onClick={applyFilters}
                fullWidth
                sx={{ borderRadius: 2 }}
              >
                Apply Filters
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Products Grid */}
        <Grid item xs={12} lg={9}>
          {/* Product Count and Results Info */}
          {!loading && (
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1">
                Showing {products.length} of {totalProducts} products
              </Typography>
              
              {viewMode === 'grid' ? (
                <Typography variant="body2" color="text.secondary">
                  Page {page} of {totalPages}
                </Typography>
              ) : null}
            </Box>
          )}
          
          {/* Error message */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {/* Loading skeletons */}
          {loading && (
            <Grid container spacing={3}>
              {renderSkeletons()}
            </Grid>
          )}
          
          {/* No results message */}
          {!loading && products.length === 0 && (
            <Paper 
              elevation={1}
              sx={{ 
                p: 4, 
                borderRadius: 3, 
                textAlign: 'center',
                backgroundColor: '#fff',
                boxShadow: 'rgba(149, 157, 165, 0.1) 0px 8px 24px'
              }}
            >
              <Typography variant="h6" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Try adjusting your search or filter criteria.
              </Typography>
              <Button 
                variant="contained" 
                onClick={resetFilters}
                sx={{ mt: 2, borderRadius: 2 }}
              >
                Reset All Filters
              </Button>
            </Paper>
          )}
          
          {/* Products Grid View */}
          {!loading && products.length > 0 && viewMode === 'grid' && (
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={4} key={product.id}>
                  <EnhancedProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          )}
          
          {/* Products List View */}
          {!loading && products.length > 0 && viewMode === 'list' && (
            <Stack spacing={3}>
              {products.map((product) => (
                <EnhancedListProductCard key={product.id} product={product} />
              ))}
            </Stack>
          )}
          
          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange} 
                color="primary"
                showFirstButton
                showLastButton
                size={isMobile ? "medium" : "large"}
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Box>
          )}
        </Grid>
      </Grid>
      
      {/* Mobile Drawer for Filters */}
      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 350 }, p: 3 }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterList />
            Filters
          </Typography>
          <IconButton onClick={() => setFilterDrawerOpen(false)}>
            <Close />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        {/* Price Range */}
        <Typography variant="subtitle1" gutterBottom>
          Price Range
        </Typography>
        <Box sx={{ px: 1, pt: 1, pb: 3 }}>
          <Slider
            value={priceRange}
            onChange={handlePriceRangeChange}
            min={0}
            max={5000}
            step={10}
            valueLabelDisplay="auto"
            valueLabelFormat={formatPrice}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              ${priceRange[0]}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ${priceRange[1]}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        
        {/* Categories */}
        <Typography variant="subtitle1" gutterBottom>
          Categories
        </Typography>
        <FormGroup sx={{ ml: 1, mt: 1 }}>
          {categories.map((category) => (
            <FormControlLabel
              key={category.id}
              control={
                <Checkbox
                  checked={selectedCategories.includes(category.id.toString())}
                  onChange={() => handleCategoryChange(category.id.toString())}
                  size="small"
                />
              }
              label={
                <Typography variant="body2">
                  {category.name}
                  {/* Could add product count if available in API */}
                  {/* {category.product_count && ` (${category.product_count})`} */}
                </Typography>
              }
            />
          ))}
        </FormGroup>
        <Divider sx={{ my: 2 }} />
        
        {/* Additional Filters */}
        <Typography variant="subtitle1" gutterBottom>
          Additional Filters
        </Typography>
        <FormGroup sx={{ ml: 1, mt: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                size="small"
              />
            }
            label={<Typography variant="body2">In Stock Only</Typography>}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={onSaleOnly}
                onChange={(e) => setOnSaleOnly(e.target.checked)}
                size="small"
              />
            }
            label={<Typography variant="body2">On Sale Only</Typography>}
          />
        </FormGroup>
        <Divider sx={{ my: 2 }} />
        
        {/* Apply/Reset buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <Button 
            variant="contained" 
            onClick={applyFilters}
            fullWidth
            sx={{ borderRadius: 2 }}
          >
            Apply Filters
          </Button>
          <Button 
            variant="outlined" 
            onClick={resetFilters}
            fullWidth
            sx={{ borderRadius: 2 }}
          >
            Reset All Filters
          </Button>
        </Box>
      </Drawer>
    </Container>
  );
};

export default ProductList;