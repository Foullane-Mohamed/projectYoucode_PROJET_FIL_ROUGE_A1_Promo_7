import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { LoadingProvider } from "./context/LoadingContext";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import ErrorBoundary from "./components/common/ErrorBoundary/index";
import Home from "./pages/home/Home";
import ProductList from "./pages/product/ProductList";
import Categories from "./pages/categories/Categories";
import ProductDetail from "./pages/product/ProductDetail";
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/cart/Checkout";
import Wishlist from "./pages/wishlist/Wishlist";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Contact from "./pages/contact/Contact";
import Profile from "./pages/auth/Profile";
import MyOrders from "./pages/order/MyOrders";
import OrderDetail from "./pages/order/OrderDetail";
import OrderSuccess from "./pages/order/OrderSuccess";
import NotFound from "./pages/common/NotFound";
import AdminDashboard from "./pages/admin/Dashboard";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminRoute from "./components/common/AdminRoute";
import ShopRoute from "./components/common/ShopRoute";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF2B52",
      light: "#FF6B87",
      dark: "#CC0029",
    },
    secondary: {
      main: "#FFB612",
      light: "#FFCE5A",
      dark: "#CC8700",
    },
    background: {
      default: "#F5F5F7",
      paper: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
    h3: {
      fontWeight: 500,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 20,
          fontWeight: "bold",
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          overflow: "hidden",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#1a1a2e",
          color: "#FFFFFF",
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ErrorBoundary>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <LoadingProvider>
                  <BrowserRouter>
                    <Routes>
                
                      <Route
                        path="/admin/*"
                        element={
                          <AdminRoute>
                            <AdminDashboard />
                          </AdminRoute>
                        }
                      />

              
                      <Route
                        path="*"
                        element={
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              minHeight: "100vh",
                            }}
                          >
                            <Header />
                            <main style={{ flexGrow: 1 }}>
                              <Routes>
                        
                                <Route
                                  path="/"
                                  element={
                                    <ShopRoute>
                                      <Home />
                                    </ShopRoute>
                                  }
                                />
                                <Route
                                  path="/products"
                                  element={
                                    <ShopRoute>
                                      <ProductList />
                                    </ShopRoute>
                                  }
                                />
                                <Route
                                  path="/products/:id"
                                  element={
                                    <ShopRoute>
                                      <ProductDetail />
                                    </ShopRoute>
                                  }
                                />
                                <Route
                                  path="/categories"
                                  element={
                                    <ShopRoute>
                                      <Categories />
                                    </ShopRoute>
                                  }
                                />
                                <Route
                                  path="/categories/:id"
                                  element={
                                    <ShopRoute>
                                      <ProductList />
                                    </ShopRoute>
                                  }
                                />
                                <Route
                                  path="/search"
                                  element={
                                    <ShopRoute>
                                      <ProductList />
                                    </ShopRoute>
                                  }
                                />
                                <Route
                                  path="/cart"
                                  element={
                                    <ShopRoute>
                                      <Cart />
                                    </ShopRoute>
                                  }
                                />
                                <Route path="/login" element={<Login />} />
                                <Route
                                  path="/register"
                                  element={<Register />}
                                />
                                <Route
                                  path="/contact"
                                  element={
                                    <ShopRoute>
                                      <Contact />
                                    </ShopRoute>
                                  }
                                />

                                <Route
                                  path="/checkout"
                                  element={
                                    <ShopRoute>
                                      <ProtectedRoute>
                                        <Checkout />
                                      </ProtectedRoute>
                                    </ShopRoute>
                                  }
                                />
                                <Route
                                  path="/wishlist"
                                  element={
                                    <ShopRoute>
                                      <ProtectedRoute>
                                        <Wishlist />
                                      </ProtectedRoute>
                                    </ShopRoute>
                                  }
                                />
                                <Route
                                  path="/profile"
                                  element={
                                    <ShopRoute>
                                      <ProtectedRoute>
                                        <Profile />
                                      </ProtectedRoute>
                                    </ShopRoute>
                                  }
                                />
                                <Route
                                  path="/my-orders"
                                  element={
                                    <ShopRoute>
                                      <ProtectedRoute>
                                        <MyOrders />
                                      </ProtectedRoute>
                                    </ShopRoute>
                                  }
                                />
                                <Route
                                  path="/orders/:id"
                                  element={
                                    <ShopRoute>
                                      <ProtectedRoute>
                                        <OrderDetail />
                                      </ProtectedRoute>
                                    </ShopRoute>
                                  }
                                />
                                <Route
                                  path="/order-success"
                                  element={
                                    <ShopRoute>
                                      <ProtectedRoute>
                                        <OrderSuccess />
                                      </ProtectedRoute>
                                    </ShopRoute>
                                  }
                                />

                
                                <Route path="/404" element={<NotFound />} />
                                <Route
                                  path="*"
                                  element={<Navigate to="/404" replace />}
                                />
                              </Routes>
                            </main>
                            <Footer />
                          </div>
                        }
                      />
                    </Routes>
                    <ToastContainer position="bottom-right" />
                  </BrowserRouter>
                </LoadingProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ErrorBoundary>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
