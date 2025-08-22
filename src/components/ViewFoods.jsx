import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  IconButton,
  TextField,
  CardActions,
  Modal,
  Dialog,
  DialogContent,
  Stack,
  Avatar,
  Switch,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { deleteFood, updateFood } from "../apis/food/addFood";
import { useFood } from "../storeContext/ContextApi";
import { toast, ToastContainer } from "react-toastify";

const label = { inputProps: { 'aria-label': 'Switch demo' } };


// const viewFoods = [
//   { id: 1, name: "Margherita Pizza", category: "Pizza", price: 299 },
//   { id: 2, name: "Paneer Butter Masala", category: "Indian", price: 249 },
//   { id: 3, name: "Veg Biryani", category: "Rice", price: 199 },
//   { id: 4, name: "Chicken Burger", category: "Fast Food", price: 149 },
//   { id: 5, name: "Chocolate Brownie", category: "Dessert", price: 99 },
// ];

const View = () => {
  // const url = "https://food-order-backend-production-84ea.up.railway.app"
  const url ="http://localhost:8080";
  const { foodList, removeFood, fetchFoods, userData } = useFood();
  console.log("foodlist", foodList);


  // const [foodList, setFoodItems] = useState(foodList);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [foodId, setFoodId] = useState(null);
  const [delateItem, setDeleteItem] = useState([])
  const [checked, setChecked] = useState(false);
  console.log("checked:", checked);

  const notify = (message) => {
    toast.success(`${message}`, {
      position: "top-right", // Adjust position
      autoClose: 2000, // Auto-close after 3 sec
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  // Function to delete a food item
  const handleDelete = async (item) => {
    setFoodId(item._id)
    setDeleteItem(item)
    setOpen(true);


  };
  const handleClose = async () => {
    setOpen(false);
  }
  const handleDeleteSingleFood = async () => {
    await removeFood(foodId);
    await fetchFoods();
    handleClose();
  }

  // Filter food items based on search term
  const filteredItems = foodList.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleShow = async (e, item) => {
    // setChecked(e.target.checked)
    const ischecekd = e.target.checked
    const newStatus = !ischecekd ? "hide" : "show"
    const updatedItem = { ...item, status: newStatus };
    console.log("updatedItem:", updatedItem);

    try {
      const res = await updateFood(item._id, updatedItem)
      if (res.success == true) {
        // console.log(res.message);

        fetchFoods();
        notify(res.message);

      }

    } catch (error) {

    }



  }

  return (
    <>
      <Box sx={{ p: 4, width: "90%", mx: "auto" }}>
        {/* Search Bar & Item Count */}
        <Box
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}
        >
          <Typography variant="h6">
            Total Items: <strong>{filteredItems.length}</strong>
          </Typography>
          <TextField
            size="small"
            placeholder="Search Food..."
            variant="outlined"
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1 }} />,
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>

        {/* Tabs for Switching Views */}
        <Tabs
          value={tabValue}
          onChange={(event, newValue) => setTabValue(newValue)}
          centered
          sx={{ mb: 3 }}
          TabIndicatorProps={{
            style: {
              backgroundColor: "#da1142",
            },
          }}
        >
          <Tab
            label="Card View"
            sx={{
              '&.Mui-selected': {
                color: "#da1142",
                fontWeight: "bold",
              },
            }}
          />
          <Tab
            label="Table View"
            sx={{
              '&.Mui-selected': {
                color: "#da1142",
                fontWeight: "bold",
              },
            }}
          />
        </Tabs>

        {/* Table View */}
        {tabValue === 1 && (
          <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Image</strong></TableCell>
                  <TableCell><strong>Food Name</strong></TableCell>
                  <TableCell><strong>Category</strong></TableCell>
                  <TableCell><strong>Price (₹)</strong></TableCell>
                  <TableCell><strong>Quantity</strong></TableCell>

                  {userData.role == "admin" || userData.role == "manager" ? <TableCell><strong>Action</strong></TableCell> : " "}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.image ? (
                        <img
                          src={`${url}/images/${item.image}`} // This should be the image URL or path from your API
                          alt={item.name}   // Alt text for accessibility
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }} // Adjust the size as needed
                        />
                      ) : (
                        <span>No Image</span> // If no image is available
                      )}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>₹{item.price}</TableCell>
                      <TableCell>{item.quantity}</TableCell>

                      {userData.role == "admin" || userData.role == "manager" ? <TableCell>
                        <IconButton color="error" onClick={() => handleDelete(item)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell> : ''}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No food items found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Card View */}
        {tabValue === 0 && (
          <Grid container spacing={3}>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    {item.quantity > 0 ?
                      <CardContent>
                        {/* Display Image */}
                        {item.image ? (
                          <img
                            src={`${url}/images/${item.image}`} // Image URL from API
                            alt={item.name}  // Alt text for accessibility
                            style={{
                              width: '100%',         // Ensure the image takes up full width of the card
                              height: '200px',       // Set a fixed height for the image
                              objectFit: 'cover',    // Ensure the image scales correctly without stretching
                              borderRadius: '8px',   // Optional: Adds rounded corners to the image
                              marginBottom: '16px',  // Space between image and text
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
                        <Typography sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="h6" color="secondary" sx={{ mb: 2 }}>
                            Price: ₹{item.price}
                          </Typography>
                          <Typography variant="h6" color="secondary" sx={{ mb: 2 }}>
                            Quantity:{item.quantity}
                          </Typography>
                        </Typography>
                      </CardContent> :
                      <CardContent sx={{opacity: item.quantity <= 0 ? 0.5 : 1,}}>
                        {/* Display Image */}
                        {item.image ? (
                          <img
                            src={`${url}/images/${item.image}`} // Image URL from API
                            alt={item.name}  // Alt text for accessibility
                            style={{
                              width: '100%',         // Ensure the image takes up full width of the card
                              height: '200px',       // Set a fixed height for the image
                              objectFit: 'cover',    // Ensure the image scales correctly without stretching
                              borderRadius: '8px',   // Optional: Adds rounded corners to the image
                              marginBottom: '16px',  // Space between image and text
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
                        <Typography sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="h6" color="secondary" sx={{ mb: 2 }}>
                            Price: ₹{item.price}
                          </Typography>
                          <Typography variant="h6" color="secondary" sx={{ mb: 2 }}>
                            Quantity:{item.quantity}
                          </Typography>
                        </Typography>
                        
                      </CardContent>

                      


                    }

                    {userData.role == "admin" || userData.role == "manager" ?
                      <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>

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
                      </CardActions> : " "}
                  </Card>
                </Grid>

              ))
            ) : (
              <Typography sx={{ width: '100%', textAlign: 'center', mt: 2 }}>
                No food items found.
              </Typography>
            )}
            <ToastContainer />

          </Grid>

        )}

      </Box>
      {foodId && <Dialog
        open={open}
        onClose={handleClose}
        keepMounted
        maxWidth="xs"
        aria-labelledby="item-delete-title"
        aria-describedby="item-delete-description"
      >
        <DialogContent sx={{ mt: 2, my: 1 }}>
          <Stack alignItems="center" spacing={3.5}>
            <Avatar color="error" sx={{ width: 70, height: 70, fontSize: '1.75rem' }}>
              <img src={`${url}/images/${delateItem.image}`} alt={delateItem.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Avatar>
            <Stack spacing={2}>
              <Typography variant="h4" align="center">
                Are you sure you want to delete?
              </Typography>
              <Typography align="center">
                By deleting
                <Typography variant="subtitle1" component="span">
                  {' '}
                  &quot;{delateItem.name}&quot;{' '}.
                </Typography>
                Its details will also be removed from invoice.
              </Typography>
            </Stack>

            <Stack direction="row" spacing={2} sx={{ width: 1 }}>
              <Button fullWidth onClick={() => handleClose(false)} color="secondary" variant="outlined">
                Cancel
              </Button>
              <Button fullWidth color="error" variant="contained" onClick={handleDeleteSingleFood} autoFocus>
                Delete
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>}
    </>
  );
};

export default View;
