import React from 'react';
import { Box, Typography } from '@mui/material';

const NotFound = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        backgroundColor: '#F8F9FC',
      }}
    >
      <Typography variant="h3" color="error" gutterBottom>
        URL Not Found
      </Typography>
      <Typography variant="h6" gutterBottom>
        The URL you entered is not valid.
      </Typography>
      <Typography variant="body1" gutterBottom>
        Please provide the correct URL <br />
      
      </Typography>
    </Box>
  );
};

export default NotFound;
