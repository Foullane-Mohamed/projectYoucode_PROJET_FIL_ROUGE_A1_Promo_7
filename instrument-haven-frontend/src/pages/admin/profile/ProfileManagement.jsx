import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  Alert,
  InputAdornment,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Save as SaveIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';

const ProfileManagement = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    if (profile.new_password && profile.new_password !== profile.confirm_password) {
      setError('New password and confirmation do not match');
      setLoading(false);
      return;
    }

    try {
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
        
        setProfile(prev => ({
          ...prev,
          current_password: '',
          new_password: '',
          confirm_password: '',
        }));
        
        if (updateUser) {
          updateUser({
            ...user,
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            address: profile.address,
          });
        }
      }, 1000);
      
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
          Profile Management
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
          Update your personal information and password
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Profile updated successfully!
        </Alert>
      )}

      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          mb: 4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar
            sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: '#ff3366',
              fontSize: '2rem',
              fontWeight: 'bold'
            }}
          >
            {profile.name ? profile.name.charAt(0).toUpperCase() : 'F'}
          </Avatar>
          <Box sx={{ ml: 3 }}>
            <Typography variant="h5" fontWeight="600">
              {profile.name || 'foullane mohamed'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {profile.email || 'foullane@gmail.com'}
            </Typography>
          </Box>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Full Name</Typography>
              <TextField
                fullWidth
                placeholder="Enter your full name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Email Address</Typography>
              <TextField
                fullWidth
                placeholder="Enter your email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Phone Number</Typography>
              <TextField
                fullWidth
                placeholder="Enter your phone number"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Address</Typography>
              <TextField
                fullWidth
                placeholder="Enter your address"
                name="address"
                value={profile.address}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />
          
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Change Password
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Current Password</Typography>
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter current password"
                name="current_password"
                value={profile.current_password}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={toggleShowPassword} edge="end">
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>New Password</Typography>
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                name="new_password"
                value={profile.new_password}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={toggleShowPassword} edge="end">
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Confirm New Password</Typography>
              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                name="confirm_password"
                value={profile.confirm_password}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={toggleShowPassword} edge="end">
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              color="error"
              size="large"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              disabled={loading}
              sx={{ 
                borderRadius: 28,
                textTransform: 'none',
                px: 4,
                py: 1.5,
                backgroundColor: '#ff3366',
                '&:hover': {
                  backgroundColor: '#e62958'
                }
              }}
            >
              {loading ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ProfileManagement;