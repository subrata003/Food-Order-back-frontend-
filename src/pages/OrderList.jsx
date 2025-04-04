import React, { useEffect, useState } from "react";
import {
 Box,
 Grid,
 Table,
 TableBody,
 TableCell,
 TableContainer,
 TableHead,
 TableRow,
 Paper,
 Button,
 Modal,
 TextField,
 Select,
 MenuItem,
 IconButton,
 Typography,
 Card,
 CardContent,
 Tabs,
 Tab,
} from "@mui/material";
import { Formik, Form, FieldArray } from "formik";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import dayjs from "dayjs";
import { useFood } from "../storeContext/ContextApi";
import { format } from 'date-fns';

// const initialOrders = [
//  {
//   id: "1",
//   userName: "Ratan",
//   phoneNo: "1234267384",
//   items: [
//    { name: "Motan", price: 121, quantity: 2 },
//    { name: "Moton", price: 111, quantity: 3 },
//   ],
//   totalAmount: "500",
//   status: "Pending",
//   createdAt: new Date(),
//  },
// ];

const OrderList = () => {
 const{orderList,fetchAllOrders}=useFood();
 const [orders, setOrders] = useState(orderList);
 const [selectedOrder, setSelectedOrder] = useState(null);
 const [openModal, setOpenModal] = useState(false);
 const [historyFilter, setHistoryFilter] = useState("Today");



 console.log("order list is is is :",orderList);
 
 useEffect(() => {
  fetchAllOrders();
  setOrders(orderList);
 },[orderList])
 

 const handleEdit = (order) => {
  setSelectedOrder(order);
  setOpenModal(true);
 };

 const handleUpdate = (values) => {
  setOrders((prevOrders) =>
   prevOrders.map((order) =>
    order.id === selectedOrder.id ? { ...values, id: selectedOrder.id } : order
   )
  );
  setOpenModal(false);
 };

 /////////
 const filteredOrders = orders.filter((order) => {
  const orderDate = dayjs(order.createdAt);
  const today = dayjs();
  if (historyFilter === "Today") return orderDate.isSame(today, "day");
  if (historyFilter === "This Week") return orderDate.isSame(today, "week");
  if (historyFilter === "This Month") return orderDate.isSame(today, "month");
  return true;
 });

 
 /////////

 return (
  <Box sx={{ p: 4, width: "95%", mx: "auto" }}>
   <Grid container spacing={3}>
    <Grid item xs={12} md={8}>
     <Typography variant="h5" textAlign="center" mb={3}>Orders List</Typography>
     <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
      <Table>
       <TableHead>
        <TableRow sx={{ bgcolor: "primary.main", color: "white" }}>
         <TableCell sx={{ color: "white" }}>User</TableCell>
         <TableCell sx={{ color: "white" }}>Phone</TableCell>
         <TableCell sx={{ color: "white" }}>Items</TableCell>
         <TableCell sx={{ color: "white" }}>Total (₹)</TableCell>
         <TableCell sx={{ color: "white" }}>Status</TableCell>
         <TableCell sx={{ color: "white" }}>Date</TableCell>

         <TableCell sx={{ color: "white" }}>Action</TableCell>
        </TableRow>
       </TableHead>
       <TableBody>
        {orders.map((order) => (
         <TableRow key={order.orderId}>
          <TableCell>{order.userName}</TableCell>
          <TableCell>{order.phoneNo}</TableCell>
          <TableCell>
           {order.items.map((item) => `${item.name}${item.quantity > 1 ? ` x${item.quantity}` : ""}`).join(", ")}
          </TableCell>

          <TableCell>₹{order.totalAmount}</TableCell>
          <TableCell>{order.status}</TableCell>
          <TableCell>{format(new Date(order.createdAt), ' hh:mm a dd/MM/yy ')}</TableCell>

          <TableCell>
           <Button variant="contained" onClick={() => handleEdit(order)}>
            Edit
           </Button>
          </TableCell>
         </TableRow>
        ))}
       </TableBody>
      </Table>
     </TableContainer>
    </Grid>

    <Grid item xs={12} md={4}>
     <Typography variant="h6" textAlign="center" mb={2}>Order History</Typography>
     <Tabs value={historyFilter} onChange={(e, newValue) => setHistoryFilter(newValue)} centered>
     <Tab label={`Today(${filteredOrders.length})`} value="Today" />
      <Tab label={`This Week (${filteredOrders.length})`} value="This Week" />
      <Tab label={`This Month (${filteredOrders.length})`} value="This Month"/>
     </Tabs>
     {filteredOrders.map((order) => (
      <Card key={order.id} sx={{ mt: 2 }}>
       <CardContent>
        <Typography variant="body1">{order.userName} - ₹{order.totalAmount}</Typography>
        <Typography variant="body2" color="textSecondary">{dayjs(order.createdAt).format("DD MMM YYYY")}</Typography>
       </CardContent>
      </Card>
     ))}
    </Grid>
   </Grid>

   {selectedOrder && (
    <Modal open={openModal} onClose={() => setOpenModal(false)}>
     <Box sx={{ p: 4, width: "40%", mx: "auto", mt: 10, bgcolor: "white", borderRadius: 2 }}>
      <Typography variant="h6" mb={2}>Edit Order</Typography>
      <Formik initialValues={selectedOrder} onSubmit={handleUpdate}>
       {({ values, handleChange, handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
         <TextField fullWidth label="User Name" name="userName" value={values.userName} onChange={handleChange} sx={{ mb: 2 }} />
         <TextField fullWidth label="Phone No" name="phoneNo" value={values.phoneNo} onChange={handleChange} sx={{ mb: 2 }} />
         <FieldArray
          name="items"
          render={({ push, remove }) => (
           <>
            {values.items.map((item, index) => (
             <Box key={index} sx={{ display: "flex", gap: 1, mb: 1 }}>
              <TextField label="Name" name={`items.${index}.name`} value={item.name} onChange={handleChange} />
              <TextField label="Price" name={`items.${index}.price`} value={item.price} onChange={handleChange} type="number" />
              <TextField label="Qty" name={`items.${index}.quantity`} value={item.quantity} onChange={handleChange} type="number" />
              <IconButton color="error" onClick={() => remove(index)}><DeleteIcon /></IconButton>
             </Box>
            ))}
            <Button startIcon={<AddCircleIcon />} onClick={() => push({ name: "", price: "", quantity: "" })}>Add Item</Button>
           </>
          )}
         />
         <Select fullWidth name="status" value={values.status} onChange={handleChange} sx={{ my: 2 }}>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Processing">Processing</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
         </Select>
         <Button variant="contained" type="submit" fullWidth>Update Order</Button>
        </Form>
       )}
      </Formik>
     </Box>
    </Modal>
   )}
  </Box>
 );
};

export default OrderList;