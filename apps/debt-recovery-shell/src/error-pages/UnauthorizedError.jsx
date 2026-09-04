import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UnauthorizedError = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '75vh',

      }}
    >
      <Typography variant="h4" color="error" gutterBottom>
        Oops! Unauthorized Access
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        You do not have permission to view this page.
      </Typography>
      <Button  className="custom-button"
            variant="contained"
            color="secondary" onClick={() => navigate("/homelayout/welcomepage")}>
        Go to Home
      </Button>
    </Box>
  );
};

export default UnauthorizedError;
