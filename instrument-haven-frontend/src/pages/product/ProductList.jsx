import { useState, useEffect, useCallback } from "react";
import ErrorBoundary from "../../components/common/ErrorBoundary";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import api from "../../services/api";
import EnhancedProductCard from "../../components/common/EnhancedProductCard";
import EnhancedListProductCard from "../../components/common/EnhancedListProductCard";
import { getCategoryImage } from "../../components/common/constants";
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
import { Search, FilterList, Close, ViewList, ViewModule, Category } from "@mui/icons-material";

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
      <Container maxWidth="xl" sx={{ py: 5, px: { xs: 2, sm: 4, md: 6 } }}>
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

            <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                label="Category"
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 400,
                      '& .MuiMenuItem-root': {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        py: 1,
                      },
                    },
                  },
                }}
              >
                <MenuItem value="">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: '8px',
                        bgcolor: 'rgba(255, 43, 82, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Category fontSize="small" sx={{ color: 'primary.main' }} />
                    </Box>
                    <Typography>All Categories</Typography>
                  </Box>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id.toString()}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 30,
                          height: 30,
                          borderRadius: '8px',
                          overflow: 'hidden',
                          flexShrink: 0,
                          bgcolor: 'rgba(255, 43, 82, 0.05)',
                        }}
                      >
                          <img
                            src={getCategoryImage({name: category.name})}
                            alt={category.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                      </Box>
                      <Typography>{category.name}</Typography>
                    </Box>
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
            <Box sx={{ width: 320, p: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Filters</Typography>
                <IconButton onClick={toggleDrawer}>
                  <Close />
                </IconButton>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <Category fontSize="small" sx={{ mr: 1 }} /> Categories
              </Typography>
              
              <Box sx={{ mt: 2, mb: 4 }}>
                <Box 
                  sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: 1.5 
                  }}
                >
                  {categories.slice(0, 6).map((category) => {
                    // Dynamically determine color based on ID
                    const bgColor = category.id % 2 === 0 
                      ? 'rgba(255, 43, 82, 0.04)' 
                      : 'rgba(255, 107, 135, 0.04)';
                    
                    return (
                      <Box
                        key={category.id}
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          bgcolor: bgColor,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: 'rgba(255, 43, 82, 0.08)',
                            transform: 'translateY(-2px)'
                          },
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                        onClick={() => {
                          handleFilterChange("category", category.id.toString());
                          toggleDrawer();
                        }}
                      >
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: 1,
                            overflow: 'hidden',
                            flexShrink: 0
                          }}
                        >
                          <img
                            src={getCategoryImage({name: category.name})}
                            alt={category.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Box>
                        <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                          {category.name}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
                
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button 
                    component={Link}
                    to="/categories"
                    size="small"
                    startIcon={<Category fontSize="small" />}
                    sx={{ 
                      mt: 1,
                      color: 'primary.main',
                      borderRadius: 10,
                      bgcolor: 'rgba(255, 43, 82, 0.08)'
                    }}
                  >
                    View All Categories
                  </Button>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom>
                Additional Filters
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
                sx={{ mt: 2, borderRadius: 10 }}
              >
                Clear All Filters
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
              <Typography variant="body1" color="error" align="center" sx={{ my: 4 }}>
                {error}
              </Typography>
            ) : products.length > 0 ? (
              <>
                {viewMode === 'grid' ? (
                  <Box sx={{ p: 3 }}>
                    <Grid container spacing={8} sx={{ mt: 2, mb: 4 }}>
                      {products.map((product) => (
                        <Grid 
                          item 
                          xs={12} 
                          sm={6} 
                          md={4}
                          key={product.id} 
                          sx={{ 
                            mb: 6, 
                            p: { xs: 2, sm: 3 },
                            display: 'flex',
                            justifyContent: 'center'
                          }}
                        >
                          <Box sx={{ width: '100%', maxWidth: '380px' }}>
                            <EnhancedProductCard product={product} />
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
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