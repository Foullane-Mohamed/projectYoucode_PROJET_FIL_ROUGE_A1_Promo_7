import { useState, useEffect } from 'react';
import api from '../../services/api';
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
  InputAdornment,
  useTheme
} from '@mui/material';
import { 
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Search as SearchIcon,
  Close as CloseIcon
} from '@mui/icons-material';

// Comment for API usage

const UserManagement = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'customer',
    phone: '',
    address: '',
    password: '',
    confirm_password: ''
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
      // Fetch users from the backend API
      const response = await api.admin.getUsers();
      console.log('Users response:', response);
      
      // Extract user data from the response
      const usersData = response.data?.data?.users || 
                      response.data?.users || 
                      (Array.isArray(response.data) ? response.data : []);
      
      if (usersData && usersData.length > 0) {
        setUsers(usersData);
        setFilteredUsers(usersData);
        
        setAlert({
          open: true,
          message: 'Users loaded successfully',
          severity: 'success'
        });
      } else {
        console.warn('No users found in API response');
        setUsers([]);
        setFilteredUsers([]);
        
        setAlert({
          open: true,
          message: 'No users found',
          severity: 'info'
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setFilteredUsers([]);
      
      setAlert({
        open: true,
        message: 'Failed to load users: ' + (error.response?.data?.message || 'Server error'),
        severity: 'error'
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

  const handleOpenDeleteDialog = (user) => {
    setCurrentUser({ ...user });
    setOpenDeleteDialog(true);
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOpenDeleteDialog(false);
    setOpenAddDialog(false);
    setCurrentUser(null);
    setNewUser({
      name: '',
      email: '',
      role: 'customer',
      phone: '',
      address: '',
      password: '',
      confirm_password: ''
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        [name]: value
      });
    }
  };

  const handleNewUserInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value
    });
  };

  const handleSaveUser = async () => {
    // Validate form
    if (!currentUser?.name || !currentUser?.email) {
      setAlert({
        open: true,
        message: 'Name and email are required',
        severity: 'error'
      });
      return;
    }
    
    try {
      // Call the API to update the user
      const response = await api.admin.updateUser(currentUser.id, currentUser);
      console.log('Update user response:', response);
      
      // Update local state with the response data
      const updatedUser = response.data?.data?.user || response.data?.user || currentUser;
      
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === updatedUser.id ? updatedUser : user
        )
      );
      
      setAlert({
        open: true,
        message: 'User updated successfully',
        severity: 'success'
      });
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating user:', error);
      setAlert({
        open: true,
        message: 'Failed to update user: ' + (error.response?.data?.message || 'Server error'),
        severity: 'error'
      });
    }
  };

  const handleAddUser = async () => {
    // Validate form
    if (!newUser.name || !newUser.email) {
      setAlert({
        open: true,
        message: 'Name and email are required',
        severity: 'error'
      });
      return;
    }
    
    if (newUser.password !== newUser.confirm_password) {
      setAlert({
        open: true,
        message: 'Passwords do not match',
        severity: 'error'
      });
      return;
    }
    
    try {
      // Call the API to create a new user
      const response = await api.admin.createUser(newUser);
      console.log('Create user response:', response);
      
      // Get the newly created user from the response
      const createdUser = response.data?.data?.user || response.data?.user;
      
      if (createdUser) {
        // Add the new user to the local state
        setUsers(prevUsers => [...prevUsers, createdUser]);
        
        setAlert({
          open: true,
          message: 'User created successfully',
          severity: 'success'
        });
        
        handleCloseDialog();
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setAlert({
        open: true,
        message: 'Failed to create user: ' + (error.response?.data?.message || 'Server error'),
        severity: 'error'
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!currentUser) return;
    
    try {
      // Call the API to delete the user
      await api.admin.deleteUser(currentUser.id);
      
      // Remove the user from the local state
      setUsers(prevUsers => 
        prevUsers.filter(user => user.id !== currentUser.id)
      );
      
      setAlert({
        open: true,
        message: 'User deleted successfully',
        severity: 'success'
      });
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error deleting user:', error);
      setAlert({
        open: true,
        message: 'Failed to delete user: ' + (error.response?.data?.message || 'Server error'),
        severity: 'error'
      });
    }
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

  const handleCloseAlert = () => {
    setAlert({
      ...alert,
      open: false
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress size={60} sx={{ color: 'primary.main' }} />
        <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
          Loading Users...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
          User Management
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
          Manage user accounts and permissions
        </Typography>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
          sx={{ 
            borderRadius: 2,
            backgroundColor: '#ff3366',
            '&:hover': {
              backgroundColor: '#e62958'
            }
          }}
        >
          Add New User
        </Button>
        
        <TextField
          placeholder="Search users..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ width: { xs: '100%', sm: '300px' } }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClearSearch}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>

      <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Joined Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              mr: 1, 
                              bgcolor: user.role === 'admin' ? '#ff3366' : '#6B46C1',
                              width: 34,
                              height: 34,
                              fontSize: '0.875rem'
                            }}
                          >
                            {getInitials(user.name)}
                          </Avatar>
                          <Typography variant="body2" fontWeight={500}>
                            {user.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role === 'admin' ? 'Admin' : 'Customer'}
                          color={user.role === 'admin' ? 'error' : 'primary'}
                          size="small"
                          icon={user.role === 'admin' ? <AdminIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
                          sx={{ 
                            borderRadius: 1,
                            backgroundColor: user.role === 'admin' ? '#ff3366' : '#6B46C1',
                            '& .MuiChip-label': {
                              fontWeight: 500
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell align="center">
                        <IconButton 
                          color="primary"
                          onClick={() => handleOpenEditDialog(user)}
                          size="small"
                          sx={{ mx: 0.5 }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          color="error"
                          onClick={() => handleOpenDeleteDialog(user)}
                          size="small"
                          sx={{ mx: 0.5 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No users found
                    </Typography>
                    {searchTerm && (
                      <Button 
                        variant="text" 
                        onClick={handleClearSearch}
                        sx={{ mt: 1 }}
                      >
                        Clear search
                      </Button>
                    )}
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
            labelRowsPerPage="Rows per page:"
            labelDisplayedRows={({ from, to, count }) => `${from}–${to} of ${count}`}
          />
        </TableContainer>
      </Paper>

      {/* Edit User Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        {currentUser && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  sx={{ 
                    mr: 2, 
                    bgcolor: currentUser.role === 'admin' ? '#ff3366' : '#6B46C1',
                    height: 40,
                    width: 40
                  }}
                >
                  {getInitials(currentUser.name)}
                </Avatar>
                <Typography variant="h6">Edit User</Typography>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Box component="form" sx={{ mt: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Name</Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter user's name"
                      name="name"
                      value={currentUser.name || ''}
                      onChange={handleInputChange}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Email</Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter user's email"
                      name="email"
                      value={currentUser.email || ''}
                      onChange={handleInputChange}
                      variant="outlined"
                      type="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Role</Typography>
                    <FormControl fullWidth variant="outlined">
                      <Select
                        name="role"
                        value={currentUser.role || 'customer'}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="customer">Customer</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Phone</Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter user's phone number"
                      name="phone"
                      value={currentUser.phone || ''}
                      onChange={handleInputChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Address</Typography>
                    <TextField
                      fullWidth
                      placeholder="Enter user's address"
                      name="address"
                      value={currentUser.address || ''}
                      onChange={handleInputChange}
                      variant="outlined"
                      multiline
                      rows={2}
                    />
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button 
                onClick={handleCloseDialog} 
                variant="outlined"
                sx={{ borderRadius: 2 }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveUser} 
                variant="contained"
                sx={{ 
                  borderRadius: 2, 
                  backgroundColor: '#ff3366',
                  '&:hover': {
                    backgroundColor: '#e62958'
                  }
                }}
              >
                Save Changes
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog 
        open={openDeleteDialog} 
        onClose={handleCloseDialog}
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        {currentUser && (
          <>
            <DialogTitle>
              <Typography variant="h6">Confirm Deletion</Typography>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1">
                Are you sure you want to delete user "{currentUser.name}"? This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button 
                onClick={handleCloseDialog}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleDeleteUser} 
                variant="contained" 
                color="error"
                sx={{ borderRadius: 2 }}
              >
                Delete User
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Add New User Dialog */}
      <Dialog 
        open={openAddDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle>
          <Typography variant="h6">Add New User</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Name</Typography>
                <TextField
                  fullWidth
                  placeholder="Enter user's name"
                  name="name"
                  value={newUser.name}
                  onChange={handleNewUserInputChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Email</Typography>
                <TextField
                  fullWidth
                  placeholder="Enter user's email"
                  name="email"
                  type="email"
                  value={newUser.email}
                  onChange={handleNewUserInputChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Role</Typography>
                <FormControl fullWidth variant="outlined">
                  <Select
                    name="role"
                    value={newUser.role}
                    onChange={handleNewUserInputChange}
                  >
                    <MenuItem value="customer">Customer</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Phone</Typography>
                <TextField
                  fullWidth
                  placeholder="Enter user's phone number"
                  name="phone"
                  value={newUser.phone}
                  onChange={handleNewUserInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Address</Typography>
                <TextField
                  fullWidth
                  placeholder="Enter user's address"
                  name="address"
                  value={newUser.address}
                  onChange={handleNewUserInputChange}
                  variant="outlined"
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Password</Typography>
                <TextField
                  fullWidth
                  placeholder="Enter password"
                  name="password"
                  type="password"
                  value={newUser.password}
                  onChange={handleNewUserInputChange}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Confirm Password</Typography>
                <TextField
                  fullWidth
                  placeholder="Confirm password"
                  name="confirm_password"
                  type="password"
                  value={newUser.confirm_password}
                  onChange={handleNewUserInputChange}
                  variant="outlined"
                  required
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddUser} 
            variant="contained"
            sx={{ 
              borderRadius: 2, 
              backgroundColor: '#ff3366',
              '&:hover': {
                backgroundColor: '#e62958'
              }
            }}
          >
            Add User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alert.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Add missing Grid component
const Grid = ({ container, item, xs, md, spacing, children, ...props }) => {
  return (
    <Box 
      sx={{ 
        ...(container && { 
          display: 'flex', 
          flexWrap: 'wrap', 
          margin: spacing ? -1 * (spacing / 2) : 0 
        }),
        ...(item && { 
          padding: spacing ? spacing / 2 : 0,
          flexBasis: xs ? `${(xs / 12) * 100}%` : 'auto',
          flexGrow: 0,
          maxWidth: xs ? `${(xs / 12) * 100}%` : '100%',
          [theme => theme.breakpoints.up('md')]: {
            flexBasis: md ? `${(md / 12) * 100}%` : undefined,
            maxWidth: md ? `${(md / 12) * 100}%` : undefined,
          },
        }),
        ...props
      }}
    >
      {children}
    </Box>
  );
};

export default UserManagement;