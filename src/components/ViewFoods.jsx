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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

const initialFoodItems = [
  { id: 1, name: "Margherita Pizza", category: "Pizza", price: 299 },
  { id: 2, name: "Paneer Butter Masala", category: "Indian", price: 249 },
  { id: 3, name: "Veg Biryani", category: "Rice", price: 199 },
  { id: 4, name: "Chicken Burger", category: "Fast Food", price: 149 },
  { id: 5, name: "Chocolate Brownie", category: "Dessert", price: 99 },
];

const View = () => {
  const [foodItems, setFoodItems] = useState(initialFoodItems);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // Function to delete a food item
  const handleDelete = (id) => {
    setFoodItems(foodItems.filter((item) => item.id !== id));
  };

  // Filter food items based on search term
  const filteredItems = foodItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
      >
        <Tab label="Table View" />
        <Tab label="Card View" />
      </Tabs>

      {/* Table View */}
      {tabValue === 0 && (
        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Food Name</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell><strong>Price (₹)</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>₹{item.price}</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleDelete(item.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
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
      {tabValue === 1 && (
        <Grid container spacing={3}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card sx={{ p: 2, boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Category: {item.category}
                    </Typography>
                    <Typography variant="h6" color="secondary">
                      Price: ₹{item.price}
                    </Typography>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<DeleteIcon />}
                      sx={{ mt: 2 }}
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography sx={{ width: "100%", textAlign: "center", mt: 2 }}>
              No food items found.
            </Typography>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default View;
