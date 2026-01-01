import React, {useEffect, useState, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import {Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Chip,
  Alert,
  CircularProgress,} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { AppContext } from '../context/AppContext';
import { useThemeContext } from '../context/ThemeContext';


const OrderConfirmation = ({orderData}) => {
  const {cart} = useContext(AppContext);
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(10); // 10 seconds countdown
   const {darkMode} = useThemeContext();
    useEffect(()=>{
      confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#ff9ff3'],
      ticks: 300,
      gravity: 0.8,
      decay: 0.94,
      startVelocity: 30,
    });
        const timer = setInterval(()=>{
            setCountdown((prev)=>{
              if(prev<=1){
                clearInterval(timer);
                navigate('/customer');
                return 0;
              }
              return prev-1;
            });
        }, 1000);
        return ()=> clearInterval(timer);
    }, [navigate]);

    const total = orderData?.total || cart.reduce((sum,i)=> sum+i.foodId.price * i.quantity,0).toFixed(2);

        return (
           <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '-20%',
          left: '-20%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,107,0.3) 0%, transparent 70%)',
          animation: 'float 20s infinite ease-in-out',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-30%',
          right: '-30%',
          width: '800px',
          height: '800px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(72,209,251,0.3) 0%, transparent 70%)',
          animation: 'float 25s infinite reverse',
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ zIndex: 10, width: '100%', maxWidth: 600 }}
      >
        <Paper
          elevation={24}
          sx={{
            borderRadius: '32px',
            overflow: 'hidden',
            background: darkMode ? 'rgba(40, 40, 40, 0.95)' : 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.2)',
            textAlign: 'center',
            p: { xs: 4, md: 6 },
            mx: 2,
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
          >
            <CheckCircleIcon
              sx={{
                fontSize: 120,
                color: '#1dd1a1',
                mb: 3,
                filter: 'drop-shadow(0 8px 20px rgba(29,209,161,0.4))',
              }}
            />
          </motion.div>
          <Typography
            variant="h3"
            fontWeight="bold"
            gutterBottom
            sx={{
              background: 'linear-gradient(90deg, #ff6b6b, #feca57)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Order Confirmed! 🎉
          </Typography>

          <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
            Your delicious meal is on the way!
          </Typography>
          <Alert
            severity="success"
            variant="filled"
            sx={{
              borderRadius: '20px',
              py: 3,
              fontSize: '1.1rem',
              mb: 4,
              background: 'linear-gradient(45deg, #1dd1a1, #48dbfb)',
              boxShadow: '0 10px 30px rgba(29,209,161,0.3)',
            }}
          >
            <strong>Order #{orderData?.id?.substring(0, 8) || 'XXXX'}</strong> has been placed successfully!
            <br />
            Estimated delivery: <strong>30–45 minutes</strong>
          </Alert>

       <Paper
            elevation={12}
            sx={{
              borderRadius: '24px',
              p: 4,
              background: darkMode ? 'rgba(40, 40, 40, 0.95)' : 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(20px)',
              mb: 4,
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Order Summary
            </Typography>
            <List>
              {orderData?.items?.length > 0 ? (
                orderData.items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ListItem sx={{ py: 1.5 }}>
                      <ListItemAvatar>
                        <Avatar
                          src={item.foodId?.image}
                          alt={item.foodId?.name}
                          variant="rounded"
                          sx={{ width: 60, height: 60, borderRadius: '16px' }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" fontWeight="bold">
                            {item.foodId?.name || 'Unknown Item'} × {item.quantity}
                          </Typography>
                        }
                        secondary={
                          <Chip
                            label={`$${item.foodId?.price?.toFixed(2) || '0.00'} each`}
                            size="small"
                            sx={{
                              mt: 0.5,
                              background: 'linear-gradient(45deg, #ff6b6b, #feca57)',
                              color: 'white',
                            }}
                          />
                        }
                        sx={{ ml: 2 }}
                      />
                      <Typography variant="h6" fontWeight="bold">
                        ${(item.foodId?.price * item.quantity).toFixed(2)}
                      </Typography>
                    </ListItem>
                  </motion.div>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No items in order" />
                </ListItem>
              )}

              {/* Delivery Address */}
              <ListItem sx={{ py: 2, background: 'rgba(72,209,251,0.05)', borderRadius: '16px', my: 2 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#48dbfb' }}>
                    <LocationOnIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography fontWeight="bold">Delivery Address</Typography>}
                  secondary={orderData?.address || 'Not specified'}
                />
              </ListItem>

              {/* Total */}
              <ListItem
                sx={{
                  py: 3,
                  background: 'linear-gradient(45deg, rgba(255,107,107,0.1), rgba(254,202,87,0.1))',
                  borderRadius: '20px',
                  mt: 3,
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#ff6b6b' }}>
                    <AttachMoneyIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="h5" fontWeight="bold">Total Amount</Typography>}
                />
                <motion.div
                  key={total}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{
                      background: 'linear-gradient(90deg, #ff6b6b, #feca57)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    ${total}
                  </Typography>
                </motion.div>
              </ListItem>
            </List>
          </Paper>

          <Box sx={{ mt: 5 }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Redirecting to dashboard in{' '}
              <Chip
                label={`${countdown}s`}
                color="primary"
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  px: 2,
                  background: 'linear-gradient(45deg, #ff6b6b, #feca57)',
                }}
              />
            </Typography>

            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mt: 3 }}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/customer')}
                sx={{
                  borderRadius: '50px',
                  px: 4,
                  py: 1.5,
                  fontWeight: 'bold',
                  borderWidth: 2,
                  '&:hover': { borderWidth: 2 },
                }}
              >
                Back to Menu
              </Button>

              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/customer')}
                sx={{
                  borderRadius: '50px',
                  px: 5,
                  py: 1.5,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  background: 'linear-gradient(45deg, #ff6b6b, #feca57)',
                  boxShadow: '0 10px 30px rgba(255,107,107,0.5)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #feca57, #ff6b6b)',
                    transform: 'translateY(-3px)',
                  },
                }}
              >
                Continue Shopping 🍔
              </Button>
            </Box>
          </Box>
        </Paper>
      </motion.div>
<style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
      `}</style>
    </Box>
  );

};

export default OrderConfirmation
