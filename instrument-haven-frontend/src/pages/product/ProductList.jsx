import { useState, useEffect, useCallback } from "react";
import ErrorBoundary from "../../components/common/ErrorBoundary";
import { debugLog, safelyExtractData } from "../../utils/debugHelper";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import ProductCard from "../../components/common/ProductCard";
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
  Checkbox,
  FormGroup,
  FormControlLabel,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
  Paper,
  Alert,
} from "@mui/material";
import { Search, FilterList, Close } from "@mui/icons-material";

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

  // Define the fetchData function using useCallback
  const fetchData = useCallback(async () => {
    // Reset state before fetching
    setError(null);
    setLoading(true);
    
    try {
      // Fetch categories
      try {
        const categoriesResponse = await api.categories.getAll();
        console.log('Categories response:', categoriesResponse);
        
        // Handle empty response
        if (!categoriesResponse || !categoriesResponse.data) {
          setCategories([]);
          return;
        }
        
        // Standardize data extraction
        let categoriesData = [];
        
        if (Array.isArray(categoriesResponse.data)) {
          categoriesData = categoriesResponse.data;
        } else if (categoriesResponse.data.categories && Array.isArray(categoriesResponse.data.categories)) {
          categoriesData = categoriesResponse.data.categories;
        } else if (categoriesResponse.data.data && Array.isArray(categoriesResponse.data.data)) {
          categoriesData = categoriesResponse.data.data;
        } else if (categoriesResponse.data.data && categoriesResponse.data.data.categories && 
                 Array.isArray(categoriesResponse.data.data.categories)) {
          categoriesData = categoriesResponse.data.data.categories;
        }
            
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }

      // Fetch products based on filters
      // Ensure productsData is initialized as an array
      let productsData = [];
      
      if (filters.category) {
        // Get category details and its products
        try {
          const categoryResponse = await api.categories.getById(filters.category);
          console.log('Category response:', categoryResponse);
          
          // Extract category data with improved path handling
          let categoryData = null;
          
          if (categoryResponse.data && categoryResponse.data.data && categoryResponse.data.data.category) {
            categoryData = categoryResponse.data.data.category;
          } else if (categoryResponse.data && categoryResponse.data.category) {
            categoryData = categoryResponse.data.category;
          } else if (categoryResponse.data && categoryResponse.data.data) {
            categoryData = categoryResponse.data.data;
          } else if (categoryResponse.data) {
            categoryData = categoryResponse.data;
          }
          
          setCurrentCategory(categoryData);
          
          // Check if products are included in the response with improved path handling
          if (categoryData && categoryData.products && Array.isArray(categoryData.products)) {
            productsData = categoryData.products;
          } else {
            // Fallback to getting all products and filtering by category
            const allProductsResponse = await api.products.getAll({ category_id: filters.category });
            console.log('All products response with category filter:', allProductsResponse);
            
            // Improved data extraction
            if (allProductsResponse.data && allProductsResponse.data.data && 
                allProductsResponse.data.data.products && Array.isArray(allProductsResponse.data.data.products)) {
              productsData = allProductsResponse.data.data.products;
            } else if (allProductsResponse.data && allProductsResponse.data.products && 
                Array.isArray(allProductsResponse.data.products)) {
              productsData = allProductsResponse.data.products;
            } else if (allProductsResponse.data && allProductsResponse.data.data && 
                Array.isArray(allProductsResponse.data.data)) {
              productsData = allProductsResponse.data.data;
            } else if (Array.isArray(allProductsResponse.data)) {
              productsData = allProductsResponse.data;
            }
            
            // Additional safety filter
            productsData = productsData.filter(
              product => product && product.category_id && product.category_id.toString() === filters.category
            );
          }
        } catch (err) {
          console.error("Error fetching category details:", err);
          // Fallback to direct products API call with category filter
          try {
            const allProductsResponse = await api.products.getAll({ category_id: filters.category });
            console.log('All products response (fallback):', allProductsResponse);
            
            // Improved data extraction for fallback
            if (allProductsResponse.data && allProductsResponse.data.data && 
                allProductsResponse.data.data.products && Array.isArray(allProductsResponse.data.data.products)) {
              productsData = allProductsResponse.data.data.products;
            } else if (allProductsResponse.data && allProductsResponse.data.products && 
                Array.isArray(allProductsResponse.data.products)) {
              productsData = allProductsResponse.data.products;
            } else if (allProductsResponse.data && allProductsResponse.data.data && 
                Array.isArray(allProductsResponse.data.data)) {
              productsData = allProductsResponse.data.data;
            } else if (Array.isArray(allProductsResponse.data)) {
              productsData = allProductsResponse.data;
            }
            
            // Additional safety filter
            // Safely filter products with defensive null checks
            productsData = Array.isArray(productsData) ? productsData.filter(
              product => product && product.category_id && product.category_id.toString() === filters.category
            ) : [];
          } catch (error) {
            console.error("Error in fallback product fetch:", error);
            setError("Failed to load products. Please try again later.");
          }
        }
      } else if (filters.search) {
        try {
          const response = await api.products.search(filters.search);
          console.log('Search products response:', response);
          
          // Improved data extraction for search results
          if (response.data && response.data.data && response.data.data.products && 
              Array.isArray(response.data.data.products)) {
            productsData = response.data.data.products;
          } else if (response.data && response.data.products && Array.isArray(response.data.products)) {
            productsData = response.data.products;
          } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
            productsData = response.data.data;
          } else if (Array.isArray(response.data)) {
            productsData = response.data;
          }
        } catch (error) {
          console.error("Error searching products:", error);
          setError("Failed to search products. Please try again later.");
        }
      } else {
        try {
          const response = await api.products.getAll();
          console.log('All products response:', response);
          
          // Improved data extraction for all products
          if (response.data && response.data.data && response.data.data.products && 
              Array.isArray(response.data.data.products)) {
            productsData = response.data.data.products;
          } else if (response.data && response.data.products && Array.isArray(response.data.products)) {
            productsData = response.data.products;
          } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
            productsData = response.data.data;
          } else if (Array.isArray(response.data)) {
            productsData = response.data;
          }
        } catch (error) {
          console.error("Error fetching all products:", error);
          setError("Failed to load products. Please try again later.");
        }
      }

      // Apply price filters
      let filteredProducts = [...productsData];
      if (filters.minPrice) {
        filteredProducts = filteredProducts.filter(
          (product) => product.price >= parseFloat(filters.minPrice)
        );
      }
      if (filters.maxPrice) {
        filteredProducts = filteredProducts.filter(
          (product) => product.price <= parseFloat(filters.maxPrice)
        );
      }

      // Apply sorting
      if (filters.sort === "price-asc") {
        filteredProducts.sort((a, b) => a.price - b.price);
      } else if (filters.sort === "price-desc") {
        filteredProducts.sort((a, b) => b.price - a.price);
      } else if (filters.sort === "name-asc") {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      } else if (filters.sort === "name-desc") {
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
      } else {
        // Newest by default (id desc)
        filteredProducts.sort((a, b) => b.id - a.id);
      }

      // Pagination
      const itemsPerPage = 12;
      setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage));

      const startIdx = (filters.page - 1) * itemsPerPage;
      const endIdx = startIdx + itemsPerPage;

      setProducts(filteredProducts.slice(startIdx, endIdx));
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [filters, categoryId]);

  // Call fetchData when component mounts or when fetchData changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    if (name !== "page") {
      newFilters.page = 1; // Reset to page 1 when changing filters
    }
    setFilters(newFilters);

    // Update URL
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) params.set(key, val);
    });
    navigate({ search: params.toString() });
  };

  const handlePageChange = (event, value) => {
    handleFilterChange("page", value);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Reset handler for error boundary
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
  // Trigger refetch
  setTimeout(() => {
    fetchData();
  }, 100);
};

