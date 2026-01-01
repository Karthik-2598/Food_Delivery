import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from 'react-toastify';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Link,
} from "@mui/material";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { motion } from "framer-motion";
import { useThemeContext } from "../context/ThemeContext";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const { setUser } = useContext(AppContext);
  const navigate = useNavigate();
  const { darkMode } = useThemeContext();

  const validateForm =()=>{
    if(username.length <3){
      toast.error('Username must be of 3 characters long');
      return false;
    }
    if(password.length<6){
      toast.error('Password must be at least 6 characters long');
      return false;
    }
    return true;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if(!validateForm()) return ;
    try {
      console.log("Logging in:", { username });
      const res = await axios.post(
        "/auth/login",
        { username, password },
        { withCredentials: true }
      );
      console.log("Login response:", res.data);
      setUser({
        id: res.data.id,
        username: res.data.username,
        role: res.data.role,
        token: res.data.token,
      });
      localStorage.setItem("token", res.data.accessToken);
      toast.success('Login successful! Welcome back 👋');
      navigate(role === "customer" ? "/customer" : "/admin");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: darkMode
          ? "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #121212 100%)"
          : "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "-20%",
          left: "-20%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: darkMode
            ? "radial-gradient(circle, rgba(255,107,107,0.15) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(255,107,107,0.3) 0%, transparent 70%)",
          animation: "float 20s infinite ease-in-out",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-30%",
          right: "-30%",
          width: "800px",
          height: "800px",
          borderRadius: "50%",
          background: darkMode
            ? "radial-gradient(circle, rgba(254,206,239,0.2) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(254,206,239,0.4) 0%, transparent 70%)",
          animation: "float 25s infinite reverse",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ zIndex: 10 }}
      >
        <Paper
          elevation={24}
          sx={{
            borderRadius: "32px",
            padding: { xs: 4, sm: 6 },
            maxWidth: 480,
            width: "100%",
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.88)",
            backdropFilter: "blur(20px)",
            border: darkMode 
              ? "1px solid rgba(255, 255, 255, 0.1)" 
              : "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: darkMode 
              ? "0 20px 50px rgba(0,0,0,0.5)" 
              : "0 20px 50px rgba(0,0,0,0.2)",
          }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            <RestaurantMenuIcon
              sx={{
                fontSize: 80,
                color: "#ff6b6b",
                mb: 3,
                filter: darkMode 
                  ? "drop-shadow(0 4px 15px rgba(255,107,107,0.6))" 
                  : "drop-shadow(0 4px 10px rgba(255,107,107,0.4))",
              }}
            />
          </motion.div>
          <Typography
            variant="h3"
            fontWeight="bold"
            gutterBottom
            sx={{
              background: "linear-gradient(90deg, #ff6b6b, #feca57)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
              color: darkMode ? "rgba(255,255,255,0.8)" : "text.secondary"
            }}
          >
            Welcome Back!
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 ,
            color: darkMode ? "rgba(255,255,255,0.8)" : "text.secondary"
          }}>
            Login to enjoy delicious food delivered fast 🍕
          </Typography>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="role-label">Login as</InputLabel>
            <Select
              labelId="role-label"
              value={role}
              label="Login as"
              onChange={(e) => setRole(e.target.value)}
              sx={{
                borderRadius: "16px",
                background: darkMode ? 'rgba(50,50,50,0.8)' : 'rgba(255,255,255,0.9)',
                color: darkMode ? '#ffffff' : 'inherit',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: darkMode ? 'rgba(255,107,107,0.4)' : 'rgba(255,107,107,0.3)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ff6b6b',
                },
              }}
            >
              <MenuItem value="customer">Customer</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Username or Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            sx={{ mb: 3, borderRadius: "16px" }}
            InputProps={{
              sx: { 
                borderRadius: "16px", 
                background: darkMode ? 'rgba(50,50,50,0.8)' : 'rgba(255,255,255,0.9)',
                color: darkMode ? '#ffffff' : 'inherit',
              },
            }}
            InputLabelProps={{
              sx: { color: darkMode ? '#b0b0b0' : 'inherit' }
            }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            sx={{ mb: 4, borderRadius: "16px" }}
            InputProps={{
              sx: { 
                borderRadius: "16px", 
                background: darkMode ? 'rgba(50,50,50,0.8)' : 'rgba(255,255,255,0.9)',
                color: darkMode ? '#ffffff' : 'inherit',
              },
            }}
            InputLabelProps={{
              sx: { color: darkMode ? '#b0b0b0' : 'inherit' }
            }}
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleLogin}
              sx={{
                borderRadius: "50px",
                py: 2,
                fontSize: "1.2rem",
                fontWeight: "bold",
                textTransform: "none",
                background: "linear-gradient(45deg, #ff6b6b, #feca57)",
                boxShadow: "0 10px 30px rgba(255,107,107,0.5)",
                "&:hover": {
                  background: "linear-gradient(45deg, #feca57, #ff6b6b)",
                  boxShadow: "0 15px 40px rgba(255,107,107,0.6)",
                },
              }}
            >
              Login Now 🚀
            </Button>
          </motion.div>
          <Typography variant="body1" sx={{ mt: 4, color: "text.secondary" }}>
            New here?{" "}
            <Link
              href="/register"
              underline="none"
              sx={{
                color: "#ff6b6b",
                fontWeight: "bold",
                "&:hover": { color: "#feca57" },
              }}
            >
              Create an account
            </Link>
          </Typography>
        </Paper>
      </motion.div>
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(5deg);
          }
          100% {
            transform: translateY(0) rotate(0deg);
          }
        }
      `}</style>
    </Box>
  );
};

export default Login;
