import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Divider,
  Paper,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getAllFood } from '../apis/food/addFood';
import AddIcon from '@mui/icons-material/Add';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import axios from 'axios';
import { OrderList } from '../../public/list';
import { SignLanguage } from '@mui/icons-material';
import { useSelector } from 'react-redux';


function CreateNewOrder() {
  const url = 'http://localhost:8080';
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState({});
  const [singleHeader, setSingleHeader] = useState('')
  const selectedOrder = useSelector((state) => state.updateorder.list);
  console.log("selectedOrder is :", selectedOrder);

  //  console.log(foods?.category,singleHeader);
  //  console.log(foods,singleHeader);
  console.log("cart is :", cart);


  useEffect(() => {
    const fetchAllFood = async () => {
      const res = await getAllFood();
      setFoods(res.data);
    };
    fetchAllFood();
  }, []);

  const handleAdd = (item) => {
    setCart((prev) => {
      const currentQty = prev[item._id]?.quantity || 0;
      if (currentQty < item.quantity) {
        return {
          ...prev,
          [item._id]: {
            img: item.image,
            foodId: item._id,
            name: item.name,
            price: item.price,
            quantity: currentQty + 1,
          },
        };
      }
      return prev;
    });
  };

  const handleRemove = (item) => {
    setCart((prev) => {
      const currentQty = prev[item._id]?.quantity || 0;
      if (currentQty > 1) {
        return {
          ...prev,
          [item._id]: {
            ...prev[item._id],
            quantity: currentQty - 1,
          },
        };
      } else {
        const updatedCart = { ...prev };
        delete updatedCart[item._id];
        return updatedCart;
      }
    });
  };

  const placeOrder = async () => {
    const selectedItems = Object.values(cart);
    const totalAmount = selectedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const payload = {
      userName: 'Subrata Roy',
      phoneNo: '9876543210',
      tableNo: 'A2',
      items: selectedItems,
      totalAmount,
    };

    try {
      await axios.post(`${url}/api/food/order/add`, payload);
      alert('Order placed!');
      setCart({});
    } catch (err) {
      console.error(err);
      alert('Error placing order');
    }
  };

  const cancelOrder = () => {
    setCart({});
  };

  const filterItem = (item) => {
    // console.log(item);
    setSingleHeader(item.name || '');


  }

  const showHeaderFoods = singleHeader ? foods.filter((item) => item.category === singleHeader) : foods;



  return (
    <Box >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, cursor: 'pointer' }} onClick={cancelOrder}>
        <ShoppingCartOutlinedIcon sx={{ fontSize: 40 }} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          p: 2,
          borderRadius: 2,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          marginBottom: '20px',
        }}
      >
        {OrderList.map((item, index) => (
          <Box
            key={index}
            sx={{
              flex: '0 0 auto',
              minWidth: '160px', // creates consistent spacing between items
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'transform 0.3s ease',
              mr: 2, // right margin between cards
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
            onClick={() => filterItem(item)}
          >
            <Box
              sx={{
                width: '130px',
                height: '130px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #ddd',
                mx: 'auto',
                mb: 1,
                backgroundColor: '#fff',
              }}
            >
              <img
                src={item.img}
                alt={item.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
            <Typography
              variant="body2"
              fontWeight="500"
              color="textPrimary"
              noWrap
            >
              {item.name}
            </Typography>
          </Box>
        ))}
      </Box>
      <Divider />
      <Typography sx={{ margin: "20px 0 20px 20px" }}>{singleHeader ? `${singleHeader}` : `All`}</Typography>
      <Grid container spacing={3}>
        {showHeaderFoods.filter((e) => e.status === 'show').length > 0 ? (
          showHeaderFoods
            .filter((e) => e.status === 'show')
            .map((item) => {
              const selectedQty = cart[item._id]?.quantity || 0;
              return (
                <Grid item xs={12} sm={6} md={3} key={item._id}>
                  {!item.quantity - selectedQty <= 0 ?
                    <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: "18vw" }}>
                      <CardContent sx={{ width: "100%" }}>
                        {item.image ? (
                          <img
                            src={`${url}/images/${item.image}`}
                            alt={item.name}
                            style={{
                              width: '100%',
                              height: '150px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              marginBottom: '16px',
                            }}
                          />
                        ) : (
                          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mb: 2 }}>
                            No Image Available
                          </Typography>
                        )}

                        <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mb: 1 }}>
                          {item.name}
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Box>
                            <Typography variant="h6" color="secondary">Price: ₹{item.price}</Typography>
                            <Typography variant="h6" color="secondary">Stock: {item.quantity - selectedQty}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AddIcon
                              sx={{ color: 'white', background: 'green', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}
                              onClick={() => handleAdd(item)}
                            />
                            <Typography variant="h6" color="textPrimary">{selectedQty}</Typography>
                            <RemoveOutlinedIcon
                              sx={{ color: 'white', background: 'red', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}
                              onClick={() => handleRemove(item)}
                            />
                          </Box>
                        </Box>
                      </CardContent>

                    </Card> :
                    <Card
                      sx={{
                        p: 2,
                        boxShadow: 3,
                        borderRadius: 2,
                        opacity: item.quantity - selectedQty <= 0 ? 0.5 : 1,
                        pointerEvents: item.quantity - selectedQty <= 0 ? 'none' : 'auto',
                        position: 'relative',
                        width: "18vw"
                      }}
                    >
                      <CardContent sx={{ width: "100%" }}>
                        {item.image ? (
                          <img
                            src={`${url}/images/${item.image}`}
                            alt={item.name}
                            style={{
                              width: '100%',
                              height: '150px',
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

                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color="primary"
                          sx={{ mb: 1 }}
                        >
                          {item.name}
                        </Typography>

                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                          }}
                        >
                          <Box>
                            <Typography variant="h6" color="secondary">
                              Price: ₹{item.price}
                            </Typography>
                            <Typography variant="h6" color="secondary">
                              Stock: {item.quantity - selectedQty}
                            </Typography>

                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            <AddIcon
                              sx={{
                                color: 'white',
                                background:
                                  item.quantity - selectedQty <= 0 ? 'gray' : 'green',
                                borderRadius: '50%',
                                padding: '4px',
                                cursor:
                                  item.quantity - selectedQty <= 0 ? 'not-allowed' : 'pointer',
                              }}
                              onClick={() => {
                                if (item.quantity - selectedQty > 0) handleAdd(item);
                              }}
                            />
                            <Typography variant="h6" color="textPrimary">
                              {selectedQty}
                            </Typography>
                            <RemoveOutlinedIcon
                              sx={{
                                color: 'white',
                                background: 'red',
                                borderRadius: '50%',
                                padding: '4px',
                                cursor: 'pointer',
                              }}
                              onClick={() => handleRemove(item)}
                            />
                          </Box>
                        </Box>
                      </CardContent>

                      {/* Optional overlay */}
                      {item.quantity - selectedQty <= 0 && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            bgcolor: 'rgba(255,255,255,0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem',
                            color: 'red',
                            fontWeight: 'bold',
                            borderRadius: 2,
                          }}
                        >
                          Out of Stock
                        </Box>
                      )}
                    </Card>
                  }
                </Grid>
              );
            })
        ) : (
          <Typography sx={{ width: '100%', textAlign: 'center', mt: 2 }}>
            No food items found.
          </Typography>
        )}
      </Grid>

      {/* CART PREVIEW */}


      {/* update food */}
      {selectedOrder.items?.length > 0 ? Object.values(cart).length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Cart Preview w
            </Typography>
            {selectedOrder.items?.map((e) => (
              <Box
                key={e.foodId}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2,
                  p: 2,
                  borderRadius: 2,
                  boxShadow: 2,
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  maxWidth: 600,
                  mx: 'auto'
                }}
              >
                {/* Left section: Name and Quantity x Price */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography variant="subtitle1" fontWeight="bold" color="primary">
                    {e.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {e.quantity} x ₹{e.price}
                  </Typography>
                </Box>

                {/* Right section: Total Price */}
                <Typography variant="subtitle1" fontWeight="bold" color="success.main">
                  ₹{e.quantity * e.price}
                </Typography>
              </Box>

            ))}
            {Object.values(cart).map((item) => (
              <Box
                key={item.foodId}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2,
                  p: 2,
                  borderRadius: 2,
                  boxShadow: 1,
                  // backgroundColor: "#f9f9f9",
                  borderBottom: "2px solid #a7062d"
                }}
              >
                {/* Left section: Image and Name */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    component="img"
                    src={`${url}/images/${item.img}`}
                    alt={item.name}
                    sx={{ width: 60, height: 60, borderRadius: 2, objectFit: "cover" }}
                  />
                  <Typography variant="subtitle1" fontWeight="bold">
                    {item.name}
                  </Typography>
                </Box>

                {/* Right section: Quantity x Price */}
                <Typography variant="subtitle1" fontWeight="500">
                  {item.quantity} x ₹{item.price} = <strong>₹{item.quantity * item.price}</strong>
                </Typography>
              </Box>

            ))}
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">
              Total: ₹
              {Object.values(cart).reduce((acc, item) => acc + item.quantity * item.price, 0)}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button variant="contained" color="primary" onClick={placeOrder}>
                update Order
              </Button>
              <Button variant="outlined" color="error" onClick={cancelOrder}>
                Cancel Order
              </Button>
            </Box>
          </Paper>
        </Box>
      ) :
        Object.values(cart).length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Cart Preview
              </Typography>
              {Object.values(cart).map((item) => (
                <Box
                  key={item.foodId}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 1,
                    // backgroundColor: "#f9f9f9",
                    borderBottom: "2px solid #a7062d"
                  }}
                >
                  {/* Left section: Image and Name */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      component="img"
                      src={`${url}/images/${item.img}`}
                      alt={item.name}
                      sx={{ width: 60, height: 60, borderRadius: 2, objectFit: "cover" }}
                    />
                    <Typography variant="subtitle1" fontWeight="bold">
                      {item.name}
                    </Typography>
                  </Box>

                  {/* Right section: Quantity x Price */}
                  <Typography variant="subtitle1" fontWeight="500">
                    {item.quantity} x ₹{item.price} = <strong>₹{item.quantity * item.price}</strong>
                  </Typography>
                </Box>

              ))}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">
                Total: ₹
                {Object.values(cart).reduce((acc, item) => acc + item.quantity * item.price, 0)}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button variant="contained" color="primary" onClick={placeOrder}>
                  Place Order
                </Button>
                <Button variant="outlined" color="error" onClick={cancelOrder}>
                  Cancel Order
                </Button>
              </Box>
            </Paper>
          </Box>
        )}

    </Box>
  );
}

export default CreateNewOrder;
