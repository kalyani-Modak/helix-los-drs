import React, { forwardRef } from "react";
import { Box } from "@mui/material";
import Lottie from "lottie-react";
import assistantAnimation from "@assets/assistant-gemini.json";
import PropTypes from "prop-types";

const GeminiAvatar = forwardRef(({ onClick }, ref) => (
    <Box
        ref={ref}
        onClick={onClick}
        sx={{
            cursor: "pointer",
            width: 40,
            height: 40,
            animation: "spin 4s linear infinite", // <-- add rotation
            "&:hover": {
                transform: "scale(1.1)",
            },
            "@keyframes spin": {
                "0%": { transform: "rotate(0deg)" },
                "100%": { transform: "rotate(360deg)" },
            },
        }}
    >
        <Lottie
            animationData={assistantAnimation}
            loop
            autoplay
            style={{ width: "100%", height: "100%" }}
        />
    </Box>
));

GeminiAvatar.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default GeminiAvatar;
