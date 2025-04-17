import { useState, useEffect } from "react";
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
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: categoryId || queryParams.get("category") || "",
    tag: queryParams.get("tag") || "",
    sort: queryParams.get("sort") || "newest",
    search: queryParams.get("search") || "",
    minPrice: queryParams.get("minPrice") || "",
    maxPrice: queryParams.get("maxPrice") || "",
    page: parseInt(queryParams.get("page")) || 1,
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentCategory, setCurrentCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch categories
        const categoriesResponse = await api.categories.getAll();
        setCategories(categoriesResponse.data.data);

        // Fetch tags
        const tagsResponse = await api.tags.getAll();
        setTags(tagsResponse.data.data);

        // Fetch products based on filters
        let productsData = [];
        
        if (filters.category) {
          const response = await api.products.getByCategory(filters.category);
          productsData = response.data.data;
          
          // Get category details
          if (categoryId) {
            try {
              const categoryResponse = await api.categories.getById(categoryId);
              setCurrentCategory(categoryResponse.data.data);
            } catch (err) {
              console.error("Error fetching category details:", err);
            }
          }
        } else if (filters.tag) {
          const response = await api.products.getByTag(filters.tag);
          productsData = response.data.data;
        } else if (filters.search) {
          const response = await api.products.search(filters.search);
          productsData = response.data.data;
        } else {
          const response = await api.products.getAll();
          productsData = response.data.data;
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
    };

    fetchData();
  }, [filters, categoryId]);

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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {currentCategory ? currentCategory.name : "Products"}
      </Typography>
      
      {currentCategory && (
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
                button
                selected={filters.category === ""}
                onClick={() => handleFilterChange("category", "")}
              >
                <ListItemText primary="All Categories" />
              </ListItem>
              {categories.map((category) => (
                <ListItem
                  button
                  key={category.id}
                  selected={filters.category === category.id.toString()}
                  onClick={() =>
                    handleFilterChange("category", category.id.toString())
                  }
                >
                  <ListItemText primary={category.name} />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Tags
            </Typography>
            <FormGroup>
              {tags.map((tag) => (
                <FormControlLabel
                  key={tag.id}
                  control={
                    <Checkbox
                      checked={filters.tag === tag.id.toString()}
                      onChange={() =>
                        handleFilterChange(
                          "tag",
                          filters.tag === tag.id.toString()
                            ? ""
                            : tag.id.toString()
                        )
                      }
                      size="small"
                    />
                  }
                  label={tag.name}
                />
              ))}
            </FormGroup>

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
                handleFilterChange("tag", "");
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
                button
                selected={filters.category === ""}
                onClick={() => {
                  handleFilterChange("category", "");
                  if (isMobile) toggleDrawer();
                }}
              >
                <ListItemText primary="All Categories" />
              </ListItem>
              {categories.map((category) => (
                <ListItem
                  button
                  key={category.id}
                  selected={filters.category === category.id.toString()}
                  onClick={() => {
                    handleFilterChange("category", category.id.toString());
                    if (isMobile) toggleDrawer();
                  }}
                >
                  <ListItemText primary={category.name} />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Tags
            </Typography>
            <FormGroup>
              {tags.map((tag) => (
                <FormControlLabel
                  key={tag.id}
                  control={
                    <Checkbox
                      checked={filters.tag === tag.id.toString()}
                      onChange={() => {
                        handleFilterChange(
                          "tag",
                          filters.tag === tag.id.toString()
                            ? ""
                            : tag.id.toString()
                        );
                        if (isMobile) toggleDrawer();
                      }}
                      size="small"
                    />
                  }
                  label={tag.name}
                />
              ))}
            </FormGroup>

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
                handleFilterChange("tag", "");
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
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : products.length > 0 ? (
            <>
              <Grid container spacing={3}>
                {products.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
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
                  handleFilterChange("tag", "");
                }}
              >
                Clear Filters
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductList;