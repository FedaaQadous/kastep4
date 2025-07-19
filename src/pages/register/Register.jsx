import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axiosAuth from '../../api/axiosAuth.jsx';
import {
  Box, TextField, Button, Typography, Divider, Grid, InputAdornment, Link, CircularProgress
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Facebook as FacebookIcon,
  Apple as AppleIcon,
  Google as GoogleIcon
} from '@mui/icons-material';

function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const registerMutation = useMutation({
    mutationFn: (userData) => axiosAuth.post('Account/register', userData),
    onSuccess: () => navigate('/login'),
    onError: (error) => {
      console.error("Registration error:", error.response?.data || error.message);
      console.error("Validation Errors:", error.response?.data?.errors);
    }
  });

  const onSubmit = (data) => {
    registerMutation.mutate(data);
  };

  const password = watch("password");

  const calculateAge = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Box
        sx={{
          width: { xs: 0, md: '50%' },
          backgroundImage: 'url(/frameregister.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '600px'
        }}
      />
      <Box sx={{
        width: { xs: '100%', md: '50%' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4
      }}>
        <Box sx={{
          maxWidth: 400,
          width: '100%',
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: 'background.paper'
        }}>
          <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
            KA STORE
          </Typography>
          <Typography variant="h5" align="center" sx={{ mb: 1 }}>
            Create New Account
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Join us to track orders, save favorites, and get special offers.
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Button variant="outlined" startIcon={<FacebookIcon color="primary" />}>Facebook</Button>
            <Button variant="outlined" startIcon={<GoogleIcon color="error" />}>Google</Button>
            <Button variant="outlined" startIcon={<AppleIcon />}>Apple ID</Button>
          </Box>

          <Divider sx={{ mb: 3 }}>OR</Divider>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('firstName', {
                    required: 'First name is required',
                    minLength: { value: 3, message: 'Minimum 3 characters' }
                  })}
                  label="First Name"
                  fullWidth
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  {...register('lastName', {
                    required: 'Last name is required',
                    minLength: { value: 4, message: 'Minimum 4 characters' }
                  })}
                  label="Last Name"
                  fullWidth
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><PersonIcon /></InputAdornment>
                  }}
                />
              </Grid>
            </Grid>

            <TextField
              {...register('userName', {
                required: 'Username is required',
                minLength: { value: 6, message: 'Minimum 6 characters' }
              })}
              label="Username"
              fullWidth
              error={!!errors.userName}
              helperText={errors.userName?.message}
              sx={{ mt: 2 }}
            />

            <TextField
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              label="Email Address"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                startAdornment: <InputAdornment position="start"><EmailIcon /></InputAdornment>
              }}
              sx={{ mt: 2 }}
            />

            <TextField
              {...register('birthOfDate', {
                required: 'Birth date is required',
                validate: value => calculateAge(value) > 18 || 'You must be over 18'
              })}
              type="date"
              fullWidth
              error={!!errors.birthOfDate}
              helperText={errors.birthOfDate?.message}
              sx={{ mt: 2 }}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Minimum 8 characters' }
              })}
              label="Password"
              type="password"
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockIcon /></InputAdornment>
              }}
              sx={{ mt: 2 }}
            />

            <TextField
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
              label="Confirm Password"
              type="password"
              fullWidth
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              sx={{ mt: 2 }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={registerMutation.isLoading}
              sx={{ mt: 3 }}
            >
              {registerMutation.isLoading ? <CircularProgress size={24} /> : 'Create New Account'}
            </Button>

            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Already have an Account?{' '}
              <Link href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }} underline="hover" color="primary">
                Login
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Register;
