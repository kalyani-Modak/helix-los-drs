import React from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
  LabelList
} from "recharts";
import { Box, Paper, Typography, useTheme, useMediaQuery, alpha } from "@mui/material";

const colors = {
  primary: '#0378A6',
  secondary: '#8dbf41',
  accent: '#bf0404',
  primaryLight: '#4aa3d9',
  secondaryLight: '#a8d173',
  accentLight: '#f44336',
  warning: '#f59e0b',
  info: '#3b82f6',
  success: '#10b981',
  purple: '#8b5cf6',
  text: {
    primary: '#0f172a',
    secondary: '#334155',
    light: '#64748b',
  },
  chart: {
    bar1: '#0378A6',
    bar2: '#8dbf41',
    bar3: '#f59e0b',
    bar4: '#8b5cf6',
    pie1: '#0378A6',
    pie2: '#8dbf41',
    pie3: '#f59e0b',
    pie4: '#bf0404',
    pie5: '#4aa3d9',
    line1: '#0378A6',
    line2: '#8dbf41',
    area1: 'rgba(3, 120, 166, 0.3)',
    area2: 'rgba(141, 191, 65, 0.3)',
  }
};

const CollectorDashboardRecharts = ({ isMobile = false }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Determine chart dimensions based on screen size
  const getChartDimensions = () => {
    if (isMobile) {
      return { height: 250, outerRadius: 80, innerRadius: 40 };
    }
    if (isTablet) {
      return { height: 280, outerRadius: 100, innerRadius: 50 };
    }
    return { height: 300, outerRadius: 120, innerRadius: 60 };
  };

  const { height, outerRadius, innerRadius } = getChartDimensions();

  // Enhanced sample data with more meaningful values
  const monthlyPerformanceData = [
    { month: "Jan", allocated: 85, resolved: 65, collected: 95000, target: 100000 },
    { month: "Feb", allocated: 92, resolved: 78, collected: 112000, target: 110000 },
    { month: "Mar", allocated: 88, resolved: 82, collected: 128000, target: 120000 },
    { month: "Apr", allocated: 95, resolved: 85, collected: 135000, target: 130000 },
    { month: "May", allocated: 90, resolved: 88, collected: 142000, target: 140000 },
    { month: "Jun", allocated: 98, resolved: 92, collected: 158000, target: 150000 },
  ];

  const bucketDistributionData = [
    { name: "Bucket 1", value: 245, color: colors.chart.pie1, percentage: 35 },
    { name: "Bucket 2", value: 180, color: colors.chart.pie2, percentage: 26 },
    { name: "Bucket 3", value: 135, color: colors.chart.pie3, percentage: 19 },
    { name: "Bucket 4", value: 95, color: colors.chart.pie4, percentage: 14 },
    { name: "Bucket 5", value: 45, color: colors.chart.pie5, percentage: 6 },
  ];

  const collectorPerformanceData = [
    { name: "John D.", accounts: 45, resolved: 38, amount: 450000, efficiency: 84 },
    { name: "Sarah M.", accounts: 52, resolved: 47, amount: 520000, efficiency: 90 },
    { name: "Mike R.", accounts: 38, resolved: 32, amount: 380000, efficiency: 84 },
    { name: "Lisa W.", accounts: 41, resolved: 39, amount: 410000, efficiency: 95 },
    { name: "Tom B.", accounts: 35, resolved: 31, amount: 350000, efficiency: 89 },
  ];

  const weeklyTrendData = [
    { day: "Mon", calls: 45, promises: 32, collections: 85000 },
    { day: "Tue", calls: 52, promises: 41, collections: 92000 },
    { day: "Wed", calls: 48, promises: 38, collections: 88000 },
    { day: "Thu", calls: 55, promises: 45, collections: 105000 },
    { day: "Fri", calls: 60, promises: 52, collections: 118000 },
    { day: "Sat", calls: 42, promises: 35, collections: 78000 },
  ];

  // Custom tooltip component for better styling
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{
          p: 1.5,
          backgroundColor: alpha('#ffffff', 0.95),
          border: `1px solid ${colors.border}`,
          borderRadius: 2,
          boxShadow: `0 4px 12px ${colors.primary}20`,
        }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: colors.text.primary }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Typography key={index} variant="caption" sx={{ 
              display: 'block',
              color: entry.color,
              mt: 0.5,
            }}>
              {`${entry.name}: ${entry.name.includes('₹') || entry.name.includes('Amount') 
                ? `₹${entry.value.toLocaleString('en-IN')}` 
                : entry.value}`}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  // Format currency for tooltips
  const formatCurrency = (value) => `₹${value.toLocaleString('en-IN')}`;

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? 2 : 3,
    }}>
      {/* First Row - Two Charts */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: isMobile ? 2 : 3,
      }}>
        {/* Monthly Performance Chart */}
        <Paper sx={{
          p: isMobile ? 2 : 3,
          backgroundColor: alpha('#ffffff', 0.9),
          borderRadius: 3,
          border: `1px solid ${colors.border}`,
          boxShadow: `0 8px 20px ${colors.primary}15`,
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 16px 30px ${colors.primary}25`,
          }
        }}>
          <Typography variant="h6" sx={{ 
            mb: 2,
            fontSize: isMobile ? 16 : 18,
            fontWeight: 600,
            color: colors.text.primary,
            borderBottom: `2px solid ${colors.primary}`,
            pb: 1,
            display: 'inline-block',
          }}>
            Monthly Collection Performance
          </Typography>
          <Box sx={{ width: '100%', height: height }}>
            <ResponsiveContainer>
              <ComposedChart data={monthlyPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: isMobile ? 10 : 12, fill: colors.text.secondary }}
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fontSize: isMobile ? 10 : 12, fill: colors.text.secondary }}
                  tickFormatter={(value) => `${value}`}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right"
                  tick={{ fontSize: isMobile ? 10 : 12, fill: colors.text.secondary }}
                  tickFormatter={formatCurrency}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: isMobile ? 10 : 12, paddingTop: 10 }}
                />
                <Bar 
                  yAxisId="left"
                  dataKey="allocated" 
                  fill={colors.chart.bar1} 
                  name="Accounts Allocated"
                  radius={[4, 4, 0, 0]}
                  barSize={isMobile ? 12 : 16}
                />
                <Bar 
                  yAxisId="left"
                  dataKey="resolved" 
                  fill={colors.chart.bar2} 
                  name="Accounts Resolved"
                  radius={[4, 4, 0, 0]}
                  barSize={isMobile ? 12 : 16}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="collected" 
                  stroke={colors.accent} 
                  name="Amount Collected"
                  strokeWidth={3}
                  dot={{ r: 4, fill: colors.accent }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        {/* Bucket Distribution Pie Chart */}
        <Paper sx={{
          p: isMobile ? 2 : 3,
          backgroundColor: alpha('#ffffff', 0.9),
          borderRadius: 3,
          border: `1px solid ${colors.border}`,
          boxShadow: `0 8px 20px ${colors.primary}15`,
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 16px 30px ${colors.primary}25`,
          }
        }}>
          <Typography variant="h6" sx={{ 
            mb: 2,
            fontSize: isMobile ? 16 : 18,
            fontWeight: 600,
            color: colors.text.primary,
            borderBottom: `2px solid ${colors.secondary}`,
            pb: 1,
            display: 'inline-block',
          }}>
            Account Distribution by Bucket
          </Typography>
          <Box sx={{ width: '100%', height: height }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={bucketDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={!isMobile}
                  outerRadius={outerRadius}
                  innerRadius={innerRadius}
                  fill="#8884d8"
                  dataKey="value"
                  label={!isMobile ? ({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)` : null}
                  paddingAngle={2}
                >
                  {bucketDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                {!isMobile && <Legend />}
              </PieChart>
            </ResponsiveContainer>
          </Box>
          {isMobile && (
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {bucketDistributionData.map((item, index) => (
                <Box key={index} sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  mr: 2,
                  mb: 1,
                }}>
                  <Box sx={{ 
                    width: 12, 
                    height: 12, 
                    backgroundColor: item.color,
                    borderRadius: '50%',
                    mr: 0.5,
                  }} />
                  <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                    {item.name} ({item.percentage}%)
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      </Box>

      {/* Third Row - Weekly Trend */}
      <Paper sx={{
        p: isMobile ? 2 : 3,
        backgroundColor: alpha('#ffffff', 0.9),
        borderRadius: 3,
        border: `1px solid ${colors.border}`,
        boxShadow: `0 8px 20px ${colors.primary}15`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 16px 30px ${colors.primary}25`,
        }
      }}>
        <Typography variant="h6" sx={{ 
          mb: 2,
          fontSize: isMobile ? 16 : 18,
          fontWeight: 600,
          color: colors.text.primary,
          borderBottom: `2px solid ${colors.warning}`,
          pb: 1,
          display: 'inline-block',
        }}>
          Weekly Collection Trend
        </Typography>
        <Box sx={{ width: '100%', height: height }}>
          <ResponsiveContainer>
            <AreaChart data={weeklyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: isMobile ? 10 : 12, fill: colors.text.secondary }}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fontSize: isMobile ? 10 : 12, fill: colors.text.secondary }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right"
                tick={{ fontSize: isMobile ? 10 : 12, fill: colors.text.secondary }}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: isMobile ? 10 : 12, paddingTop: 10 }}
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="calls" 
                stackId="1"
                stroke={colors.chart.line1}
                fill={colors.chart.area1}
                name="Calls Made"
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="promises" 
                stackId="1"
                stroke={colors.chart.line2}
                fill={colors.chart.area2}
                name="Promises Received"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="collections" 
                stroke={colors.accent} 
                name="Collections (₹)"
                strokeWidth={3}
                dot={{ r: 4, fill: colors.accent }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
};

export default CollectorDashboardRecharts;