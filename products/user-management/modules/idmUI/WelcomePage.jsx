import { useState, useEffect } from "react";
import { Box, Typography, Paper, Zoom, Fade } from "@mui/material";
import logo from "@images/Ebix_logo.png";
import { useInRouterContext } from "react-router-dom";

// LoginScreen color palette
const colors = {
  primary: '#0378A6',
  secondary: '#8dbf41',
  accent: '#bf0404',
  primaryLight: '#4aa3d9',
  primaryDark: '#025a8c',
  secondaryLight: '#a8d173',
  secondaryDark: '#6b9c2c',
  accentLight: '#f44336',
  accentDark: '#a30404',
  background: {
    start: '#f0f9ff',
    end: '#e6f3e6',
    gradient: 'linear-gradient(145deg, #f8faff 0%, #f0f9f0 100%)'
  },
  cardBg: 'rgba(255, 255, 255, 0.95)',
  text: {
    primary: '#1e293b',
    secondary: '#475569',
    light: '#64748b'
  }
};

const WelcomePage = () => {
  const fullText = "Welcome to Debt Recovery Suite";
  const [currentLength, setCurrentLength] = useState(0);
  const [gradientPosition, setGradientPosition] = useState(0);
  const [showSubtext, setShowSubtext] = useState(false);

  if (!useInRouterContext()) {
    return <div>WelcomePage Router not ready</div>;
  }

  // Gradient animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGradientPosition((prev) => (prev + 1) % 200);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Typing effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentLength((prevLength) => {
        if (prevLength < fullText.length) {
          return prevLength + 1;
        } else {
          clearInterval(timer);
          setTimeout(() => setShowSubtext(true), 300);
          return prevLength;
        }
      });
    }, 150);
    return () => clearInterval(timer);
  }, [fullText]);

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `radial-gradient(circle at 0% 0%, ${colors.primaryLight}15 0%, transparent 50%),
                    radial-gradient(circle at 100% 0%, ${colors.secondaryLight}15 0%, transparent 50%),
                    radial-gradient(circle at 50% 100%, ${colors.accentLight}15 0%, transparent 50%),
                    linear-gradient(145deg, #f0faff 0%, #f5fff0 100%)`,
        position: "relative",
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(${gradientPosition}deg, 
            ${colors.primary}08 0%, 
            ${colors.secondary}08 50%, 
            ${colors.accent}08 100%)`,
          pointerEvents: "none",
        }
      }}
    >
      {/* Floating particles - reduced size and count for better performance */}
      <Box sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 1,
      }}>
        {[...Array(4)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              width: [30, 50, 70][i % 3],
              height: [30, 50, 70][i % 3],
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${[colors.primary, colors.secondary, colors.accent][i % 3]}10, transparent)`,
              top: `${[15, 40, 65, 85][i]}%`,
              left: `${[10, 80, 25, 70][i]}%`,
              filter: "blur(30px)",
              animation: `float ${10 + i * 2}s ease-in-out infinite`,
              "@keyframes float": {
                "0%, 100%": { transform: "translate(0, 0)" },
                "50%": { transform: `translate(${i % 2 === 0 ? 15 : -15}px, ${i % 3 === 0 ? -15 : 15}px)` }
              }
            }}
          />
        ))}
      </Box>

      {/* Main Content - Centered with responsive sizing */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "900px",
          mx: "auto",
          px: { xs: 2, sm: 3 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Zoom in={true} timeout={800} style={{ transitionDelay: '200ms' }}>
          <Paper
            elevation={0}
            sx={{
              backgroundColor: colors.cardBg,
              backdropFilter: "blur(10px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: { xs: 3, sm: 4, md: 5 },
              borderRadius: 4,
              border: `1px solid ${colors.primary}20`,
              boxShadow: `0 20px 40px -12px ${colors.primary}40`,
              width: "100%",
              maxWidth: 700,
              mx: "auto",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary}, ${colors.primary})`,
              },
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `radial-gradient(circle at ${gradientPosition}% 30%, ${colors.primary}10, transparent 70%)`,
                pointerEvents: "none",
              }
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: { xs: 2, sm: 3 },
                position: "relative",
              }}
            >
              <Box
                component="img"
                alt="Ebix Logo"
                src={logo}
                sx={{
                  height: { xs: 50, sm: 60, md: 70 },
                  width: "auto",
                  objectFit: "contain",
                  animation: "pulse 2s ease-in-out infinite",
                  "@keyframes pulse": {
                    "0%, 100%": { 
                      transform: "scale(1)",
                      filter: "drop-shadow(0 4px 8px rgba(3,120,166,0.2))"
                    },
                    "50%": { 
                      transform: "scale(1.05)",
                      filter: "drop-shadow(0 8px 16px rgba(3,120,166,0.4))"
                    },
                  }
                }}
              />
            </Box>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.2rem" },
                letterSpacing: "-0.5px",
                textAlign: "center",
                position: "relative",
                minHeight: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
                width: "100%",
                lineHeight: 1.3,
                "&::after": currentLength < fullText.length ? {
                  content: '"|"',
                  position: "absolute",
                  right: -8,
                  color: colors.primary,
                  animation: "blink 1s infinite",
                  "@keyframes blink": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0 }
                  }
                } : {}
              }}
            >
              {fullText.substring(0, currentLength)}
            </Typography>

            <Fade in={showSubtext} timeout={1000}>
              <Typography 
                variant="body1" 
                sx={{ 
                  mt: { xs: 2, sm: 3 }, 
                  color: colors.text.secondary,
                  maxWidth: 500,
                  lineHeight: 1.5,
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                  opacity: showSubtext ? 1 : 0,
                  transition: "opacity 1s ease",
                  textAlign: "center",
                  px: { xs: 1, sm: 2 }
                }}
              >
                If you want to leave this page and manage this realm, please click the
                corresponding menu items available in the Site Map on the APP BAR or simply search that module.
              </Typography>
            </Fade>

            {/* Decorative elements - smaller on mobile */}
            <Box
              sx={{
                display: "flex",
                gap: { xs: 1, sm: 1.5 },
                mt: { xs: 3, sm: 4 },
                "& > *": {
                  width: { xs: 5, sm: 6, md: 8 },
                  height: { xs: 5, sm: 6, md: 8 },
                  borderRadius: "50%",
                  background: colors.primary,
                  opacity: 0.3,
                  animation: "bounce 1.5s ease-in-out infinite",
                },
                "& > *:nth-of-type(1)": {
                  background: colors.primary,
                  animationDelay: "0s",
                },
                "& > *:nth-of-type(2)": {
                  background: colors.secondary,
                  animationDelay: "0.2s",
                },
                "& > *:nth-of-type(3)": {
                  background: colors.accent,
                  animationDelay: "0.4s",
                },
                "@keyframes bounce": {
                  "0%, 100%": { transform: "translateY(0)" },
                  "50%": { transform: "translateY(-8px)" }
                }
              }}
            >
              <Box />
              <Box />
              <Box />
            </Box>
          </Paper>
        </Zoom>
      </Box>
    </Box>
  );
};

export default WelcomePage;