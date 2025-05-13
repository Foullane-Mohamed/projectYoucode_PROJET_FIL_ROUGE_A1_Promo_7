import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  Typography,
  Grid,
  Box,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
  Button,
  useMediaQuery,
  alpha,
  linearProgressClasses,
  LinearProgress,
  styled
} from "@mui/material";
import { Box as EmojiIcon } from "@mui/material";

const BorderLinearProgress = styled(LinearProgress)(({ theme, color }) => ({
  height: 4,
  borderRadius: 2,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: alpha(color, 0.1),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 2,
    backgroundColor: color,
  },
}));

const AdminHome = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const cardSchemes = [
    {
      name: "products",
      mainColor: "#FF2B52",
      icon: "🎹",
      title: "Total Products",
      progressValue: 70
    },
    {
      name: "categories",
      mainColor: "#6B46C1",
      icon: "📁",
      title: "Total Categories",
      progressValue: 85
    },
    {
      name: "orders",
      mainColor: "#F59E0B", 
      icon: "🛒",
      title: "Total Orders",
      progressValue: 45
    },
    {
      name: "users",
      mainColor: "#0EA5E9",
      icon: "👥",
      title: "Total Users",
      progressValue: 60
    }
  ];

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const dashboardResponse = await api.admin.getDashboard();
        console.log("Dashboard response:", dashboardResponse);

        const dashboardData =
          dashboardResponse.data?.data?.statistics ||
          dashboardResponse.data?.statistics ||
          {};

        setStats({
          products: dashboardData.total_products || 0,
          categories: dashboardData.total_categories || 0,
          orders: dashboardData.total_orders || 0,
          users: dashboardData.total_users || 0,
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
        try {
          const products = await api.products.getAll();
          const categories = await api.categories.getAll();
          const productCount =
            products.data?.data?.total || products.data?.meta?.total || 0;
          const categoryCount =
            categories.data?.data?.categories?.length ||
            categories.data?.categories?.length ||
            0;

          setStats((prev) => ({
            ...prev,
            products: productCount,
            categories: categoryCount,
          }));
        } catch (fallbackError) {
          console.error("Fallback stats fetching failed:", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress size={60} sx={{ color: "primary.main" }} />
        <Typography variant="h6" sx={{ mt: 2, color: "text.secondary" }}>
          Loading Dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant={isMobile ? "h5" : "h4"}
          component="h1"
          sx={{
            fontWeight: 700,
            color: "#1a1a2e",
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
          }}
        >
        Statistique
        </Typography>

      </Box>

      <Grid container spacing={3}>
        {cardSchemes.map((scheme) => (
          <Grid item xs={12} sm={6} lg={3} key={scheme.name}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: "rgba(149, 157, 165, 0.1) 0px 8px 24px",
                background: "#fff",
                height: "100%",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s ease",
                border: "1px solid rgba(231, 231, 238, 0.8)",
                "&:hover": {
                  boxShadow: "rgba(0, 0, 0, 0.1) 0px 5px 15px",
                },
              }}
            >
              <CardContent sx={{ p: 3, position: "relative" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ 
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      color: "text.primary"
                    }}
                  >
                    {scheme.title}
                  </Typography>
                  
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: "10px",
                      background: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 2px 8px ${alpha(scheme.mainColor, 0.25)}`,
                      border: `1px solid ${alpha(scheme.mainColor, 0.15)}`
                    }}
                  >
                    <EmojiIcon sx={{ fontSize: "1.3rem", color: scheme.mainColor }}>
                      {scheme.icon}
                    </EmojiIcon>
                  </Box>
                </Box>

                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: "#111",
                    fontSize: { xs: "2.2rem", sm: "2.5rem" },
                    mt: 1,
                    mb: 3
                  }}
                >
                  {stats[scheme.name]}
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <BorderLinearProgress
                    variant="determinate"
                    value={scheme.progressValue}
                    color={scheme.mainColor}
                  />
                </Box>

                <Button
                  component={Link}
                  to={`/admin/${scheme.name}`}
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 1,
                    py: 1,
                    borderRadius: "8px",
                    backgroundColor: scheme.mainColor,
                    color: "#fff",
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: alpha(scheme.mainColor, 0.9),
                      boxShadow: `0 4px 8px ${alpha(scheme.mainColor, 0.25)}`
                    }
                  }}
                >
                  See Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminHome;