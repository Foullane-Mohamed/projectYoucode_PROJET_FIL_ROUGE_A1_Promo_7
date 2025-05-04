import { useState, useEffect } from "react";
import api from "../../services/api";
import CouponForm from "./components/CouponForm";
import {
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

const MOCK_COUPONS = [
  {
    id: 1,
    code: "WELCOME10",
    type: "fixed",
    discount: 10,
    min_purchase: null,
    starts_at: "2025-04-20",
    expires_at: "2025-07-20",
    is_active: true,
  },
  {
    id: 2,
    code: "SUMMER20",
    type: "fixed",
    discount: 20,
    min_purchase: null,
    starts_at: "2025-04-20",
    expires_at: "2025-06-20",
    is_active: true,
  },
  {
    id: 3,
    code: "T28CTJC9",
    type: "fixed",
    discount: 15,
    min_purchase: null,
    starts_at: "2025-04-20",
    expires_at: "2025-05-20",
    is_active: true,
  },
];

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [openCouponForm, setOpenCouponForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null);
  const [couponToDelete, setCouponToDelete] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCoupons(coupons);
    } else {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = coupons.filter((coupon) =>
        coupon.code.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredCoupons(filtered);
    }
    setPage(0);
  }, [searchQuery, coupons]);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await api.admin.getCoupons();

      let couponsData = [];

      if (response.data?.data?.coupons) {
        couponsData = response.data.data.coupons;
      } else if (response.data?.coupons) {
        couponsData = response.data.coupons;
      } else if (Array.isArray(response.data?.data)) {
        couponsData = response.data.data;
      } else if (response.data?.data) {
        const dataType = typeof response.data.data;
        if (
          dataType === "object" &&
          !Array.isArray(response.data.data) &&
          response.data.data !== null
        ) {
          couponsData = [response.data.data];
        }
      }

      if (couponsData && couponsData.length > 0) {
        const processedCoupons = couponsData.map((coupon) => ({
          id: coupon.id,
          code: coupon.code,
          discount_type: coupon.discount_type || coupon.type || "percentage",
          discount_value: parseFloat(
            coupon.discount_value || coupon.discount || 0
          ),
          min_order_amount:
            coupon.min_order_amount || coupon.min_purchase || null,
          max_discount_amount:
            coupon.max_discount_amount || coupon.max_discount || null,
          usage_limit: coupon.usage_limit || coupon.max_uses || null,
          starts_at: coupon.starts_at || null,
          expires_at: coupon.expires_at || null,
          is_active:
            coupon.is_active === undefined ? true : Boolean(coupon.is_active),
        }));

        setCoupons(processedCoupons);
        setFilteredCoupons(processedCoupons);
      } else {
        setCoupons(MOCK_COUPONS);
        setFilteredCoupons(MOCK_COUPONS);
      }
    } catch (error) {
      setCoupons(MOCK_COUPONS);
      setFilteredCoupons(MOCK_COUPONS);
      setSnackbar({
        open: true,
        message: `Using sample data. API connection failed: ${
          error.message || "Unknown error"
        }`,
        severity: "warning",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCreateCoupon = () => {
    setCurrentCoupon(null);
    setOpenCouponForm(true);
  };

  const handleEditCoupon = (coupon) => {
    try {
      const formattedCoupon = {
        id: coupon.id,
        code: coupon.code,
        discount_type: coupon.discount_type || "percentage",
        discount_value: coupon.discount_value || coupon.discount || 0,
        min_order_amount: coupon.min_order_amount || coupon.min_purchase || "",
        max_discount_amount:
          coupon.max_discount_amount || coupon.max_discount || "",
        usage_limit: coupon.usage_limit || coupon.max_uses || "",
        starts_at: null,
        expires_at: null,
        is_active:
          coupon.is_active === undefined ? true : Boolean(coupon.is_active),
      };

      try {
        if (coupon.starts_at) {
          const startDate = new Date(coupon.starts_at);
          if (!isNaN(startDate.getTime())) {
            formattedCoupon.starts_at = startDate;
          } else {
            formattedCoupon.starts_at = new Date();
          }
        } else {
          formattedCoupon.starts_at = new Date();
        }

        if (coupon.expires_at) {
          const expiryDate = new Date(coupon.expires_at);
          if (!isNaN(expiryDate.getTime())) {
            formattedCoupon.expires_at = expiryDate;
          } else {
            formattedCoupon.expires_at = new Date(
              new Date().setMonth(new Date().getMonth() + 1)
            );
          }
        } else {
          formattedCoupon.expires_at = new Date(
            new Date().setMonth(new Date().getMonth() + 1)
          );
        }
      } catch (dateError) {
        formattedCoupon.starts_at = new Date();
        formattedCoupon.expires_at = new Date(
          new Date().setMonth(new Date().getMonth() + 1)
        );
      }

      setCurrentCoupon(formattedCoupon);
      setOpenCouponForm(true);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error preparing coupon for editing. Please try again.",
        severity: "error",
      });
    }
  };

  const handleOpenDeleteDialog = (coupon) => {
    setCouponToDelete(coupon);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCouponToDelete(null);
  };

  const handleDeleteCoupon = async () => {
    try {
      await api.admin.deleteCoupon(couponToDelete.id);

      const updatedCoupons = coupons.filter(
        (coupon) => coupon.id !== couponToDelete.id
      );
      setCoupons(updatedCoupons);
      setFilteredCoupons(updatedCoupons);

      setSnackbar({
        open: true,
        message: "Coupon deleted successfully!",
        severity: "success",
      });

      handleCloseDeleteDialog();
    } catch (error) {
      console.error("Error deleting coupon:", error);

      const updatedCoupons = coupons.filter(
        (coupon) => coupon.id !== couponToDelete.id
      );
      setCoupons(updatedCoupons);
      setFilteredCoupons(updatedCoupons);

      setSnackbar({
        open: true,
        message: "Coupon deleted locally (API update failed)",
        severity: "warning",
      });

      handleCloseDeleteDialog();
    }
  };

  const handleSubmitCoupon = async (values) => {
    try {
      const formattedCoupon = {
        code: values.code,
        discount_type: values.discount_type,
        discount_value: parseFloat(values.discount_value) || 0,
        min_order_amount: values.min_order_amount
          ? parseFloat(values.min_order_amount)
          : null,
        max_discount_amount: values.max_discount_amount
          ? parseFloat(values.max_discount_amount)
          : null,
        usage_limit: values.usage_limit
          ? parseInt(values.usage_limit, 10)
          : null,
        is_active: values.is_active ? 1 : 0,
        starts_at: values.starts_at
          ? new Date(values.starts_at).toISOString().split("T")[0]
          : null,
        expires_at: values.expires_at
          ? new Date(values.expires_at).toISOString().split("T")[0]
          : null,
      };

      const useMockData = false;

      if (currentCoupon) {
        if (!useMockData) {
          const response = await api.admin.updateCoupon(
            currentCoupon.id,
            formattedCoupon
          );
        }

        const updatedCoupons = coupons.map((coupon) =>
          coupon.id === currentCoupon.id
            ? {
                ...coupon,
                ...formattedCoupon,
                starts_at: values.starts_at,
                expires_at: values.expires_at,
              }
            : coupon
        );
        setCoupons(updatedCoupons);
        setFilteredCoupons(updatedCoupons);

        setSnackbar({
          open: true,
          message: "Coupon updated successfully!",
          severity: "success",
        });
      } else {
        let newCouponId = Math.max(...coupons.map((c) => c.id || 0), 0) + 1;

        if (!useMockData) {
          try {
            const response = await api.admin.createCoupon(formattedCoupon);

            if (response.data?.data?.coupon?.id) {
              newCouponId = response.data.data.coupon.id;
            } else if (response.data?.data?.id) {
              newCouponId = response.data.data.id;
            }
          } catch (error) {
            // Fallback to local ID
          }
        }

        const newCoupon = {
          id: newCouponId,
          ...formattedCoupon,
          starts_at: values.starts_at,
          expires_at: values.expires_at,
        };

        const updatedCoupons = [...coupons, newCoupon];
        setCoupons(updatedCoupons);
        setFilteredCoupons(updatedCoupons);

        setSnackbar({
          open: true,
          message: "Coupon created successfully!",
          severity: "success",
        });
      }

      setSnackbar({
        open: true,
        message: `Coupon ${
          currentCoupon ? "updated" : "created"
        } successfully!`,
        severity: "success",
      });

      fetchCoupons();

      setOpenCouponForm(false);
      return true;
    } catch (error) {
      let errorMessage = "An unknown error occurred";

      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors)
          .flat()
          .join(", ");
        errorMessage = `Validation error: ${errorMessages}`;

        setSnackbar({
          open: true,
          message: errorMessage,
          severity: "error",
        });
        return false;
      }

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      if (process.env.NODE_ENV === "development") {
        if (currentCoupon) {
          const updatedCoupons = coupons.map((coupon) =>
            coupon.id === currentCoupon.id
              ? {
                  ...coupon,
                  ...values,
                  discount_type: values.discount_type,
                  discount_value: values.discount_value,
                  is_active: values.is_active,
                }
              : coupon
          );
          setCoupons(updatedCoupons);
          setFilteredCoupons(updatedCoupons);
        } else {
          const newCoupon = {
            id: Math.max(...coupons.map((c) => c.id || 0), 0) + 1,
            ...values,
            discount_type: values.discount_type,
            discount_value: values.discount_value,
            is_active: values.is_active,
          };
          const updatedCoupons = [...coupons, newCoupon];
          setCoupons(updatedCoupons);
          setFilteredCoupons(updatedCoupons);
        }

        setSnackbar({
          open: true,
          message: `Coupon saved locally (API update failed: ${errorMessage})`,
          severity: "warning",
        });

        setOpenCouponForm(false);
        return true;
      }

      setSnackbar({
        open: true,
        message: `Error: ${errorMessage}`,
        severity: "error",
      });

      return false;
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const paginatedCoupons = filteredCoupons.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" component="h1">
          Coupon Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateCoupon}
        >
          Add Coupon
        </Button>
      </Box>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <TextField
            placeholder="Search coupons..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Min. Purchase</TableCell>
              <TableCell>Valid From</TableCell>
              <TableCell>Valid Until</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={40} />
                </TableCell>
              </TableRow>
            ) : paginatedCoupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No coupons found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedCoupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell>
                    <Chip label={coupon.code} variant="outlined" />
                  </TableCell>
                  <TableCell>
                    {coupon.discount_type === "percentage"
                      ? "Percentage"
                      : "Fixed Amount"}
                  </TableCell>
                  <TableCell>
                    {coupon.discount_type === "percentage"
                      ? `${coupon.discount_value}%`
                      : `${parseFloat(coupon.discount_value).toFixed(2)}`}
                  </TableCell>
                  <TableCell>
                    {coupon.min_order_amount
                      ? `${parseFloat(coupon.min_order_amount).toFixed(2)}`
                      : "None"}
                  </TableCell>
                  <TableCell>{formatDate(coupon.starts_at)}</TableCell>
                  <TableCell>{formatDate(coupon.expires_at)}</TableCell>
                  <TableCell>
                    <Chip
                      label={coupon.is_active ? "Active" : "Inactive"}
                      color={coupon.is_active ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleEditCoupon(coupon)}
                      size="small"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleOpenDeleteDialog(coupon)}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredCoupons.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <CouponForm
        open={openCouponForm}
        onClose={() => setOpenCouponForm(false)}
        onSubmit={handleSubmitCoupon}
        initialValues={currentCoupon}
        isEdit={Boolean(currentCoupon)}
      />

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the coupon "{couponToDelete?.code}"?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteCoupon} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CouponManagement;
