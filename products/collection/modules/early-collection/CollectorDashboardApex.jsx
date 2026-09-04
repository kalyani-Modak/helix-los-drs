import React from "react";
import Chart from "react-apexcharts";
import { Box, Paper, useTheme, useMediaQuery } from "@mui/material";

const colors = {
  primary: '#0378A6',
  secondary: '#8dbf41',
  accent: '#bf0404',
  primaryLight: '#4aa3d9',
  secondaryLight: '#a8d173',
  accentLight: '#f44336',
  text: {
    primary: '#1e293b',
    secondary: '#475569',
  }
};

const CollectorDashboardApex = ({ isMobile = false }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const fontSize = isMobile ? 10 : 12;
  const chartHeight = isMobile ? 70 : 90;

  // Helper function to format numbers with k notation
  const formatNumber = (value) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return value.toString();
  };

  // Sample Data
  const allocatedResolvedData = {
    categories: ["Jan", "Feb", "Mar"],
    allocated: [50, 80, 70],
    resolved: [30, 60, 50],
  };

  const odData = {
    categories: ["Jan", "Feb", "Mar"],
    allocated: [100000, 120000, 110000],
    collected: [80000, 95000, 85000],
  };

  const bucketData = [
    { name: "B1", value: 110, color: colors.accent },
    { name: "B2", value: 50, color: colors.primary },
    { name: "B3", value: 40, color: colors.secondary },
    { name: "B12", value: 13, color: colors.primaryLight },
  ];

  // Common Chart Options
  const commonOptions = {
    chart: {
      fontFamily: "'Inter', sans-serif",
      toolbar: { show: false },
      offsetY: isMobile ? 5 : 10,
      dropShadow: {
        enabled: true,
        top: 3,
        left: 2,
        blur: 3,
        opacity: 0.35,
        color: "#0378A6",
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      },
      background: 'transparent',
    },
    tooltip: { 
      enabled: true, 
      style: { fontSize: `${fontSize}px`, fontFamily: "'Inter', sans-serif" },
      theme: isDark ? 'dark' : 'light',
    },
    legend: { 
      show: isMobile ? false : true,
      position: "top", 
      offsetY: -15, 
      labels: { 
        fontSize: `${fontSize}px`, 
        colors: isDark ? '#f1f5f9' : colors.text.primary,
        fontFamily: "'Inter', sans-serif",
      } 
    },
    yaxis: { 
      labels: { 
        style: { 
          fontSize: `${fontSize}px`,
          fontFamily: "'Inter', sans-serif",
          colors: isDark ? '#f1f5f9' : colors.text.secondary,
        } 
      },
      axisBorder: { show: true, color: colors.primaryLight },
      axisTicks: { show: true, color: colors.primaryLight },
    },
    xaxis: { 
      labels: { 
        style: { 
          fontSize: `${fontSize}px`,
          fontFamily: "'Inter', sans-serif",
          colors: isDark ? '#f1f5f9' : colors.text.secondary,
        } 
      },
      axisBorder: { show: true, color: colors.primaryLight },
      axisTicks: { show: true, color: colors.primaryLight },
    },
    grid: { 
      padding: { top: -45, bottom: -12 },
      borderColor: isDark ? '#475569' : '#e2e8f0',
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: [colors.secondaryLight, colors.primaryLight],
        inverseColors: false,
        opacityFrom: 0.9,
        opacityTo: 0.5,
        stops: [0, 100]
      },
    },
  };

  // Allocated vs Resolved Chart
  const allocatedResolvedOptions = {
    ...commonOptions,
    plotOptions: { 
      bar: { 
        horizontal: false, 
        columnWidth: isMobile ? "30%" : "20%",
        borderRadius: 4,
        colors: {
          ranges: [{
            from: 0,
            to: 100,
            color: colors.primary
          }]
        }
      } 
    },
    xaxis: { 
      categories: allocatedResolvedData.categories, 
      labels: { style: { fontSize: `${fontSize}px` } } 
    },
    colors: [colors.primary, colors.secondary],
  };
  
  const allocatedResolvedSeries = [
    { name: "# Allocated", data: allocatedResolvedData.allocated },
    { name: "# Resolved", data: allocatedResolvedData.resolved },
  ];

  // OD Allocated vs Collected Chart
  const odOptions = {
    ...commonOptions,
    plotOptions: { 
      bar: { 
        horizontal: true, 
        barHeight: isMobile ? "40%" : "30%",
        borderRadius: 4,
      } 
    },
    yaxis: { 
      labels: { 
        style: { fontSize: `${fontSize}px` }
      } 
    },
    xaxis: { 
      categories: odData.categories,
      labels: { 
        style: { fontSize: `${fontSize}px` },
        formatter: formatNumber
      }
    },
    tooltip: {
      y: {
        formatter: (value) => `₹${value.toLocaleString('en-IN')}`,
      },
    },
    colors: [colors.primary, colors.secondary],
  };
  
  const odSeries = [
    { name: "₹ Allocated", data: odData.allocated },
    { name: "₹ Collected", data: odData.collected },
  ];

  // Bucket-wise Chart
  const bucketOptions = {
    chart: {
      ...commonOptions.chart,
      dropShadow: {
        enabled: true,
        top: 3,
        left: 2,
        blur: 4,
        opacity: 0.35,
        color: "#0378A6",
      },
    },
    labels: bucketData.map((d) => d.name),
    colors: bucketData.map(d => d.color),
    legend: { 
      show: !isMobile,
      position: "right", 
      labels: { 
        fontSize: `${fontSize}px`,
        fontFamily: "'Inter', sans-serif",
        colors: isDark ? '#f1f5f9' : colors.text.primary,
      }, 
      offsetY: -40,
      markers: {
        shape: 'circle',
        size: 6,
        strokeWidth: 0,
      },
    },
    dataLabels: { 
      enabled: isMobile ? true : false,
      style: { 
        fontSize: `${fontSize}px`,
        fontFamily: "'Inter', sans-serif",
        colors: ['#ffffff'],
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        opacity: 0.45
      }
    },
    tooltip: { 
      enabled: true, 
      style: { fontSize: `${fontSize}px`, fontFamily: "'Inter', sans-serif" },
      y: {
        formatter: (value) => `${value} accounts`,
      }
    },
    stroke: {
      width: 0,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: "vertical",
        shadeIntensity: 0.3,
        gradientToColors: bucketData.map(d => {
          if (d.color === colors.accent) return colors.accentLight;
          if (d.color === colors.primary) return colors.primaryLight;
          if (d.color === colors.secondary) return colors.secondaryLight;
          return d.color;
        }),
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 0.8,
        stops: [0, 90, 100]
      }
    },
    responsive: [{
      breakpoint: 600,
      options: {
        chart: {
          offsetY: 0,
        },
        legend: {
          show: false
        },
        dataLabels: {
          enabled: true,
          offsetY: -2,
          style: {
            fontSize: '8px',
          }
        }
      }
    }]
  };
  
  const bucketSeries = bucketData.map((d) => d.value);

  return (
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
      gap: isMobile ? '0.8rem' : '1.5rem',
      alignItems: 'stretch',
      width: '100%',
    }}>
      {/* Column 1 - Allocated vs Resolved Chart */}
      <Box sx={{ minWidth: 0 }}>
        <Paper sx={{ 
          p: isMobile ? 0.5 : 1,
          background: `linear-gradient(135deg, ${colors.primary}05 0%, ${colors.secondary}05 100%)`,
          borderRadius: 2,
          border: `1px solid ${colors.primary}20`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 20px ${colors.primary}30`,
          }
        }}>
          <Chart 
            options={allocatedResolvedOptions} 
            series={allocatedResolvedSeries} 
            type="bar" 
            height={chartHeight} 
          />
        </Paper>
      </Box>

      {/* Column 2 - OD Allocated vs Collected Chart */}
      <Box sx={{ minWidth: 0 }}>
        <Paper sx={{ 
          p: isMobile ? 0.5 : 1,
          background: `linear-gradient(135deg, ${colors.primary}05 0%, ${colors.secondary}05 100%)`,
          borderRadius: 2,
          border: `1px solid ${colors.primary}20`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 20px ${colors.primary}30`,
          }
        }}>
          <Chart 
            options={odOptions} 
            series={odSeries} 
            type="bar" 
            height={chartHeight} 
          />
        </Paper>
      </Box>

      {/* Column 3 - Bucket-wise Accounts Chart */}
      <Box sx={{ minWidth: 0 }}>
        <Paper sx={{ 
          p: isMobile ? 0.5 : 1,
          background: `linear-gradient(135deg, ${colors.primary}05 0%, ${colors.secondary}05 100%)`,
          borderRadius: 2,
          border: `1px solid ${colors.primary}20`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 20px ${colors.primary}30`,
          }
        }}>
          <Chart 
            options={bucketOptions} 
            series={bucketSeries} 
            type="pie" 
            height={isMobile ? 70 : 90} 
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default CollectorDashboardApex;