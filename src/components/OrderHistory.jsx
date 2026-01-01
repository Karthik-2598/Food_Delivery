import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Rating,
  TextField,
  Alert,
  Paper,
  Chip,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useThemeContext } from '../context/ThemeContext';


const OrderHistory = ({ orders, setTabValue }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
 const {darkMode} = useThemeContext();
  const handleRateOrder = (order) => {
    setSelectedOrder(order);
    setSuccess(null);
    setRatings(
      order.items.map((item) => ({
        foodId: item.foodId._id || item.foodId,
        rating: 0,
        comment: "",
      }))
    );
  };

  const updateRating = (index, field, value) => {
    setRatings((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
  };
  const handleSubmitRating = async () => {
    if (ratings.some((r) => r.rating === 0)) {
      alert("Please provide rating for all items.");
      return;
    }
    setSubmitting(true);
    try {
      const ratingsPayload = ratings.map((r) => ({
        foodId: r.foodId,
        rating: r.rating,
        comment: r.comment,
      }));
      await axios.put(
        `/orders/${selectedOrder._id}`,
        { ratings: ratingsPayload },
        { withCredentials: true }
      );
      setSuccess("Thank you! Your rating has been submitted 🎉");

      // Confetti celebration!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ff6b6b", "#feca57", "#48dbfb", "#1dd1a1"],
      });
      setTimeout(() => {
        setSelectedOrder(null);
        setRatings([]);
        setSuccess(null);
      }, 2000);
    } catch (err) {
      console.error("Rating error:", err);
      alert(err.response?.data?.error || "Failed to submit rating");
    }
    setSubmitting(false);
  };
  const getStatusColor = (status) => {
    switch (status?.trim().toLowerCase()) {
      case "pending":
        return "warning";
      case "in transit":
        return "info";
      case "delivered":
        return "success";
      default:
        return "default";
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <Paper
          elevation={16}
          sx={{
            borderRadius: "32px",
            p: 6,
            textAlign: "center",
            background: darkMode ? 'rgba(40, 40, 40, 0.95)' : 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(20px)',
            my: 6,
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            No Orders Yet
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Time to treat yourself to something delicious!
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
              background: "linear-gradient(45deg, #ff6b6b, #feca57)",
            }}
          >
            Explore Menu 🍔
          </Button>
        </Paper>
      </motion.div>
    );
  }

  return (
    <Box sx={{
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, 1fr)",
      md: "repeat(3, 1fr)",
    },
    gap: 4,
  }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
          sx={{
            background: "linear-gradient(90deg, #ff6b6b, #feca57)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 5,
          }}
        >
          Your Order History 📜
        </Typography>
        <Box sx={{ maxWidth: 900, mx: "auto", px:{xs:2, md:0}}}>
        <List >
          <AnimatePresence>
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Paper
                  elevation={12}
                  sx={{
                    borderRadius: "24px",
                    mb: 3,
                    p:3,
                    mx:{xs:0, md:4},
                    overflow: "hidden",
                    background: darkMode ? 'rgba(40, 40, 40, 0.95)' : 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(20px)',
                    border: "1px solid rgba(255,255,255,0.3)",
                    transition: "all 0.4s ease",
                    "&:hover": {
                      transform: "translateY(-10px)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <ListItem alignItems="flex-start" sx={{ py: 3, px: 4 }}>
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          width: 60,
                          height: 60,
                          bgcolor: getStatusColor(order.status) + ".light",
                        }}
                      >
                        {order.status.trim().toLowerCase() === "delivered" ? (
                          <CheckCircleIcon />
                        ) : (
                          <Typography variant="h6" fontWeight="bold">
                            #{order._id.substring(0, 4)}
                          </Typography>
                        )}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      sx={{ ml: 3 }}
                      primary={
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Typography variant="h6" fontWeight="bold">
                            Order #{order._id.substring(0, 8)}
                          </Typography>
                          <Chip
                            label={order.status}
                            color={getStatusColor(order.status)}
                            size="small"
                            sx={{
                              fontWeight: "bold",
                              borderRadius: "50px",
                              px: 2,
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Date:</strong>{" "}
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                          >
                            <strong>Address:</strong> {order.address}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                          >
                            <strong>Items:</strong>{" "}
                            {order.items
                              .map(
                                (i) =>
                                  `${i.foodId?.name || "Item"} x${i.quantity}`
                              )
                              .join(", ")}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box sx={{ textAlign: "right" }}>
                      {order.status.trim().toLowerCase() === "delivered" &&
                        order.ratings.length === 0 && (
                          <Button
                            variant="contained"
                            onClick={() => handleRateOrder(order)}
                            sx={{
                              borderRadius: "50px",
                              px: 4,
                              py: 1.5,
                              fontWeight: "bold",
                              background:
                                "linear-gradient(45deg, #ff6b6b, #feca57)",
                              boxShadow: "0 8px 20px rgba(255,107,107,0.4)",
                              "&:hover": {
                                transform: "translateY(-3px)",
                              },
                            }}
                          >
                            Rate Order ⭐
                          </Button>
                        )}
                      {order.ratings.length > 0 && (
                        <Chip
                          icon={<CheckCircleIcon />}
                          label="Rated"
                          color="success"
                          variant="outlined"
                          sx={{
                            fontWeight: "bold",
                            borderRadius: "50px",
                            px: 3,
                            py: 2,
                          }}
                        />
                      )}
                    </Box>
                  </ListItem>
                  <Divider sx={{ mx: 4, opacity: 0.5 }} />
                </Paper>
              </motion.div>
            ))}
          </AnimatePresence>
        </List>
        </Box>

        {/* Rating Form */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.6 }}
            >
              <Paper
                elevation={20}
                sx={{
                  borderRadius: "32px",
                  p: { xs: 4, md: 6 },
                  mt: 6,
                  maxWidth: 800,
                  mx: "auto",
                  background: darkMode ? 'rgba(40, 40, 40, 0.95)' : 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(20px)',
                  border: "1px solid rgba(255,255,255,0.4)",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  textAlign="center"
                  gutterBottom
                  sx={{
                    background: "linear-gradient(90deg, #ff6b6b, #feca57)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 4,
                  }}
                >
                  Rate Your Order #{selectedOrder._id.substring(0, 8)} ⭐
                </Typography>

                <Typography
                  variant="h6"
                  textAlign="center"
                  color="text.secondary"
                  sx={{ mb: 5 }}
                >
                  We’d love to hear your feedback!
                </Typography>
                {selectedOrder.items.map((item, index) => (
                  <Paper
                    key={item.foodId._id || index}
                    elevation={6}
                    sx={{
                      borderRadius: "24px",
                      p: 4,
                      mb: 4,
                      background: darkMode ? 'rgba(40, 40, 40, 0.95)' : 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(20px)',
                      transition: "all 0.3s",
                      "&:hover": { transform: "translateY(-5px)" },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        mb: 3,
                      }}
                    >
                      <Avatar
                        src={item.foodId?.image}
                        alt={item.foodId?.name}
                        variant="rounded"
                        sx={{ width: 80, height: 80, borderRadius: "16px" }}
                      />
                      <Typography variant="h6" fontWeight="bold">
                        {item.foodId.name}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "center", my: 3 }}>
                      <Rating
                        name={`rating-${index}`}
                        value={ratings[index]?.rating || 0}
                        onChange={(e, value) =>
                          updateRating(index, "rating", value)
                        }
                        precision={1}
                        size="large"
                        sx={{
                          "& .MuiRating-iconFilled": {
                            color: "#feca57",
                          },
                          "& .MuiRating-iconHover": {
                            color: "#ff6b6b",
                          },
                        }}
                      />
                    </Box>
                    <TextField
                      fullWidth
                      label="Add a comment (optional)"
                      value={ratings[index]?.comment || ""}
                      onChange={(e) =>
                        updateRating(index, "comment", e.target.value)
                      }
                      multiline
                      rows={3}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "16px",
                          background: "rgba(255,255,255,0.9)",
                        },
                      }}
                    />
                  </Paper>
                ))}
                {success && (
                  <Alert
                    severity="success"
                    variant="filled"
                    sx={{
                      borderRadius: "20px",
                      py: 3,
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      mb: 4,
                      background: "linear-gradient(45deg, #1dd1a1, #48dbfb)",
                    }}
                  >
                    {success}
                  </Alert>
                )}
                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                    justifyContent: "center",
                    mt: 4,
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleSubmitRating}
                    disabled={submitting}
                    sx={{
                      borderRadius: "50px",
                      px: 6,
                      py: 2,
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      background: "linear-gradient(45deg, #ff6b6b, #feca57)",
                      boxShadow: "0 10px 30px rgba(255,107,107,0.5)",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 15px 40px rgba(255,107,107,0.6)",
                      },
                    }}
                  >
                    {submitting ? "Submitting..." : "Submit Ratings 🎉"}
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => {
                      setSelectedOrder(null);
                      setRatings([]);
                      setSuccess(null);
                    }}
                    sx={{
                      borderRadius: "50px",
                      px: 5,
                      py: 2,
                      fontWeight: "bold",
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Box>
  );
};

export default OrderHistory;
