import { useState, useEffect, useCallback } from "react";
import ErrorBoundary from "../../components/common/ErrorBoundary";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import ProductCard from "../../components/common/ProductCard";
import ListProductCard from "../../components/common/ListProductCard";
import EnhancedProductCard from "../../components/common/EnhancedProductCard";
import EnhancedListProductCard from "../../components/common/EnhancedListProductCard";
import {
  Container,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Drawer,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
  Paper,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { Search, FilterList, Close, ViewList, ViewModule } from "@mui/icons-material";

const ProductList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();
  const { id: categoryId } = useParams();
  const queryParams = new URLSearchParams(location.search);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: categoryId || queryParams.get("category") || "",
    search: queryParams.get("search") || "",
    sort: queryParams.get("sort") || "newest",
    minPrice: queryParams.get("minPrice") || "",
    maxPrice: queryParams.get("maxPrice") || "",
    page: parseInt(queryParams.get("page")) || 1,
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid or list view

  const fetchData = useCallback(async () => {
    setError(null);
    setLoading(true);
    
    try {
      // Fetch categories
      try {
        const categoriesResponse = await api.categories.getAll();
        
        if (categoriesResponse?.data?.status === 'success' && 
            categoriesResponse?.data?.data?.categories) {
          setCategories(categoriesResponse.data.data.categories);
        } else {
          setCategories([]);
        }
      } catch (error) {
        setCategories([]);
      }

      // Fetch products based on filters
      let productsData = [];
      
      if (filters.category) {
        try {
          const categoryResponse = await api.categories.getById(filters.category);
          
          if (categoryResponse?.data?.status === 'success' && 
              categoryResponse?.data?.data?.category) {
            
            const categoryData = categoryResponse.data.data.category;
            setCurrentCategory(categoryData);
            
            if (categoryData.products && Array.isArray(categoryData.products)) {
              productsData = categoryData.products;
            } else {
              const productsResponse = await api.products.getAll({ 
                category_id: filters.category 
              });
              
              if (productsResponse?.data?.status === 'success' && 
                  productsResponse?.data?.data?.products) {
                productsData = productsResponse.data.data.products;
              }
            }
          }
        } catch (err) {
          setError("Failed to load category products. Please try again later.");
        }
      } else if (filters.search) {
        try {
          const response = await api.products.search(filters.search);
          
          if (response?.data?.status === 'success' && 
              response?.data?.data?.products) {
            productsData = response.data.data.products;
          }
        } catch (error) {
          setError("Failed to search products. Please try again later.");
        }
      } else {
        try {
          const response = await api.products.getAll();
          
          if (response?.data?.status === 'success' && 
              response?.data?.data?.products) {
            productsData = response.data.data.products;
          }
        } catch (error) {
          setError("Failed to load products. Please try again later.");
        }
      }

      // Process products data
      try {
        // Ensure products data is an array
        if (!Array.isArray(productsData)) {
          productsData = [];
        }
        
        let filteredProducts = [...productsData];
        
        // Apply price filters
        if (filters.minPrice) {
          filteredProducts = filteredProducts.filter(
            product => product?.price && product.price >= parseFloat(filters.minPrice)
          );
        }
        
        if (filters.maxPrice) {
          filteredProducts = filteredProducts.filter(
            product => product?.price && product.price <= parseFloat(filters.maxPrice)
          );
        }

        // Apply sorting
        if (filters.sort === "price-asc") {
          filteredProducts.sort((a, b) => (a?.price || 0) - (b?.price || 0));
        } else if (filters.sort === "price-desc") {
          filteredProducts.sort((a, b) => (b?.price || 0) - (a?.price || 0));
        } else if (filters.sort === "name-asc") {
          filteredProducts.sort((a, b) => (a?.name || '').localeCompare(b?.name || ''));
        } else if (filters.sort === "name-desc") {
          filteredProducts.sort((a, b) => (b?.name || '').localeCompare(a?.name || ''));
        } else {
          // Newest by default (id desc)
          filteredProducts.sort((a, b) => (b?.id || 0) - (a?.id || 0));
        }

        // Pagination
        const itemsPerPage = 12;
        setTotalPages(Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage)));

        const startIdx = (filters.page - 1) * itemsPerPage;
        const endIdx = startIdx + itemsPerPage;

        setProducts(filteredProducts.slice(startIdx, endIdx));
      } catch (error) {
        setProducts([]);
        setError("Failed to process products data. Please try again later.");
      }
    } catch (error) {
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [filters, categoryId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    if (name !== "page") {
      newFilters.page = 1;
    }
    setFilters(newFilters);

    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) params.set(key, val);
    });
    navigate({ search: params.toString() });
  };

  const handlePageChange = (event, value) => {
    handleFilterChange("page", value);
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleReset = () => {
    setError(null);
    setLoading(false);
    setFilters({
      category: categoryId || "",
      search: "",
      sort: "newest",
      minPrice: "",
      maxPrice: "",
      page: 1,
    });
    setTimeout(() => {
      fetchData();
    }, 100);
  };

  return (
    <ErrorBoundary onReset={handleReset}>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold', 
            position: 'relative',
            display: 'inline-block'
          }}
        >
          <Box 
            component="span"
            sx={{
              position: 'absolute',
              height: '8px',
              width: '40%',
              bottom: '8px',
              left: 0,
              backgroundColor: 'primary.light',
              opacity: 0.3,
              zIndex: -1
            }}
          />
          {currentCategory ? currentCategory.name : "Products"}
        </Typography>
        
        {currentCategory && currentCategory.description && (
          <Typography variant="body1" paragraph>
            {currentCategory.description}
          </Typography>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "space-between",
            mb: 3,
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              width: "100%",
              flexWrap: "wrap"
            }}
          >
            <TextField
            label="Search Products"
            variant="outlined"
            size="small"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            InputProps={{
            startAdornment: (
            <InputAdornment position="start">
            <Search color="primary" />
            </InputAdornment>
            ),
            }}
            sx={{ 
                minWidth: "200px",
                '& .MuiOutlinedInput-root': {
                  borderRadius: '30px',
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />

            <FormControl variant="outlined" size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                label="Min Price"
                type="number"
                size="small"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                sx={{ width: 120 }}
              />
              <TextField
                label="Max Price"
                type="number"
                size="small"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                sx={{ width: 120 }}
              />
            </Box>

            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={toggleDrawer}
              sx={{ display: { xs: "flex", md: "none" } }}
            >
              More Filters
            </Button>
            
            <Button
              variant="contained"
              onClick={() => {
                handleFilterChange("minPrice", "");
                handleFilterChange("maxPrice", "");
                handleFilterChange("category", "");
                handleFilterChange("search", "");
              }}
              sx={{ 
                borderRadius: '30px',
                backgroundColor: 'grey.200',
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'grey.300',
                },
              }}
            >
              Clear Filters
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: 'center'
            }}
          >

            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewChange}
              aria-label="view mode"
              size="small"
            >
              <ToggleButton value="grid" aria-label="grid view">
                <ViewModule />
              </ToggleButton>
              <ToggleButton value="list" aria-label="list view">
                <ViewList />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        <Grid container spacing={2}>


          <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
            <Box sx={{ width: 280, p: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Filters</Typography>
                <IconButton onClick={toggleDrawer}>
                  <Close />
                </IconButton>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom>
                Additional Filters
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Price and category filters are available in the main view.
              </Typography>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  handleFilterChange("minPrice", "");
                  handleFilterChange("maxPrice", "");
                  handleFilterChange("category", "");
                  handleFilterChange("search", "");
                  if (isMobile) toggleDrawer();
                }}
              >
                Clear Filters
              </Button>
            </Box>
          </Drawer>

          <Grid item xs={12}>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "300px",
                }}
              >
                <CircularProgress />
              </Box>
            ) : error ? (
              <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
                <Alert severity="error" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
                  {error}
                </Alert>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => {
                    setError(null);
                    setLoading(true);
                    handleFilterChange("search", "");
                    handleFilterChange("minPrice", "");
                    handleFilterChange("maxPrice", "");
                    handleFilterChange("category", "");
                  }}
                  sx={{ mt: 2 }}
                >
                  Try Again
                </Button>
              </Box>
            ) : products.length > 0 ? (
              <>
                {viewMode === 'grid' ? (
                  <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
                    {products.map((product) => (
                      <Grid item xs={12} sm={6} md={4} lg={4} key={product.id}>
                        <EnhancedProductCard product={product} />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box>
                    {products.map((product) => (
                      <EnhancedListProductCard key={product.id} product={product} />
                    ))}
                  </Box>
                )}

                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={filters.page}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "300px",
                  bgcolor: "background.paper",
                  p: 4,
                  borderRadius: 3,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  border: '1px dashed',
                  borderColor: 'divider'
                }}
              >
                <Typography variant="h6" gutterBottom>
                  No products found
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Try changing your search or filter criteria
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => {
                    handleFilterChange("search", "");
                    handleFilterChange("minPrice", "");
                    handleFilterChange("maxPrice", "");
                    handleFilterChange("category", "");
                  }}
                >
                  Clear Filters
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </ErrorBoundary>
  );
};

export default ProductList;