import { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
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
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [currentUser, setCurrentUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (
    currentPage = page,
    currentRowsPerPage = rowsPerPage,
    currentSearchTerm = searchTerm
  ) => {
    setLoading(true);
    try {
      const params = {
        page: currentPage + 1,
        per_page: currentRowsPerPage,
        order_by: "id",
        direction: "asc",
      };

      if (currentSearchTerm && currentSearchTerm.trim()) {
        params.search = currentSearchTerm.trim();
      }

      const response = await api.admin.getUsers(params);

      let usersData = [];
      let paginationData = null;

      if (response.data?.data?.users) {
        if (response.data.data.users.data) {
          usersData = response.data.data.users.data;
          paginationData = response.data.data.users;
        } else {
          usersData = response.data.data.users;
        }
      } else if (response.data?.users) {
        if (response.data.users.data) {
          usersData = response.data.users.data;
          paginationData = response.data.users;
        } else {
          usersData = response.data.users;
        }
      } else if (Array.isArray(response.data)) {
        usersData = response.data;
      }

      setUsers(usersData);

      if (paginationData && paginationData.total !== undefined) {
        setTotalItems(paginationData.total);
      } else {
        setTotalItems(usersData.length);
      }

      toast.success("Users loaded successfully");
    } catch (error) {
      const errorDetail =
        error.response?.data?.message || error.message || "Unknown error";
      toast.error(`Failed to fetch users: ${errorDetail}`);

      setSnackbar({
        open: true,
        message: `Failed to fetch users. Please try again. (${errorDetail})`,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchUsers(newPage, rowsPerPage, searchTerm);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    fetchUsers(0, newRowsPerPage, searchTerm);
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout);
    }
    window.searchTimeout = setTimeout(() => {
      setPage(0);
      fetchUsers(0, rowsPerPage, value);
    }, 500);
  };

  const handleOpenAddDialog = () => {
    setDialogMode("add");
    setCurrentUser({
      name: "",
      email: "",
      password: "",
      role: "customer",
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (user) => {
    setDialogMode("edit");
    setCurrentUser({ ...user, password: "" });
    setOpenDialog(true);
  };

  const handleOpenDeleteDialog = (user) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setUserToDelete(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({
      ...currentUser,
      [name]: value,
    });
  };

  const handleSaveUser = async () => {
    try {
      if (!currentUser?.name) {
        toast.error("Name is required");
        return;
      }
      if (!currentUser?.email) {
        toast.error("Email is required");
        return;
      }
      if (dialogMode === "add" && !currentUser?.password) {
        toast.error("Password is required for new users");
        return;
      }
      if (!currentUser?.role) {
        toast.error("Role is required");
        return;
      }

      if (dialogMode === "add") {
        await api.admin.createUser(currentUser);
        toast.success("User created successfully!");
        setSnackbar({
          open: true,
          message: "User created successfully!",
          severity: "success",
        });
      } else {
        const userData = { ...currentUser };
        if (!userData.password) {
          delete userData.password;
        }

        await api.admin.updateUser(currentUser.id, userData);
        toast.success("User updated successfully!");
        setSnackbar({
          open: true,
          message: "User updated successfully!",
          severity: "success",
        });
      }

      fetchUsers();
      handleCloseDialog();
    } catch (error) {
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors)
          .flat()
          .join(", ");
        toast.error(`Validation error: ${errorMessages}`);
      } else {
        toast.error(error.response?.data?.message || "Failed to save user");
      }

      setSnackbar({
        open: true,
        message: `Failed to ${
          dialogMode === "add" ? "create" : "update"
        } user: ${
          error.response?.data?.message || error.message || "Unknown error"
        }`,
        severity: "error",
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      await api.admin.deleteUser(userToDelete.id);

      setUsers(users.filter((user) => user.id !== userToDelete.id));

      toast.success("User deleted successfully!");
      setSnackbar({
        open: true,
        message: "User deleted successfully!",
        severity: "success",
      });

      handleCloseDeleteDialog();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");

      setSnackbar({
        open: true,
        message: `Failed to delete user: ${
          error.response?.data?.message || error.message || "Unknown error"
        }`,
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const getRoleChip = (role) => {
    if (role === "admin") {
      return <Chip label="Admin" color="primary" size="small" />;
    } else {
      return <Chip label="Customer" color="success" size="small" />;
    }
  };

  if (loading && users.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress color="error" size={60} />
        <Typography sx={{ mt: 2 }}>Loading users...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <div>
          <Typography variant="h4" component="h1">
            User Management
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Manage user accounts and permissions
          </Typography>
        </div>
        <Button
          variant="contained"
          color="error"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
          sx={{
            borderRadius: "25px",
            backgroundColor: "#ff445a",
            "&:hover": { backgroundColor: "#e03a4f" },
          }}
        >
          Add New User
        </Button>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Box sx={{ flexGrow: 1, position: "relative" }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: { borderRadius: "25px" },
            }}
          />
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Joined Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleChip(user.role)}</TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenEditDialog(user)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleOpenDeleteDialog(user)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalItems}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* User Form Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === "add" ? "Add New User" : "Edit User"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={currentUser?.name || ""}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={currentUser?.email || ""}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label={
                dialogMode === "add"
                  ? "Password"
                  : "New Password (leave blank to keep current)"
              }
              name="password"
              type="password"
              value={currentUser?.password || ""}
              onChange={handleInputChange}
              margin="normal"
              required={dialogMode === "add"}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={currentUser?.role || "customer"}
                onChange={handleInputChange}
                label="Role"
              >
                <MenuItem value="customer">Customer</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveUser} variant="contained" color="primary">
            {dialogMode === "add" ? "Add User" : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the user "{userToDelete?.name}" with
            email {userToDelete?.email}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteUser} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
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

export default UserManagement;
