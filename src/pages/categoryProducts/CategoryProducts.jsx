import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardMedia,
  CardContent, TextField, MenuItem, Select,
  InputLabel, FormControl, Pagination, Rating
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axiosAuth from '../../api/axiosAuth.jsx';
import Loader from '../../components/shared/Loader';

function CategoryProducts() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(8);

  const fetchProducts = async () => {
    const res = await axiosAuth.get('products');
    console.log(res.data);  
    return res.data.data;   
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['allProducts'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <Loader />;
  if (isError) return <p>Error: {error.message}</p>;

  const filtered = data.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'asc-price') return a.price - b.price;
    if (sort === 'desc-price') return b.price - a.price;
    if (sort === 'asc-name') return a.name.localeCompare(b.name);
    if (sort === 'desc-name') return b.name.localeCompare(a.name);
    return 0;
  });

  const count = Math.ceil(sorted.length / perPage);
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        All Products
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          label="Search"
          value={search}
          onChange={e => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Sort</InputLabel>
          <Select
            value={sort}
            label="Sort"
            onChange={e => setSort(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="asc-price">Price: Low to High</MenuItem>
            <MenuItem value="desc-price">Price: High to Low</MenuItem>
            <MenuItem value="asc-name">Name: A-Z</MenuItem>
            <MenuItem value="desc-name">Name: Z-A</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Per Page</InputLabel>
          <Select
            value={perPage}
            label="Per Page"
            onChange={e => {
              setPage(1);
              setPerPage(e.target.value);
            }}
          >
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={8}>8</MenuItem>
            <MenuItem value={12}>12</MenuItem>
            <MenuItem value={16}>16</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {paginated.length === 0 && (
          <Typography>No products found.</Typography>
        )}
        {paginated.map(product => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={product.mainImg}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                {/* إضافة تقييم النجوم */}
                <Rating
                  value={product.rate || 0}  
                  precision={0.5}
                  readOnly
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  ${product.price}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box mt={4} display="flex" justifyContent="center">
        <Pagination
          count={count}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
}

export default CategoryProducts;
