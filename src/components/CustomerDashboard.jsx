import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import FoodList from "./FoodList";
import Cart from "./Cart";
import Checkout from "./Checkout";
import OrderHistory from "./OrderHistory";
import { useThemeContext } from '../context/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton, Tooltip } from '@mui/material';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Alert,
  Snackbar,
  Button,
  Paper,
  Chip,
  Badge,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
const CustomerDashboard = () => {
  const {darkMode, toggleDarkMode} = useThemeContext();
  const { user, socket, logout,cart} = useContext(AppContext);
  const [tabValue, setTabValue] = useState(0);
  const [orders, setOrders] = useState([]);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    if (tabValue !== 3) return;
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders: ", err);
      }
    };
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [tabValue]);

  useEffect(() => {
    if (socket && user?.id) {
      socket.on("orderUpdate", ({ orderId, status, message }) => {
        console.log("Received order update:", { orderId, status, message });
        setNotification({ orderId, message, status });
        if (status === "Delivered") {
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#ff6b6b", "#feca57", "#48dbfb", "#1dd1a1", "#ff9ff3"],
          });
        }
      });
      return () => socket.off("orderUpdate");
    }
  }, [socket, user]);
  const tabLabels = ["Browse Food", "My Cart", "Checkout", "Order History"];
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: darkMode
          ? "linear-gradient(135deg, #121212 0%, #1e1e1e 100%)"
          : "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -100,
          left: -100,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: darkMode
          ? "linear-gradient(135deg, #121212 0%, #1e1e1e 100%)"
          : "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)",
          animation: "float 25s infinite linear",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -150,
          right: -150,
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: darkMode
          ? "linear-gradient(135deg, #121212 0%, #1e1e1e 100%)"
          : "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)",
          animation: "float 25s infinite reverse",
        }}
      />
      <Box
        sx={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 1400,
          display: "flex",
          alignItems: "center",
          gap: 2,
          background: darkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: "blur(20px)",
          borderRadius: "50px",
          padding: "12px 20px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <motion.div
          key={cartItemCount}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Tooltip title="My Cart">
            <IconButton color="inherit">
              <Badge badgeContent={cartItemCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        </motion.div>

        {/* Dark Mode Toggle */}
        <Tooltip title={darkMode ? "Light Mode" : "Dark Mode"}>
          <IconButton onClick={toggleDarkMode} color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>

        {/* Logout */}
        <Tooltip title="Logout">
          <IconButton onClick={handleLogout} color="inherit">
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ position: "relative", zIndex: 10 }}
      >
        <Paper
          elevation={24}
          sx={{
            borderRadius: "32px",
            margin: { xs: 2, md: 4 },
            mt:{xs:10,md:12},
            overflow: "hidden",
            background: darkMode ? 'rgba(40, 40, 40, 0.95)' : 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(20px)',
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)",
              padding: { xs: 4, md: 6 },
              textAlign: "center",
              color: "white",
            }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="h3"
                fontWeight="bold"
                sx={{
                  textShadow: "3px 3px 10px rgba(0,0,0,0.4)",
                  letterSpacing: 2,
                }}
              >
                Welcome back, {user?.username} 👋
              </Typography>
              <Typography variant="h6" sx={{ mt: 2, opacity: 0.95 }}>
                Ready for something delicious today?
              </Typography>
            </motion.div>
          </Box>
          <Box sx={{ maxWidth: "1400px", mx: "auto", px: { xs: 2, sm: 3, md: 4 } }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTabs-indicator": {
                  height: 4,
                  borderRadius: "2px",
                  background: "linear-gradient(90deg, #ff6b6b, #feca57)",
                  mb:3
                },
              }}
            >
              {tabLabels.map((label, index) => (
                <Tab
                  key={label}
                  label={
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{
                        textTransform: "none",
                        transition: "all 0.3s",
                        "&:hover": { color: "#ff6b6b" },
                      }}
                    >
                      {label}
                    </Typography>
                  }
                  sx={{
                    minWidth: 120,
                    borderRadius: "16px",
                    mx: 1,
                    my: 1,
                    background:
                      tabValue === index
                        ? "rgba(255,107,107,0.15)"
                        : "transparent",
                    transition: "all 0.3s",
                    "&:hover": {
                      background: "rgba(255,107,107,0.1)",
                      transform: "translateY(-4px)",
                    },
                  }}
                />
              ))}
            </Tabs>
          </Box>
          <AnimatePresence mode="wait">
            <motion.div
              key={tabValue}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              sx={{p:{xs:3, md:6}}}
              
            >
              {tabValue === 0 && <FoodList />}
              {tabValue === 1 && <Cart setTabValue={setTabValue} />}
              {tabValue === 2 && <Checkout setTabValue={setTabValue} />}
              {tabValue == 3 && (
                <OrderHistory orders={orders} setTabValue={setTabValue} />
              )}
            </motion.div>
          </AnimatePresence>
        </Paper>
      </motion.div>

      <Snackbar
        open={!!notification}
        autoHideDuration={7000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={notification?.status === "Delivered" ? "success" : "info"}
          variant="filled"
          onClose={() => setNotification(null)}
          sx={{
            borderRadius: "16px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            minWidth: 300,
            textAlign: "center",
          }}
        >
          {notification?.status === "Delivered" ? "🎉 " : "📦 "}
          {notification?.message}
          <br />
          <small>Order #{notification?.orderId?.substring(0, 8)}</small>
        </Alert>
      </Snackbar>
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(5deg);
          }
          100% {
            transform: translateY(0px) rotate(0deg);
          }
        }
      `}</style>
    </Box>
  );
};

export default CustomerDashboard;
