import React, { useState } from 'react';
import { useParams } from 'react-router';
import {
  Box, Button, Card, CardContent, TextField,
  Typography, Rating, Alert
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosAuth from '../../api/axiosAuth.jsx';
import Loader from '../../components/shared/Loader';

function Product() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [rate, setRate] = useState(0);
  const [comment, setComment] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchProduct = async () => {
    const { data } = await axiosAuth.get(`/products/${id}`);
    return data;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['product', id],
    queryFn: fetchProduct,
    staleTime: 5000,
  });

  const addToCartMutation = useMutation({
    mutationFn: (productId) => axiosAuth.post(`/Carts/${productId}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartItems'] });
    },
    onError: (error) => {
      console.error('Error:', error.message);
    },
  });

  const addReviewMutation = useMutation({
    mutationFn: async () => {
      setErrorMsg('');
      const res = await axiosAuth.post(`/products/${id}/Reviews/Create`, {
        rate,
        comment,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      setRate(0);
      setComment('');
    },
    onError: (error) => {
      if (error.response && error.response.data) {
        setErrorMsg(error.response.data.message || 'Something went wrong.');
      } else {
        setErrorMsg('Failed to submit review.');
      }
    },
  });

  if (isLoading) return <Loader />;
  if (isError) return <p>Error: {error.message}</p>;

  const userReview = data.reviews?.find(r => r.isMine);

  return (
    <Card sx={{ maxWidth: 800, margin: '0 auto', padding: 3 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>{data.name}</Typography>
        <Typography variant="body1" gutterBottom>{data.description}</Typography>
        <Typography variant="h6" color="primary" gutterBottom>Price: ${data.price}</Typography>

        <Button
          variant="contained"
          color="success"
          onClick={() => addToCartMutation.mutate(data.id)}
          disabled={addToCartMutation.isPending}
        >
          {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
        </Button>

        <Box mt={4}>
          <Typography variant="h5" gutterBottom>Reviews</Typography>

          {data.reviews?.length === 0 && <Typography>No reviews yet.</Typography>}

          {data.reviews?.map((rev, index) => (
            <Box key={index} sx={{ mt: 2, borderBottom: '1px solid #ccc', pb: 1 }}>
              <Rating value={rev.rate} precision={1} readOnly />
              <Typography>{rev.comment}</Typography>
            </Box>
          ))}
        </Box>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>Add a Review</Typography>

          {userReview ? (
            <Alert severity="info">You already submitted a review.</Alert>
          ) : (
            <>
              {errorMsg && (
                <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>
              )}

              <Rating
                value={rate}
                onChange={(e, newValue) => setRate(newValue)}
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{ mt: 2 }}
              />

              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => addReviewMutation.mutate()}
                disabled={addReviewMutation.isPending || !rate || !comment}
              >
                {addReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
              </Button>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default Product;
