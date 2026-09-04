// Dashboard.jsx - Updated with gradient titles for sections
import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Chip,
  LinearProgress,
  Button,
  Paper,
  Tooltip,
  Fade,
  Container,
  alpha,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Devices as DevicesIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  VpnKey as VpnKeyIcon,
  MenuBook as MenuBookIcon,
  EventNote as EventNoteIcon,
  CloudUpload as CloudUploadIcon,
  Refresh as RefreshIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { FiTrendingUp, FiUsers, FiMonitor } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { UserManagementAPI } from "./apiEndpoints";
import { ClientDetailsAPI } from "./apiEndpoints";
import { motion } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { HAxiosService, HPaper, useToast } from "@helix/component-library";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

// Modern color palette matching Account List
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
  warning: '#f59e0b',
  info: '#3b82f6',
  success: '#10b981',
  purple: '#8b5cf6',
  pink: '#ec4899',
  indigo: '#6366f1',
  background: {
    start: '#f8fafc',
    end: '#f1f5f9',
    gradient: 'linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%)',
  },
  cardBg: 'rgba(255, 255, 255, 0.98)',
  text: {
    primary: '#0f172a',
    secondary: '#334155',
    light: '#64748b',
    muted: '#94a3b8',
  },
  border: '#e2e8f0',
  hover: '#f1f5f9',
  appBarGradient: 'linear-gradient(135deg, #0378A6 0%, #025a8c 50%, #01406b 100%)',
  titleGradient: 'linear-gradient(90deg, #0378A6 0%, #8dbf41 100%)',
};

