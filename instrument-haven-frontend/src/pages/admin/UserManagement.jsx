import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import {
  Typography,
  Box,
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
  Button,
  Snackbar,
  Alert,
  Avatar,
  InputAdornment
} from '@mui/material';
import { 
  Edit as EditIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Search as SearchIcon
} from '@mui/icons-material';

// Mock data for testing if API fails
const MOCK_USERS = [
  { 
    id: 1, 
    name: 'Admin User', 
    email: 'admin@example.com', 
    role: 'admin', 
    created_at: '2023-05-01T10:00:00Z',
    phone: '123-456-7890',
    address: '123 Admin St, Admin City, AC 12345'
  },
  { 
    id: 2, 
    name: 'John Doe', 
    email: 'john@example.com', 
    role: 'customer', 
    created_at: '2023-05-02T10:00:00Z' 
  },
  { 
    id: 3, 
    name: 'Jane Smith', 
    email: 'jane@example.com', 
    role: 'customer', 
    created_at: '2023-05-03T10:00:00Z',
    phone: '555-123-4567'
  }
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
    setPage(0); // Reset to first page when filtering
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Use the admin API to fetch users
      const response = await api.admin.getUsers();
      console.log('Users response:', response);
      
      // Handle different response formats according to API documentation
      const usersData = response.data?.data?.users || 
                     response.data?.users || 
                     (Array.isArray(response.data) ? response.data : []);
      
      if (usersData && usersData.length > 0) {
        setUsers(usersData);
        setFilteredUsers(usersData);
        toast.success('Users loaded successfully');
      } else {
        console.warn('No users found in API response, using mock data');
        setUsers(MOCK_USERS);
        setFilteredUsers(MOCK_USERS);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users: ' + (error.response?.data?.message || 'Unknown error'));
      console.warn('Using mock data due to API error');
      setUsers(MOCK_USERS);
      setFilteredUsers(MOCK_USERS);
      setSnackbar({
        open: true,
        message: 'Using sample data. API connection failed.',
        severity: 'warning'
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

  const handleOpenEditDialog = (user) => {
    setCurrentUser({ ...user });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({
      ...currentUser,
      [name]: value
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSaveUser = async () => {
    try {
      // Validate form
      if (!currentUser?.name) {
        toast.error('Name is required');
        return;
      }
      
      // Prepare user data - convert empty strings to null
      const userData = {
        ...currentUser,
        phone: currentUser.phone || null,
        address: currentUser.address || null
      };
      
      // Use the admin API to update the user
      const response = await api.admin.updateUser(currentUser.id, userData);
      console.log('Update user response:', response);
      
      // Extract user data from response according to API documentation
      const updatedUser = response.data?.data?.user || response.data?.user || userData;
      
      // Update the user in the local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === updatedUser.id ? updatedUser : user
        )
      );
      
      toast.success('User updated successfully!');
      setSnackbar({
        open: true,
        message: 'User updated successfully!',
        severity: 'success'
      });
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating user:', error.response?.data || error);
      
      // Optimistically update the UI even if the API fails
      const updatedUser = { ...currentUser };
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === updatedUser.id ? updatedUser : user
        )
      );
      
      toast.warning('Changes saved locally but not on server due to API error');
      setSnackbar({
        open: true,
        message: 'Changes saved locally (API update failed)',
        severity: 'warning'
      });
      
      handleCloseDialog();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .slice(0, 2)
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '300px',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        User Management
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <TextField
          placeholder="Search users..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ width: { xs: '100%', sm: '300px' } }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>
          }}
        />
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
            {filteredUsers.length > 0 ? (
              filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            mr: 1, 
                            bgcolor: user.role === 'admin' ? 'primary.main' : 'secondary.main',
                            width: 32,
                            height: 32,
                            fontSize: '0.875rem'
                          }}
                        >
                          {getInitials(user.name)}
                        </Avatar>
                        {user.name}
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role === 'admin' ? 'Admin' : 'Customer'}
                        color={user.role === 'admin' ? 'primary' : 'default'}
                        size="small"
                        icon={user.role === 'admin' ? <AdminIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
                      />
                    </TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton 
                        color="primary"
                        onClick={() => handleOpenEditDialog(user)}
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* User Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        {currentUser && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  sx={{ 
                    mr: 2, 
                    bgcolor: currentUser.role === 'admin' ? 'primary.main' : 'secondary.main'
                  }}
                >
                  {getInitials(currentUser.name)}
                </Avatar>
                Edit User
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box component="form" sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={currentUser.name || ''}
                  onChange={handleInputChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={currentUser.email || ''}
                  type="email"
                  disabled
                  margin="normal"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Role</InputLabel>
                  <Select
                    name="role"
                    value={currentUser.role || 'customer'}
                    onChange={handleInputChange}
                    label="Role"
                  >
                    <MenuItem value="customer">Customer</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={currentUser.phone || ''}
                  onChange={handleInputChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={currentUser.address || ''}
                  onChange={handleInputChange}
                  multiline
                  rows={2}
                  margin="normal"
                />
                <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                  <Typography variant="body2" color="info.dark">
                    Note: Change user roles with caution. Admin users have full access to the system.
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleSaveUser} variant="contained">
                Save Changes
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserManagement;