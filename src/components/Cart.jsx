import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useThemeContext } from '../context/ThemeContext';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
  Box,
  IconButton,
  Button,
  Paper,
  Chip,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const Cart = ({ setTabValue }) => {
  const { cart, setCart } = useContext(AppContext);
  const {darkMode} = useThemeContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const updateQuantity = (foodId, delta) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.foodId._id === foodId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (foodId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.foodId._id !== foodId)
    );

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#ff6b6b", "#feca57", "#48dbfb"],
    });
  };

  const handleProceedToCheckout = () => {
    // Celebration confetti before going to checkout
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#ff6b6b", "#feca57", "#48dbfb", "#1dd1a1", "#ff9ff3"],
    });
    setTabValue(2);
  };

  const total = cart.reduce(
    (sum, item) => sum + item.foodId.price * item.quantity,
    0
  ).toFixed(2);

  if (cart.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <Paper
          elevation={12}
          sx={{
            borderRadius: "32px",
            p: { xs: 5, md: 7 },
            textAlign: "center",
            background: darkMode ? 'rgba(40, 40, 40, 0.95)' : 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(20px)',
            border: "1px solid rgba(255,255,255,0.3)",
            my: 6,
            mx: { xs: 2, md: 4 },
          }}
        >
          <ShoppingCartIcon sx={{ fontSize: 100, color: darkMode ? "#666" : "#ccc", mb: 3 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom
          sx={{ color: darkMode ? '#fff' : 'inherit' }}>
            Your Cart is Empty
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Looks like you haven't added anything delicious yet!
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => setTabValue(0)}
            sx={{
              borderRadius: "50px",
              px: 5,
              py: 1.5,
              fontWeight: "bold",
              fontSize: "1.2rem",
              textTransform: "none",
              background: "linear-gradient(45deg, #ff6b6b, #feca57)",
              boxShadow: "0 8px 20px rgba(255,107,107,0.4)",
              '&:hover': {
                background: "linear-gradient(45deg, #feca57, #ff6b6b)",
                transform: "translateY(-4px)",
              },
            }}
          >
            Browse Delicious Food 🍕
          </Button>
        </Paper>
      </motion.div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      sx={{ px: { xs: 2, md: 4 } }}
    >
      <Paper
        elevation={20}
        sx={{
          borderRadius: "32px",
          overflow: "hidden",
          background: darkMode ? 'rgba(40, 40, 40, 0.95)' : 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(20px)',
          border: "1px solid rgba(255, 255, 255, 0.4)",
          my: 4,
          boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
          
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)",
            p: { xs: 4, md: 5 },
            textAlign: "center",
            color: "white",
          }}
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              textShadow: "3px 3px 10px rgba(0,0,0,0.3)",
            }}
          >
            Your Cart 🛒
          </Typography>
          <Typography variant="h6" sx={{ mt: 1, opacity: 0.95 }}>
            {cart.length} {cart.length === 1 ? "item" : "items"} • Ready to
            checkout
          </Typography>
        </Box>
        <List sx={{ p: { xs: 2, md: 4 } }}>
          <AnimatePresence>
            {cart.map((item, index) => (
              <motion.div
                key={item.foodId._id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50, height: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Paper
                  elevation={8}
                  sx={{
                    borderRadius: "24px",
                    mb: 3,
                    overflow: "hidden",
                    background: darkMode ? 'rgba(40,40,40,0.9)' : 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(10px)',
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: darkMode 
                        ? "0 20px 40px rgba(0,0,0,0.4)" 
                        : "0 20px 40px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                <ListItem
                  sx={{
                    flexDirection: { xs: "column", sm: "row" },
                   alignItems: { xs: "flex-start", sm: "center" },
                   gap: { xs: 2, sm: 0 },
                    py: { xs: 3, sm: 4 },
                    px: { xs: 3, sm: 4 },
                    borderRadius: "20px",
                    mb: 2,
                    background: "rgba(255,255,255,0.7)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                    transition: "all 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <ListItemAvatar
                  sx={{ alignSelf: { xs: "center", sm: "flex-start" } }}>
                    <Avatar
                      src={item.foodId.image}
                      alt={item.foodId.name}
                      variant="rounded"
                     sx={{ 
                          width: { xs: 80, sm: 100 }, 
                          height: { xs: 80, sm: 100 }, 
                          borderRadius: "20px" 
                        }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    sx={{ textAlign: { xs: "center", sm: "left" }, flexGrow: 1,
                  mt: { xs: 0, sm: 2 } }}
                    primary={
                      <Typography variant="h6" fontWeight="bold"
                      sx={{ color: darkMode ? '#fff' : 'inherit' }}>
                        {item.foodId.name}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ mt: 1, textAlign: { xs: "center", sm: "left" } }}>
                        <Chip
                          label={`$${item.foodId.price.toFixed(2)} each`}
                          size="small"
                          sx={{
                            background:
                              "linear-gradient(45deg, #48dbfb, #1dd1a1)",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "0.9rem",
                          }}
                        />
                      </Box>
                    }
                  />
                  <Box sx={{ display: "flex", 
                    flexDirection: { xs: "row", sm: "column" }, alignItems: "center", gap: 2 ,
                    mt: { xs: 2, sm: 0 }}}>
                    <IconButton
                      onClick={() => updateQuantity(item.foodId._id, -1)}
                     sx={{
                            background: darkMode ? 'rgba(255,107,107,0.2)' : 'rgba(255,107,107,0.1)',
                            '&:hover': { background: 'rgba(255,107,107,0.3)' },
                          }}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <motion.div
                      key={item.quantity}
                      initial={{ scale: 1.3 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        sx={{ width: 40, textAlign: "center" }}
                      >
                        {item.quantity}
                      </Typography>
                    </motion.div>
                    <IconButton
                      onClick={() => updateQuantity(item.foodId._id, 1)}
                      sx={{
                            background: darkMode ? 'rgba(72,209,251,0.2)' : 'rgba(72,209,251,0.1)',
                            '&:hover': { background: 'rgba(72,209,251,0.3)' },
                          }}
                    >
                      <AddIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => removeItem(item.foodId._id)}
                      color="error"
                      sx={{
                          background: darkMode ? 'rgba(255,0,0,0.2)' : 'rgba(255,107,107,0.1)',
                          '&:hover': { background: 'rgba(255,0,0,0.3)' },
                        }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
                </Paper>
                <Divider sx={{ my: 2, opacity: 0.3 }} />
              </motion.div>
            ))}
          </AnimatePresence>
        </List>
        <Box sx={{ p: { xs: 3, md: 5 }, background: darkMode ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.9)' }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              Total:{" "}
            </Typography>
            <motion.div
              key={total}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Typography
                variant="h3"
                fontWeight="bold"
                sx={{
                  background: "linear-gradient(90deg, #ff6b6b, #feca57)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                ${total}
              </Typography>
            </motion.div>
          </Box>
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleProceedToCheckout}
            sx={{
              borderRadius: "50px",
              py: 2,
              fontSize: "1.3rem",
              fontWeight: "bold",
              textTransform: "none",
              background: "linear-gradient(45deg, #ff6b6b, #feca57)",
              boxShadow: "0 10px 30px rgba(255,107,107,0.5)",
              "&:hover": {
                background: "linear-gradient(45deg, #feca57, #ff6b6b)",
                transform: "translateY(-3px)",
                boxShadow: "0 15px 40px rgba(255,107,107,0.6)",
              },
              "&:active": {
                animation: "pulse 0.3s ease",
              },
            }}
          >
            Proceed to Checkout 🚀
          </Button>
        </Box>
      </Paper>
      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </motion.div>
  );
};

export default Cart;
