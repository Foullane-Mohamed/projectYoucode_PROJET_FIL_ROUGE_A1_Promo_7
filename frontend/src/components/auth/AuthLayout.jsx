import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Paper, Typography, Box } from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

const AuthLayout = ({ children, title }) => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          my: 8,
        }}
      >
        <Link to="/" className="flex items-center mb-6 text-primary-main">
          <MusicNoteIcon fontSize="large" />
          <Typography variant="h4" component="div" className="ml-2 font-bold">
            Instrument Haven
          </Typography>
        </Link>
        
        <Paper elevation={3} className="w-full p-6 rounded-lg">
          <Typography component="h1" variant="h5" className="text-center mb-4">
            {title}
          </Typography>
          
          {children}
        </Paper>
      </Box>
    </Container>
  );
};

export default AuthLayout;