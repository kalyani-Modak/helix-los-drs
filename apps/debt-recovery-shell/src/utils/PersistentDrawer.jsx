import React, { useState, useEffect } from "react";
import { Box, List, ListItem, ListItemText } from "@mui/material";
import { HDrawer } from "@helix/component-library";
import { getNavigate } from '@shared/navigationService';

const PersistentDrawer = () => {
    const navigate = getNavigate();

    const [selectedProduct, setSelectedProduct] = useState(sessionStorage.getItem("SEC_PRODUCT"));
    const [availableModules, setAvailableModules] = useState(
        JSON.parse(sessionStorage.getItem("SEC_MENUS")) || {}
    );

    useEffect(() => {
        const handleStorageChange = () => {
            setSelectedProduct(sessionStorage.getItem("SEC_PRODUCT"));
            setAvailableModules(JSON.parse(sessionStorage.getItem("SEC_MENUS")) || {});
        };

        window.addEventListener("sessionStorageUpdated", handleStorageChange);

        return () => {
            window.removeEventListener("sessionStorageUpdated", handleStorageChange);
        };
    }, []);

    // ✅ Get menus based on selected product
    const productMenus = selectedProduct && availableModules[selectedProduct] 
        ? availableModules[selectedProduct] 
        : null;

    return (
        <Box sx={{ display: "flex" }}>
            <HDrawer
                variant="permanent"
                sx={{
                    width: 250,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: 250,
                        boxSizing: "border-box",
                        backgroundColor: "#77308F",
                        color: "#f1f5f9",
                    },
                }}
            >
                <Box sx={{ padding: "1rem", textAlign: "center", borderBottom: "1px solid #fff", marginTop: "3rem" }}>
                    <h5 style={{ margin: 0 }}>Modules</h5>
                </Box>

                <Box sx={{ overflow: "auto" }}>
                    {productMenus && productMenus.hangingFunctions?.length > 0 ? (
                        <List>
                            {productMenus.hangingFunctions.map((module) => (
                                <ListItem
                                    button
                                    key={module.menuId}
                                    onClick={() => navigate(module.path)}
                                    sx={{ "&:hover": { backgroundColor: "#334155" } }}
                                >
                                    <ListItemText
                                        primary={module.name}
                                        sx={{
                                            "& .MuiTypography-root": {
                                                fontSize: "0.90rem",
                                                fontWeight: "bold",
                                            },
                                            color: "#ffffff",
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Box sx={{ padding: "1rem", textAlign: "center", color: "#fff" }}>
                            No Modules Available
                        </Box>
                    )}
                </Box>
            </HDrawer>
        </Box>
    );
};

export default PersistentDrawer;
