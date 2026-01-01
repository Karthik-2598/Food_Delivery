import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useThemeContext } from '../context/ThemeContext';
import axios from "axios";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Box,
  Pagination,
  FormControl,
  Select,
  TextField,
  MenuItem,
  InputLabel,
  Chip,
  Paper,
  Badge,
  Grid
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

//debounce hook
const useDebounce = (value, delay) => {
  const [debounceValue, setDebounceValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debounceValue;
};

//static cuisines list
const cuisines = [
  "Italian",
  "Asian",
  "American",
  "Mexican",
  "Mediterranean",
  "Pakistani",
  "Japanese",
  "Moroccan",
  "Korean",
  "Greek",
  "Thai",
  "Indian",
  "Turkish",
  "Smoothie",
  "Russian",
  "Lebanese",
  "Brazilian",
];

const FoodList = () => {
  const { addToCart, cart } = useContext(AppContext);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [sort, setSort] = useState("");
  const limit = 12;
  const {darkMode} = useThemeContext();

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", limit);
        if (debouncedSearch) params.append("search", debouncedSearch);
        if (cuisine) params.append("cuisine", cuisine);
        if (sort) params.append("sort", sort);
        const res = await axios.get(`/foods?${params.toString()}`);
        setFoods(res.data.foods);
        setTotalPages(res.data.totalPages);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || "Failed to fetch items");
      } finally {
        //loading = loading false
        setLoading(false);
      }
    };
    fetchFoods();
  }, [page, debouncedSearch, cuisine, sort]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };
  const handleCuisineChange = (e) => {
    setCuisine(e.target.value);
    setPage(1);
  };
  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };
  const handleAddToCart = (food) => {
    addToCart(food);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.8 },
      colors: ["#ff6b6b", "#feca57", "#48dbfb", "#1dd1a1"],
    });
  };
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 10 }}>
        <CircularProgress size={60} thickness={5} />
      </Box>
    );
  }
  if (error) {
    return (
      <Box sx={{ my: 8, textAlign: "center" }}>
        <Alert
          severity="error"
          sx={{ borderRadius: "16px", maxWidth: 600, mx: "auto" }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      {/* Hero Search & Filters */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{
            background: 'linear-gradient(90deg, #ff6b6b, #feca57)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Discover Delicious Meals 🍽️
        </Typography>
      <motion.div
      key={cartItemCount}
        initial={{ scale: 1.3, rotate: 10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{ display: "inline-block" }}
      >
        <Badge
            badgeContent={cartItemCount}
            color="error"
            overlap="circular"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            sx={{
              "& .MuiBadge-badge": {
                fontWeight: "bold",
                fontSize: "1.1rem",
                minWidth: 28,
                height: 28,
                borderRadius: "14px",
                background: "#ff6b6b",
                boxShadow: "0 4px 10px rgba(255,107,107,0.4)",
              },
            }}
          >
            <Chip
              icon={<ShoppingCartIcon />}
              label="My Cart"
              clickable
              color="primary"
              variant="outlined"
              sx={{
                fontSize: "1.2rem",
                fontWeight: "bold",
                px: 4,
                py: 3,
                borderRadius: "50px",
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                border: "2px solid #ff6b6b",
                cursor: "pointer",
              }}
            />
            </Badge>
        </motion.div>
      </Box>
      <Paper
        elevation={12}
        sx={{
          borderRadius: "32px",
          p: { xs: 3, md: 5 },
          mb: 8,
          mx: { xs: 2, md: "auto" },
          maxWidth: 1200,
          border: "1px solid rgba(255,255,255,0.3)",
          background: darkMode ? 'rgba(40, 40, 40, 0.95)' : 'rgba(255,255,255,0.9)',
                       backdropFilter: 'blur(20px)',
        }}
      >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 3,
              alignItems: {xs:"stretch", sm:"end"}
            }}
          >
            <TextField
              fullWidth
              label="Search dishes..."
              value={search}
              onChange={handleSearchChange}
              variant="outlined"
              InputProps={{
                endAdornment: <SearchIcon color="action" />,
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "50px",
                  background: "rgba(255,255,255,0.9)",
                },
              }}
            />
            <FormControl fullWidth sx={{ minWidth:{xs:"100%", sm:200}}}>
              <InputLabel>Cuisine</InputLabel>
              <Select
                value={cuisine}
                onChange={handleCuisineChange}
                sx={{
                  borderRadius: "50px",
                  background: "rgba(255,255,255,0.9)",
                }}
              >
                <MenuItem value="">All Cuisines</MenuItem>
                {cuisines.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ minWidth: { xs: "100%", sm: 180 } }}>
              <InputLabel>Sort by Price</InputLabel>
              <Select
                value={sort}
                onChange={handleSortChange}
                sx={{
                  borderRadius: "50px",
                  background: "rgba(255,255,255,0.9)",
                }}
              >
                <MenuItem value="">Default</MenuItem>
                <MenuItem value="price_asc">Low → High</MenuItem>
                <MenuItem value="price_desc">High → Low</MenuItem>
              </Select>
            </FormControl>
          </Box>
          </Paper>
      {foods.length === 0 ? (
        <Typography
          variant="h5"
          color="text.secondary"
          textAlign="center"
          sx={{ my: 10 }}
        >
          No delicious items found 😔 Try adjusting your filters!
        </Typography>
      ) : (
        <Grid
          container
          spacing={4}
          justifyContent="center"
          sx={{px:{xs:2, md:4}, mb:8}}
        >
          <AnimatePresence>
            {foods.map((food, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={4}
                key={food._id}
                sx={{ display: "flex", justifyContent: "center" }} // Extra centering safety
              >
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  style={{ width: "100%", maxWidth: 420 }}
                >
                  <Card
                    sx={{
                    borderRadius: "24px",
                    overflow: "hidden",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.4s ease",
                    "&:hover": {
                      transform: "translateY(-15px) scale(1.03)",
                      boxShadow: "0 30px 60px rgba(0,0,0,0.25)",
                      background: darkMode ? 'rgba(40, 40, 40, 0.95)' : 'rgba(255,255,255,0.9)',
                       backdropFilter: 'blur(20px)',
                    },
                  }}
                  >
                    <Box sx={{ position: "relative", overflow: "hidden" }}>
                      <CardMedia
                        component="img"
                        height="260"
                        image={food.image}
                        alt={food.name}
                        sx={{
                          transition: "transform 0.6s ease",
                          "&:hover": {
                            transform: "scale(1.15)",
                          },
                        }}
                      />
                      <Chip
                        label={`$${food.price.toFixed(2)}`}
                        color="primary"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 16,
                          right: 16,
                          fontWeight: "bold",
                          borderRadius: "50px",
                          background:
                            "linear-gradient(45deg, #ff6b6b, #feca57)",
                        }}
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        gutterBottom
                        sx={{ minHeight: 60 }}
                      >
                        {food.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 3,
                          height: 70,
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {food.description.substring(0, 80)}...
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleAddToCart(food)}
                        sx={{
                          borderRadius: "50px",
                          py: 1.5,
                          fontWeight: "bold",
                          textTransform: "none",
                          background:
                            "linear-gradient(45deg, #ff6b6b, #feca57)",
                          boxShadow: "0 8px 20px rgba(255,107,107,0.4)",
                          "&:hover": {
                            background:
                              "linear-gradient(45deg, #feca57, #ff6b6b)",
                            transform: "translateY(-2px)",
                            boxShadow: "0 12px 30px rgba(255,107,107,0.5)",
                          },
                        }}
                      >
                        Add to Cart 🛒
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
                </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      )}

      {totalPages > 1 && (
        <Box sx={{ display: " flex", justifyContent: "center", mt: 8 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            size="large"
            color="primary"
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: "50%",
                mx: 0.5,
              },
              "& .Mui-selected": {
                background: "linear-gradient(45deg, #ff6b6b, #feca57)",
                color: "white",
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default FoodList;