return (
  <ErrorBoundary onReset={handleReset}>
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {currentCategory ? currentCategory.name : "Products"}
      </Typography>
      
      {currentCategory && currentCategory.description && (
        <Typography variant="body1" paragraph>
          {currentCategory.description}
        </Typography>
      )}

      {/* Filter Bar */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "stretch", md: "center" },
          justifyContent: "space-between",
          mb: 4,
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            width: { xs: "100%", md: "auto" },
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
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: "200px" }}
          />

          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={toggleDrawer}
            sx={{ display: { xs: "flex", md: "none" } }}
          >
            Filters
          </Button>
        </Box>

        <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={filters.sort}
            onChange={(e) => handleFilterChange("sort", e.target.value)}
            label="Sort By"
          >
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="price-asc">Price: Low to High</MenuItem>
            <MenuItem value="price-desc">Price: High to Low</MenuItem>
            <MenuItem value="name-asc">Name: A to Z</MenuItem>
            <MenuItem value="name-desc">Name: Z to A</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={2}>
        {/* Desktop Filters */}
        <Grid item md={3} sx={{ display: { xs: "none", md: "block" } }}>
          <Paper sx={{ p: 2, borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Categories
            </Typography>
            <List dense>
              <ListItem
                disablePadding
                selected={filters.category === ""}
                onClick={() => handleFilterChange("category", "")}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                  pl: 2,
                  pr: 2,
                  py: 1,
                  borderRadius: 1
                }}
              >
                <ListItemText primary="All Categories" />
              </ListItem>
              {categories.map((category) => (
                <ListItem
                  disablePadding
                  key={category.id}
                  selected={filters.category === category.id.toString()}
                  onClick={() =>
                    handleFilterChange("category", category.id.toString())
                  }
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                    pl: 2,
                    pr: 2,
                    py: 1,
                    borderRadius: 1
                  }}
                >
                  <ListItemText primary={category.name} />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Price Range
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <TextField
                label="Min"
                type="number"
                size="small"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Max"
                type="number"
                size="small"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Box>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                handleFilterChange("minPrice", "");
                handleFilterChange("maxPrice", "");
                handleFilterChange("category", "");
                handleFilterChange("search", "");
              }}
            >
              Clear Filters
            </Button>
          </Paper>
        </Grid>

        {/* Mobile Filters Drawer */}
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
              Categories
            </Typography>
            <List dense>
              <ListItem
                disablePadding
                selected={filters.category === ""}
                onClick={() => {
                  handleFilterChange("category", "");
                  if (isMobile) toggleDrawer();
                }}
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                  pl: 2,
                  pr: 2,
                  py: 1,
                  borderRadius: 1
                }}
              >
                <ListItemText primary="All Categories" />
              </ListItem>
              {categories.map((category) => (
                <ListItem
                  disablePadding
                  key={category.id}
                  selected={filters.category === category.id.toString()}
                  onClick={() => {
                    handleFilterChange("category", category.id.toString());
                    if (isMobile) toggleDrawer();
                  }}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                    pl: 2,
                    pr: 2,
                    py: 1,
                    borderRadius: 1
                  }}
                >
                  <ListItemText primary={category.name} />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Price Range
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <TextField
                label="Min"
                type="number"
                size="small"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Max"
                type="number"
                size="small"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Box>

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

        {/* Products Grid */}
        <Grid item xs={12} md={9}>
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
              <Grid container spacing={3}>
                {products.map((product) => (
                  <Grid item xs={12} md={4} key={product.id}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>

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
                borderRadius: 1,
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