const StatCard = ({ title, value, icon, color, subtitle, onClick }) => {
  return (
    <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
      <Card
        onClick={onClick}
        sx={{
          cursor: onClick ? 'pointer' : 'default',
          height: '100%',
          borderRadius: '16px',
          // background: colors.cardBg,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${colors.border}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            // background: `linear-gradient(90deg, ${color} 0%, ${alpha(color, 0.5)} 100%)`,
          },
          '&:hover': {
            boxShadow: `0 20px 30px -10px ${alpha(color, 0.3)}`,
            borderColor: color,
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="caption" sx={{ color: colors.text.light, fontWeight: 500, letterSpacing: 0.5 }}>
                {title}
              </Typography>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  mt: 0.5,
                  background: colors.titleGradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block',
                }}
              >
                {value}
              </Typography>
              {subtitle && (
                <Typography variant="caption" sx={{ color: colors.text.muted, display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Avatar
              sx={{
                bgcolor: alpha(color, 0.1),
                color: color,
                width: 48,
                height: 48,
                borderRadius: '12px',
              }}
            >
              {icon}
            </Avatar>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ModuleCard = ({ title, path, icon, color, stats, description, onClick }) => {
  // Determine if card has stats to display
  const hasStats = stats && Object.keys(stats).length > 0;
  
  return (
    <motion.div variants={itemVariants} whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}>
      <Card
        onClick={() => onClick(path)}
        sx={{
          cursor: 'pointer',
          borderRadius: '16px',
          // background: colors.cardBg,
          border: `1px solid ${colors.border}`,
          transition: 'all 0.3s ease',
          height: '200px', // Fixed height for all cards
          width: '100%', // Full width of grid item
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            boxShadow: `0 20px 30px -10px ${alpha(color, 0.3)}`,
            borderColor: color,
            '& .module-icon': {
              transform: 'scale(1.1) rotate(5deg)',
            },
            '& .manage-button': {
              opacity: 1,
              transform: 'translateX(0)',
            },
          },
        }}
      >
        <CardContent sx={{ 
          p: 2.5, 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%',
          '&:last-child': { pb: 2.5 }
        }}>
          {/* Header with Icon and Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <Avatar
              className="module-icon"
              sx={{
                bgcolor: alpha(color, 0.1),
                color: color,
                width: 40,
                height: 40,
                borderRadius: '10px',
                mr: 1.5,
                transition: 'all 0.3s ease',
              }}
            >
              {icon}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600, 
                  color: colors.text.primary,
                  fontSize: '0.95rem',
                  lineHeight: 1.3,
                  mb: 0.25,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {title}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: colors.text.muted,
                  fontSize: '0.7rem',
                  display: 'block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {description}
              </Typography>
            </Box>
          </Box>

          {/* Stats Section - Centered in the card */}
          {hasStats ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              my: 1,
            }}>
              {Object.entries(stats).map(([key, value]) => (
                <Box key={key} sx={{ textAlign: 'center' }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontWeight: 700, 
                      color: color,
                      fontSize: '1.8rem',
                      lineHeight: 1.2,
                      mb: 0.5,
                    }}
                  >
                    {value}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: colors.text.muted, 
                      display: 'block',
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      fontWeight: 500,
                    }}
                  >
                    {key}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Box sx={{ flex: 1 }} /> // Spacer for cards without stats
          )}
          
          {/* Manage Button - Fixed position at bottom */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            mt: 'auto',
            height: '32px',
          }}>
            <Button
              className="manage-button"
              size="small"
              endIcon={<ArrowForwardIcon sx={{ fontSize: 15 }} />}
              sx={{ 
                color: color, 
                textTransform: 'none', 
                fontWeight: 500,
                fontSize: '0.8rem',
                opacity: 0.8,
                transition: 'all 0.2s ease',
                p: '4px 8px',
                minWidth: '80px',
                '&:hover': {
                  background: alpha(color, 0.1),
                  opacity: 1,
                },
              }}
            >
              Manage
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const realm = sessionStorage.getItem("SEC_REALM");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: { total: 0, active: 0, inactive: 0, dormant: 0 },
    sessions: { total: 0, unique: 0 },
    clients: 0,
  });
  
  const [activityData, setActivityData] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [dataError, setDataError] = useState(false);

  useEffect(() => {
    if (realm) {
      fetchDashboardData();
    }
  }, [realm, refreshKey]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setDataError(false);
    
    try {
      // Fetch users
      let users = [];
      try {
        const usersRes = await HAxiosService.GET(UserManagementAPI.fetch_users(realm)); 
        users = usersRes.data || [];
      } catch (error) {
        console.error("Error fetching users:", error);
        setDataError(true);
      }
      
      // Fetch sessions
      let sessions = [];
      try {
        const sessionsRes = await HAxiosService.GET(UserManagementAPI.fetch_all_users_sessions(realm));
        sessions = sessionsRes.data || [];
      } catch (error) {
        console.error("Error fetching sessions:", error);
        setDataError(true);
      }
      
      // Fetch clients
      let clients = [];
      try {
        const clientsRes = await HAxiosService.GET(ClientDetailsAPI.GET_CLIENTS_BY_REALM(realm));
        clients = clientsRes.data || [];
      } catch (error) {
        console.error("Error fetching clients:", error);
        setDataError(true);
      }

      // Process user stats
      const activeUsers = users.filter(u => {
        const status = u.status?.toLowerCase?.() || '';
        return status === 'active' || status === 'ACTIVE';
      }).length;
      
      const inactiveUsers = users.filter(u => {
        const status = u.status?.toLowerCase?.() || '';
        return status === 'inactive' || status === 'INACTIVE';
      }).length;
      
      const dormantUsers = users.filter(u => {
        const status = u.status?.toLowerCase?.() || '';
        return status === 'dormant' || status === 'DORMANT';
      }).length;

      // If no status data, calculate based on user properties
      let finalActiveUsers = activeUsers;
      let finalInactiveUsers = inactiveUsers;
      let finalDormantUsers = dormantUsers;

      if (users.length > 0 && activeUsers === 0 && inactiveUsers === 0 && dormantUsers === 0) {
        users.forEach(user => {
          if (user.enabled === true || user.enabled === 'true' || user.enabled === 1) {
            finalActiveUsers++;
          } else if (user.enabled === false || user.enabled === 'false' || user.enabled === 0) {
            finalInactiveUsers++;
          } else {
            finalActiveUsers = users.length;
          }
        });
      }

      // Process session stats
      const uniqueUserSessions = new Set(sessions.map(s => s.username || s.userName)).size;

      // Group sessions by day
      const sessionsByDay = {};
      sessions.forEach(session => {
        if (session.start) {
          const date = new Date(session.start);
          const day = date.toLocaleDateString('en-US', { weekday: 'short' });
          sessionsByDay[day] = (sessionsByDay[day] || 0) + 1;
        }
      });

      // Create activity data
      const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const last7Days = daysOfWeek.map(day => ({
        date: day,
        users: Math.floor(users.length / 7) || 0,
        sessions: sessionsByDay[day] || 0,
      }));

      setStats({
        users: { 
          total: users.length || 0, 
          active: finalActiveUsers || 0, 
          inactive: finalInactiveUsers || 0, 
          dormant: finalDormantUsers || 0 
        },
        sessions: { 
          total: sessions.length || 0, 
          unique: uniqueUserSessions || 0 
        },
        clients: clients.length || 0,
      });
      
      setActivityData(last7Days);
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setDataError(true);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    toast.success("Dashboard refreshed");
  };

  const handleNavigate = (path) => {
    navigate(`/homelayout/${path}`);
  };

  // Filter out zero values for pie chart
  const userStatusData = [
    { name: 'Active', value: stats.users.active, color: colors.success },
    { name: 'Inactive', value: stats.users.inactive, color: colors.warning },
    { name: 'Dormant', value: stats.users.dormant, color: colors.accent },
  ].filter(item => item.value > 0);

  const hasUserData = stats.users.total > 0;
  const hasSessionData = stats.sessions.total > 0;

  // Custom pie chart label (simplified to show only percentage)
  const renderCustomizedLabel = ({ percent, x, y, cx, cy }) => {
    const isRightSide = x > cx;
    const offsetX = isRightSide ? 10 : -10;
    
    return (
      <text 
        x={x + offsetX} 
        y={y} 
        fill={colors.text.primary}
        textAnchor={isRightSide ? "start" : "end"}
        dominantBaseline="central"
        style={{
          fontSize: '11px',
          fontWeight: 600,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', p: 4 }}>
        <LinearProgress sx={{ mb: 2, color: colors.primary }} />
        <Typography align="center" color="textSecondary" sx={{ fontFamily: "'Inter', sans-serif" }}>
          Loading dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={800}>
      <Box
        sx={{
          // background: colors.background.gradient,
          // minHeight: 'calc(100vh - 64px)',
          py: 1,
          px: { xs: 1, sm: 2, md: 3 },
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
          {/* Header with Account List styling */}
          <HPaper
            elevation={2}
            sx={{
              borderRadius: '12px',
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.border}`,
              boxShadow: `0 4px 12px ${colors.primary}10`,
              overflow: 'hidden',
              mb: 3,
            }}
          >
            <Box
              sx={{
                px: { xs: 2, sm: 3 },
                py: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 700,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: { xs: 16, sm: 18 },
                  background: colors.titleGradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textTransform: "uppercase",
                  whiteSpace: "nowrap"
                }}
              >
                Dashboard Overview
              </Typography>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
                <Chip
                  icon={<FiUsers size={14} />}
                  label={`${stats.users.total} Total Users`}
                  size="small"
                  sx={{
                    bgcolor: alpha(colors.primary, 0.1),
                    color: colors.primary,
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                  }}
                />
                <Chip
                  icon={<FiMonitor size={14} />}
                  label={`${stats.sessions.total} Active Sessions`}
                  size="small"
                  sx={{
                    bgcolor: alpha(colors.secondary, 0.1),
                    color: colors.secondary,
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                  }}
                />
                <Chip
                  icon={<FiTrendingUp size={14} />}
                  label={`${stats.clients} Products`}
                  size="small"
                  sx={{
                    bgcolor: alpha(colors.purple, 0.1),
                    color: colors.purple,
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                  }}
                />
              </Box>

              <Tooltip title="Refresh Dashboard">
                <IconButton 
                  onClick={handleRefresh} 
                  size="small"
                  sx={{ 
                    bgcolor: colors.hover, 
                    border: `1px solid ${colors.border}`,
                    '&:hover': {
                      bgcolor: alpha(colors.primary, 0.1),
                      borderColor: colors.primary,
                    }
                  }}
                >
                  <RefreshIcon fontSize="small" sx={{ color: colors.text.primary }} />
                </IconButton>
              </Tooltip>
            </Box>
          </HPaper>

          {/* Key Metrics */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <StatCard
                  title="Total Users"
                  value={stats.users.total}
                  icon={<PeopleIcon />}
                  color={colors.primary}
                  subtitle={hasUserData ? `${stats.users.active} active · ${stats.users.inactive} inactive · ${stats.users.dormant} dormant` : 'No user data'}
                  onClick={() => handleNavigate('users')}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <StatCard
                  title="Active Sessions"
                  value={stats.sessions.total}
                  icon={<DevicesIcon />}
                  color={colors.secondary}
                  subtitle={hasSessionData ? `${stats.sessions.unique} unique users` : 'No session data'}
                  onClick={() => handleNavigate('sessions')}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <StatCard
                  title="Products"
                  value={stats.clients}
                  icon={<DashboardIcon />}
                  color={colors.purple}
                  subtitle="Active applications"
                  onClick={() => handleNavigate('clients')}
                />
              </Grid>
            </Grid>

            {/* Charts Section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, md: 8 }}>
                <HPaper
                  sx={{
                    p: { xs: 2, sm: 3 },
                    borderRadius: '16px',
                    // background: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    height: '100%',
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      mb: 3,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: { xs: '1rem', sm: '1.25rem' },
                      background: colors.titleGradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      display: 'inline-block',
                    }}
                  >
                    Activity Overview (Last 7 Days)
                  </Typography>
                  
                  {hasSessionData ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={activityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                        <XAxis 
                          dataKey="date" 
                          stroke={colors.text.light}
                          tick={{ fontFamily: "'Inter', sans-serif", fontSize: 12 }}
                        />
                        <YAxis 
                          stroke={colors.text.light}
                          tick={{ fontFamily: "'Inter', sans-serif", fontSize: 12 }}
                        />
                        <RechartsTooltip 
                          contentStyle={{ 
                            borderRadius: '8px', 
                            border: `1px solid ${colors.border}`,
                            fontFamily: "'Inter', sans-serif"
                          }}
                        />
                        <Legend 
                          wrapperStyle={{ 
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 12
                          }}
                        />
                        <Bar dataKey="users" fill={colors.primary} name="New Users" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="sessions" fill={colors.secondary} name="Sessions" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                      <Typography color="textSecondary" fontFamily="'Inter', sans-serif">
                        No activity data available
                      </Typography>
                    </Box>
                  )}
                </HPaper>
              </Grid>
              
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper
                  sx={{
                    p: { xs: 2, sm: 3 },
                    borderRadius: '16px',
                    background: colors.cardBg,
                    border: `1px solid ${colors.border}`,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      mb: 2,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: { xs: '1rem', sm: '1.25rem' },
                      background: colors.titleGradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      display: 'inline-block',
                      textAlign: 'center',
                    }}
                  >
                    User Status Distribution
                  </Typography>
                  
                  {/* Stats on Top */}
                  {hasUserData && userStatusData.length > 0 && (
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      gap: 3, 
                      flexWrap: 'wrap',
                      mb: 2,
                      pb: 2,
                      borderBottom: `1px solid ${colors.border}`,
                    }}>
                      {userStatusData.map((item) => (
                        <Box key={item.name} sx={{ textAlign: 'center' }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 700, 
                              color: item.color,
                              fontSize: '1.5rem',
                              lineHeight: 1.2,
                            }}
                          >
                            {item.value}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: colors.text.muted,
                              fontSize: '0.7rem',
                              textTransform: 'uppercase',
                              fontWeight: 500,
                            }}
                          >
                            {item.name}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
                  
                  {/* Pie Chart */}
                  {hasUserData && userStatusData.length > 0 ? (
                    <Box sx={{ flex: 1, minHeight: 200, width: '100%' }}>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={userStatusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={3}
                            dataKey="value"
                            label={renderCustomizedLabel}
                            labelLine={{ 
                              stroke: colors.text.light, 
                              strokeWidth: 1,
                              strokeDasharray: '3 3',
                            }}
                          >
                            {userStatusData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.color}
                                stroke={colors.cardBg}
                                strokeWidth={2}
                              />
                            ))}
                          </Pie>
                          <RechartsTooltip 
                            contentStyle={{ 
                              borderRadius: '8px', 
                              border: `1px solid ${colors.border}`,
                              fontFamily: "'Inter', sans-serif"
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="textSecondary" fontFamily="'Inter', sans-serif">
                        {hasUserData ? 'No status information available' : 'No user data available'}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>

            {/* Quick Access Modules */}
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600, 
                mb: 3,
                fontFamily: "'Inter', sans-serif",
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                background: colors.titleGradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
              }}
            >
              Quick Access
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ModuleCard
                  title="Products"
                  path="clients"
                  icon={<DashboardIcon />}
                  color={colors.purple}
                  description="Manage applications and products"
                  stats={{ PRODUCTS: stats.clients }}
                  onClick={handleNavigate}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ModuleCard
                  title="User Management"
                  path="users"
                  icon={<PeopleIcon />}
                  color={colors.primary}
                  description="Manage users, roles, and permissions"
                  stats={{ TOTAL: stats.users.total }}
                  onClick={handleNavigate}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ModuleCard
                  title="Menu Access"
                  path="access"
                  icon={<MenuBookIcon />}
                  color={colors.primary}
                  description="Configure menu permissions"
                  onClick={handleNavigate}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ModuleCard
                  title="Password Policy"
                  path="password-policy"
                  icon={<VpnKeyIcon />}
                  color={colors.indigo}
                  description="Configure password rules"
                  onClick={handleNavigate}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ModuleCard
                  title="Event Settings"
                  path="event"
                  icon={<EventNoteIcon />}
                  color={colors.secondary}
                  description="Configure system events"
                  onClick={handleNavigate}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ModuleCard
                  title="Upload Users"
                  path="upload-users"
                  icon={<CloudUploadIcon />}
                  color={colors.warning}
                  description="Bulk user upload"
                  onClick={handleNavigate}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ModuleCard
                  title="Authentication Flows"
                  path="authentication-flows"
                  icon={<SecurityIcon />}
                  color={colors.success}
                  description="Configure auth flows"
                  onClick={handleNavigate}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ModuleCard
                  title="LDAP Providers"
                  path="ldap-providers"
                  icon={<SettingsIcon />}
                  color={colors.pink}
                  description="Manage LDAP connections"
                  onClick={handleNavigate}
                />
              </Grid>
              
            </Grid>
          </motion.div>
        </Container>
      </Box>
    </Fade>
  );
};

export default Dashboard;