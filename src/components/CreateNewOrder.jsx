import { Box, Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getAllFood } from '../apis/food/addFood';
import AddIcon from '@mui/icons-material/Add';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';

function CreateNewOrder() {
 const url = "http://localhost:8080";
 const [foods, setFoods] = useState([]);
 useEffect(() => {
  const fetchAllFood = async () => {
   const res = await getAllFood();
   // console.log("all responsed is :",res.data);
   setFoods(res.data)

  }
  fetchAllFood();
 })
 return (
  <Grid container spacing={3}>
   {foods.filter((e) => e.status === "show").length > 0 ? (
    foods.filter((e) => e.status === "show")
     .map((item) => (
      <Grid item xs={12} sm={6} md={4} key={item.id}>
       <Card
        sx={{
         p: 2,
         boxShadow: 3,
         borderRadius: 2,
         display: 'flex',
         flexDirection: 'column',
         justifyContent: 'space-between',
        }}
       >
        <CardContent>
         {/* Product Image */}
         {item.image ? (
          <img
           src={`${url}/images/${item.image}`}
           alt={item.name}
           style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            borderRadius: '8px',
            marginBottom: '16px',
           }}
          />
         ) : (
          <Typography
           variant="body2"
           color="textSecondary"
           sx={{ textAlign: 'center', mb: 2 }}
          >
           No Image Available
          </Typography>
         )}

         {/* Product Name */}
         <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
          {item.name}
         </Typography>

         {/* Price & Quantity */}
         <Box
          sx={{
           display: 'flex',
           justifyContent: 'space-between',
           alignItems: 'center',
           mb: 2,
          }}
         >
          {/* Left side: Price & Available Quantity */}
          <Box>
           <Typography variant="h6" color="secondary">
            Price: ₹{item.price}
           </Typography>
           <Typography variant="h6" color="secondary">
            Stock: {item.quantity}
           </Typography>
          </Box>

          {/* Right side: Quantity Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
           <AddIcon
            sx={{
             color: 'white',
             background: 'green',
             borderRadius: '50%',
             padding: '4px',
             cursor: 'pointer',
            }}
           />
           <Typography variant="h6" color="textPrimary">
            0
           </Typography>
           <RemoveOutlinedIcon
            sx={{
             color: 'white',
             background: 'red',
             borderRadius: '50%',
             padding: '4px',
             cursor: 'pointer',
            }}
           />
          </Box>
         </Box>

        </CardContent>

        {/* Uncomment this block if user roles need to access admin features */}
        {/* {userData.role === "admin" || userData.role === "manager" ? (
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Switch
          {...label}
          defaultChecked={item.status === "show"}
          onChange={(e) => handleShow(e, item)}
        />
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          sx={{ width: '40%' }}
          onClick={() => handleDelete(item)}
        >
          Delete
        </Button>
      </CardActions>
    ) : null} */}
       </Card>
      </Grid>


     ))
   ) : (
    <Typography sx={{ width: '100%', textAlign: 'center', mt: 2 }}>
     No food items found.
    </Typography>
   )}
   {/* <ToastContainer /> */}

  </Grid>
 )
}

export default CreateNewOrder
