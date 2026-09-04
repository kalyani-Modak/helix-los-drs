import { Box, Typography, Button } from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useNavigate } from 'react-router-dom';

const ServerErrorPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="75vh"
      textAlign="center"
      bgcolor="#f8d7da"
     p={4}
    >
      <InfoOutlinedIcon sx={{ fontSize: 80, color: "#721c24" }} />
      <Typography variant="h4" color="#721c24" gutterBottom>
        Server Error
      </Typography>
      <Typography variant="body1" color="#721c24" mb={2}>
        Oops! Something went wrong on Server end. Please try again later.
      </Typography>
      <Button
         className="custom-button"
         variant="contained"
         color="secondary"
        onClick={() => navigate("/homelayout/welcomepage")}
      >
        Go to Home
      </Button>
    </Box>
  );
};

export default ServerErrorPage;