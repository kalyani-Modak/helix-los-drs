import { useContext } from "react";
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import { SessionContext } from "@helix/component-library";
import { useNavigate } from 'react-router-dom';

const cardColors = [
    "#FF6F61", "#6B5B95", "#88B04B", "#F7CAC9", "#92A8D1",
    "#955251", "#B565A7", "#009B77", "#DD4124", "#45B8AC"
];

const ModuleCards = () => {
	let navigate;
	  try {
		navigate = useNavigate();
	  } catch (e) {
		console.warn("getNavigate called outside Router context");
		navigate = () => {}; // no-op fallback
	  }
    const { state } = useContext(SessionContext);
    const { menus } = state;
    const availableModules = menus?.hangingFunctions || [];
    console.log("Available Modules:", availableModules);

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: "#334155", textAlign: "center", mb: 4 }}>
                Available Modules
            </Typography>
            <Grid container spacing={3}>
                {availableModules.map((module, index) => (
                    <Grid key={module.menuId} size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
                        <Card
                            onClick={() => navigate(module.path)}
                            sx={{
                                cursor: "pointer",
                                backgroundColor: cardColors[index % cardColors.length],
                                color: "#fff",
                                '&:hover': {
                                    transform: "scale(1.05)",
                                    boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
                                },
                                transition: "all 0.3s",
                                borderRadius: 2,
                                minHeight: "120px"
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center" }}>
                                    {module.name}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ModuleCards;
