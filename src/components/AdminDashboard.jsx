import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { IconButton, Tooltip } from '@mui/material';
import { useThemeContext } from '../context/ThemeContext';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Select,
  Snackbar,
  MenuItem,
  Divider,
  Alert,
  Button,
  Chip,
  Paper,
  Avatar,
  LinearProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const AdminDashboard = () => {
    const {darkMode, toggleDarkMode} = useThemeContext();
  const { user, socket, logout } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/orders");
        //console.log('Frontend received orders:', res.data);
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrders();

    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit("joinAdminRoom");
      socket.on("newOrder", ({ orderId, username, message }) => {
        console.log("Received new order:", { orderId, username, message });
        setNotification({ message, orderId, username });
      });
      return () => socket.off("newOrder");
    }
  }, [socket]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await axios.put(`/orders/${orderId}`, { status: newStatus });
      setOrders(
        orders.map((order) => (order._id === orderId ? res.data : order))
      );

      if (newStatus == "Delivered") {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#ff6b6b", "#feca57", "#48dbfb", "#1dd1a1"],
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "In Transit":
        return "info";
      case "Delivered":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
      background: darkMode
          ? "linear-gradient(135deg, #121212 0%, #1e1e1e 100%)"
          : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: { xs: 2, md: 4 },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Paper
          elevation={20}
          sx={{
            borderRadius: "24px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            overflow: "hidden",
            background: darkMode ? 'rgba(40, 40, 40, 0.95)' : 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(90deg, #ff6b6b, #feca57)",
              padding: { xs: 4, md: 5 },
              color: "white",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                textShadow: "2px 2px 8px rgba(0,0,0,0.3)",
                letterSpacing: 1,
              }}
            >
              Welcome, {user?.username} 👨‍💼
            </Typography>
            <Typography variant="h6" sx={{ mt: 1, opacity: 0.9 }}>
              Admin Control Center
            </Typography>
            <Button
              variant="contained"
              color="error"
              onClick={handleLogout}
              sx={{
                mt: 3,
                borderRadius: "50px",
                px: 4,
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              Logout
            </Button>
            <Tooltip title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}>
  <IconButton
    onClick={toggleDarkMode}
                  sx={{
                    color: 'white',
                    background: 'rgba(255,255,255,0.2)',
                    '&:hover': { background: 'rgba(255,255,255,0.3)' },
                  }}
  >
    {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
  </IconButton>
</Tooltip>
          </Box>
          <Box sx={{ p: { xs: 3, md: 5 } }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                background: "linear-gradient(90deg, #ff6b6b, #feca57)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "bold",
              }}
            >
              Manage Orders
            </Typography>
            <AnimatePresence>
              {orders.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    textAlign="center"
                    sx={{ my: 8 }}
                  >
                    No orders yet. Waiting for hungry customers! 🍔
                  </Typography>
                </motion.div>
              ) : (
                <List>
                  {orders.map((order, index) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Paper
                        elevation={8}
                        sx={{
                          mb: 3,
                          borderRadius: "16px",
                          overflow: "hidden",
                          background: darkMode ? 'rgba(40, 40, 40, 0.95)' : 'rgba(255,255,255,0.9)',
                          backdropFilter: 'blur(20px)',
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          transition: "all 0.3s",
                          "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: darkMode 
                              ? "0 20px 40px rgba(0,0,0,0.5)" 
                              : "0 20px 40px rgba(0,0,0,0.2)",
                          },
                        }}
                      >
                        <ListItem sx={{
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        gap: 2,
      }}>
                          <ListItemText
                            primary={
                              <Typography
                                variant="h6"
                                fontWeight="bold"
                                sx={{ color: darkMode ? '#e0e0e0' : '#333333' }}
                              >
                                Order #{order._id.substring(0, 8)}
                              </Typography>
                            }
                            secondary={
                              <Box sx={{ mt: 1 }}>
                                <Typography
                                  component="span"
                                  variant="body1"
                                  sx={{ color: darkMode ? '#e0e0e0' : '#333333' }}
                                >
                                  <strong>Customer:</strong>{" "}
                                  {order.userId?.username || "Unknown"}
                                </Typography>
                                <br />
                                <Typography
                                  component="span"
                                  variant="body2"
                                  sx={{ color: darkMode ? '#b0b0b0' : '#555555' }}
                                >
                                  <strong>Address:</strong> {order.address}
                                </Typography>
                                <br />
                                <Typography
                                  component="span"
                                  variant="body2"
                                  sx={{ color: darkMode ? '#b0b0b0' : '#555555' }}
                                >
                                  <strong>Items:</strong>{" "}
                                  {order.items
                                    .map(
                                      (i) =>
                                        `${i.foodId?.name || "Unknown"} x${
                                          i.quantity
                                        } ($${i.foodId?.price || 0})`
                                    )
                                    .join(", ")}
                                </Typography>
                                <br />
                                <Chip
                                  label={`Ratings: ${
                                    order.ratings.length > 0
                                      ? order.ratings.length
                                      : "None"
                                  }`}
                                  size="small"
                                 color={order.ratings.length > 0 ? "success" : "default"}
                                  sx={{ 
                                    mt: 1,
                                    background: order.ratings.length > 0 
                                      ? (darkMode ? '#1db954' : undefined)
                                      : undefined
                                  }}
                                />
                              </Box>
                            }
                          />
                          <Box sx={{ textAlign: "right" }}>
                            <Chip
                              label={order.status}
                              color={getStatusColor(order.status)}
                              variant="filled"
                              sx={{
                                fontWeight: "bold",
                                mb: 2,
                                px: 2,
                                borderRadius: "50px",
                              }}
                            />
                            <Select
                              value={order.status}
                              onChange={(e) =>
                                updateOrderStatus(order._id, e.target.value)
                              }
                              size="small"
                              sx={{
                                minWidth: 140,
                                borderRadius: "12px",
                                background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)',
                                color: darkMode ? '#ffffff' : 'inherit',
                                '& .MuiSelect-icon': {
                                  color: darkMode ? '#ffffff' : 'inherit',
                                },
                              }}
                            >
                              <MenuItem value="Pending">Pending</MenuItem>
                              <MenuItem value="In Transit">In Transit</MenuItem>
                              <MenuItem value="Delivered">Delivered</MenuItem>
                            </Select>
                          </Box>
                        </ListItem>
                        <Divider sx={{ bgcolor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }} />
                      </Paper>
                    </motion.div>
                  ))}
                </List>
              )}
            </AnimatePresence>
          </Box>
        </Paper>
      </motion.div>

      <Snackbar
        open={notification}
        autoHideDuration={6000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={notification?.type === "new" ? "success" : "info"}
          variant="filled"
          onClose={() => setNotification(null)}
          sx={{
            borderRadius: "16px",
            fontWeight: "bold",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          }}
        >
          🎉 {notification?.message} from {notification?.username}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;
