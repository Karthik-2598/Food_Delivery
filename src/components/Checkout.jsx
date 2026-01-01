import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import { useThemeContext } from '../context/ThemeContext';
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Chip,
  Divider,
  Grid,
  Modal,
  IconButton,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import MapIcon from '@mui/icons-material/Map';
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import axios from "axios";
import { geocodeAddress, reverseGeocode } from "../utils/Geocode";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};



// Map container style
const mapContainerStyle = {
  height: "100%",
  width: "100%",
};

const Checkout = ({ setTabValue }) => {
  const { cart, clearCart, user, setOrderConfirmation} =
    useContext(AppContext);
    const {darkMode} = useThemeContext();
  const navigate = useNavigate();
  const [address, setAddress] = useState({
    street: "",
    city: "",
    country: "",
    pincode: "",
  });
  const [coordinates, setCoordinates] = useState(null); // { lat, lng }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  //const mapRef = useRef(null);

  // Debounce address inputs
  const debouncedAddress = useDebounce(address, 500);

  // Memoize geocoding query
  const geocodeQuery = useMemo(
    () => ({
      street: debouncedAddress.street,
      city: debouncedAddress.city,
      country: debouncedAddress.country,
      pincode: debouncedAddress.pincode,
    }),
    [debouncedAddress]
  );

  useEffect(() => {
    const saved = localStorage.getItem("deliveryAddress");
    const savedCoords = localStorage.getItem("deliveryCoordinates");

    if (saved) setAddress(JSON.parse(saved));
    if (savedCoords) setCoordinates(JSON.parse(savedCoords));
  }, []);


  useEffect(()=>{
  if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(
      async(position)=>{
        const {latitude, longitude} = position.coords;
        setCoordinates({lat: latitude, lng:longitude});

        //Reverse geocode to get address and fill
        const updated = await reverseGeocode(latitude, longitude);
        if(updated){
          setAddress(prev=> ({...prev, ...updated}));
        }
      },
      (error)=>{
        console.log("Location access denied", error);
      },
      {enableHighAccuracy: true}
    );
}
},[]);

  //persist on change
  useEffect(() => {
    localStorage.setItem("deliveryAddress", JSON.stringify(address));
  }, [address]);
  useEffect(() => {
    localStorage.setItem("deliveryCoordinates", JSON.stringify(coordinates));
  }, [coordinates]);

  // Define handleAddressChange early (useCallback for stability)
  const handleAddressChange = useCallback(
    (field) => (e) => {
      //console.log(`Updating ${field}:`, e.target.value); // Debug log
      setAddress((prev) => ({ ...prev, [field]: e.target.value }));
      setError(null); // Clear error on input change
    },
    []
  ); // Empty deps since it doesn't depend on external state

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!geocodeQuery.city || !geocodeQuery.country) {
        setCoordinates(null);
        setError(null);
        return;
      }
      setLoading(true);
      const coords = await geocodeAddress(
        geocodeQuery.street,
        geocodeQuery.city,
        geocodeQuery.country,
        geocodeQuery.pincode
      );
      if (coords) {
        setCoordinates(coords);
        setError(null);
      } else {
        setError(
          "Unable to find location. Please check your address or adjust the pin on the map."
        );
      }
      setLoading(false);
    };
    fetchCoordinates();
  }, [geocodeQuery]);

  const handleMarkerDragEnd = async (e) => {
    const newCoords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setCoordinates(newCoords);
    setLoading(true);
    const updated = await reverseGeocode(newCoords.lat, newCoords.lng);
    if (updated) setAddress((prev) => ({ ...prev, ...updated }));
    setLoading(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in to place an order");
      navigate("/login");
      return;
    }
    if (!coordinates || !coordinates.lat || !coordinates.lng) {
      setError(
        "Please enter a valid address or adjust the pin to place the order."
      );
      return;
    }
    try {
      console.log("Submitting order with user:", user);
      const res = await axios.post(
        "/orders",
        {
          items: cart,
          address: `${address.street}, ${address.city}, ${address.country}, ${address.pincode}`,
        },

        { withCredentials: true }
      );
      console.log("Order submitted successfully", res.data);

      setOrderConfirmation({
        id: res.data._id,
        items: cart,
        address: `${address.street}, ${address.city}, ${address.country}, ${address.pincode}`,
        total: cart.reduce((sum, i) => sum + i.foodId.price * i.quantity, 0),
      });
      clearCart();
      setOrderStatus("Order placed successfully!");
      try {
        
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#ff6b6b", "#feca57", "#48dbfb", "#1dd1a1", "#ff9ff3"],
        });
        setTimeout(() => navigate("/order-confirmation"), 2000);
      } catch (clearErr) {
        console.error("Cart clear error :", clearErr);
        setOrderStatus(null);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to place order.");
      console.log(err);
    }
  };

  // Validate coordinates
  const isValidCoordinates =
    coordinates &&
    typeof coordinates.lat === "number" &&
    typeof coordinates.lng === "number";
    const totalPrice = cart.reduce((sum, item) => sum + item.foodId.price * item.quantity, 0).toFixed(2);

  if (cart.length === 0) {
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
            Your Cart is Empty
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Add some delicious items to continue!
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => setTabValue(1)}
            sx={{
              borderRadius: "50px",
              px: 5,
              py: 1.5,
              fontWeight: "bold",
              background: "linear-gradient(45deg, #ff6b6b, #feca57)",
            }}
          >
            Go to Cart 🛒
          </Button>
        </Paper>
      </motion.div>
    );
  }

  return (
    <Box sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 4 } }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Paper
          elevation={24}
          sx={{
            borderRadius: "32px",
            p: { xs: 4, md: 6 },
            background: darkMode ? 'rgba(40, 40, 40, 0.95)' : 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(20px)',
            border: "1px solid rgba(255, 255, 255, 0.4)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            maxWidth: 800,
            mx: 'auto',
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)",
              borderRadius: "32px 32px 0 0",
              p: { xs: 4, md: 6 },
              textAlign: "center",
              color: "white",
            }}
          >
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{ textShadow: "3px 3px 10px rgba(0,0,0,0.4)" }}
            >
              Finalize Your Order 🍽️
            </Typography>
            <Typography variant="h6" sx={{ mt: 2, opacity: 0.95 }}>
              Almost there — just confirm your delivery location!
            </Typography>
          </Box>
          <Box sx={{ p: { xs: 3, md: 6 } }}>
            <Grid container spacing={{xs:4, md:6}}>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  Delivery Address
                </Typography>
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Street Address"
                    value={address.street}
                    onChange={handleAddressChange("street")}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    sx={{ borderRadius: "16px" }}
                  />
                  <TextField
                    label="City"
                    value={address.city}
                    onChange={handleAddressChange("city")}
                    fullWidth
                    margin="normal"
                    required
                    variant="outlined"
                  />
                  <TextField
                    label="Country"
                    value={address.country}
                    onChange={handleAddressChange("country")}
                    fullWidth
                    margin="normal"
                    required
                    variant="outlined"
                  />
                  <TextField
                    label="Pincode"
                    value={address.pincode}
                    onChange={handleAddressChange("pincode")}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />

                  {isValidCoordinates && (
                    <Button
                    variant = "outlined"
                    fullWidth
                    size = "large"
                    startIcon = {<MapIcon />}
                    onClick={()=> setMapModalOpen(true)}
                    sx={{
                      mt: 4,
                      py: 2,
                      borderRadius: '50px',
                      fontWeight: 'bold',
                      borderWidth: 3,
                      textTransform: 'none',
                      '&:hover':{borderWidth: 2},
                    }}>
                    View Delivery Location on Map
                    </Button>)}
                    {loading && (
              <Alert severity="info" sx={{ mt: 3, borderRadius: '16px' }}>
                Searching for location...
              </Alert>
            )}
                  {error && (
                    <Alert
                      severity="error"
                      sx={{ mt: 3, borderRadius: "16px" }}
                    >
                      {error}
                    </Alert>
                  )}
                  {orderStatus && (
                    <Alert
                      severity="success"
                      sx={{ mt: 3, borderRadius: "16px", fontWeight: "bold" }}
                    >
                      {orderStatus}
                    </Alert>
                  )}
                    <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading || !isValidCoordinates}
                    sx={{
                      mt: 4,
                      py: 2.5,
                      borderRadius: "50px",
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      textTransform: "none",
                      background: "linear-gradient(45deg, #ff6b6b, #feca57)",
                      boxShadow: "0 10px 30px rgba(255,107,107,0.5)",
                      "&:hover": {
                        background: "linear-gradient(45deg, #feca57, #ff6b6b)",
                        transform: "translateY(-5px)",
                      },
                    }}
                  >
                    {loading ? "Placing Order..." : "Place Order Now 🚀"}
                  </Button>
                </form>
              </Grid>
              <Grid item xs={12} md={6}>
               <Typography variant="h5" fontWeight="bold" sx={{mb:3}}>
                      Order Summary
                    </Typography>
                  <Paper
                    elevation={12}
                    sx={{
                      mt: 5,
                      p: 4,
                      borderRadius: "24px",
                      background: darkMode ? 'rgba(40, 40, 40, 0.95)' : 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(20px)',
                      height: "fit-content",
                    }}
                  >
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    {cart.length} item{cart.length !== 1 ? "s" : ""}
                  </Typography>
                   
                    <Divider sx={{ my: 2 }} />
                    {cart.map((item) => (
                      <Box key={item.foodId._id} sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
                        <Typography variant = "body1" fontWeight="bold">
                          {item.foodId.name} × {item.quantity}
                        </Typography>
                        <Typography  variant="body1" fontWeight="bold">
                          ${(item.foodId.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Box>
                    ))}
                    <Divider sx={{ my: 3 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h5" fontWeight="bold">
                        Total:
                      </Typography>
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{
                          background: 'linear-gradient(90deg, #ff6b6b, #feca57)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        ${totalPrice}
                      </Typography>
                    </Box>
                  </Paper>
                  </Grid>
    
            </Grid>
          </Box>
        </Paper>
      </motion.div>
      <Modal
        open={mapModalOpen}
        onClose={() => setMapModalOpen(false)}
        closeAfterTransition
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p:{xs:1, md:4},
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{
            width: '100%',
            height: '100%',
            maxWidth: "1000px",
            maxHeight: "800px",
          }}
        >
          <Paper
            elevation={24}
            sx={{
              width: '100%',
              height: '100%',
             borderRadius: { xs: "24px", md: "32px" },
              overflow: 'hidden',
              position: 'relative',
              background: darkMode ? 'rgba(40, 40, 40, 0.95)' : 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Close Button */}
            <IconButton
              onClick={() => setMapModalOpen(false)}
              sx={{
                position: 'absolute',
                top: { xs: 8, md: 16 },
                right: { xs: 8, md: 16 },
                zIndex: 10,
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                '&:hover': { background: 'white' },
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Instruction */}
            <Typography
              variant="h6"
              sx={{
                position: 'absolute',
                top: { xs: 70, md: 100 },
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 10,
                background: "rgba(255,255,255,0.9)",
                px: 4,
                py: 2,
                borderRadius: "20px",
                fontWeight: "bold",
                textAlign: "center",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                maxWidth: "90%",
              }}
            >
              Drag the pin to fine-tune your delivery location 📍
            </Typography>

            {/* Map */}
            {isValidCoordinates ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={coordinates}
                zoom={16}
              >
                <Marker
                  position={coordinates}
                  draggable={true}
                  onDragEnd={handleMarkerDragEnd}
                  animation={window.google?.maps?.Animation?.DROP}
                />
              </GoogleMap>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  bgcolor: '#f0f0f0',
                }}
              >
                <Typography color="text.secondary" variant="h6">
                  Loading map...
                </Typography>
              </Box>
            )}
          </Paper>
        </motion.div>
      </Modal>
    </Box>
  );
};

export default Checkout;
