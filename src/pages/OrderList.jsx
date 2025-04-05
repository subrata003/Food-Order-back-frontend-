import React, { useEffect, useState } from "react";
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
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
 TablePagination,
} from "@mui/material";
import { Formik, Form, FieldArray } from "formik";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import dayjs from "dayjs";
import { useFood } from "../storeContext/ContextApi";
import { format } from 'date-fns';
import { isSameDay } from "date-fns";

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



 // console.log("order list is is is :",orderList);
 const today = new Date();

const todayOrders = orders.filter(order =>
  isSameDay(new Date(order.createdAt), today)
);
 
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

 ////
 const [page, setPage] = React.useState(0);
 const rowsPerPage = 6;

 const handleChangePage = (event, newPage) => setPage(newPage);

 
 /////////

 return (
  <Box sx={{ p: 4, maxWidth: "100%", mx: "auto" }}>
  <Grid container spacing={15}>
    {/* Orders List Section */}
    <Grid item xs={12} md={8}>
      <Typography variant="h5" textAlign="center" mb={3} fontWeight={600}>
        Orders List
      </Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 4, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              {['User', 'Phone', 'Items', 'Total (₹)', 'Status', 'Date', 'Action'].map((head) => (
                <TableCell key={head} sx={{ color: "white", fontWeight: "bold" }}>
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
              <TableRow key={order._id} hover>
                <TableCell>{order.userName}</TableCell>
                <TableCell>{order.phoneNo}</TableCell>
                <TableCell>
                  {order.items.map((item) => `${item.name}${item.quantity > 1 ? ` x${item.quantity}` : ""}`).join(", ")}
                </TableCell>
                <TableCell>₹{order.totalAmount}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{format(new Date(order.createdAt), 'hh:mm a dd/MM/yy')}</TableCell>
                <TableCell>
                  <Button  onClick={() => handleEdit(order)}> <EditCalendarOutlinedIcon/> </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={orders.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[]}
        />
      </TableContainer>
    </Grid>

    {/* Order History Section */}
    <Grid item xs={12} md={4}>
      <Typography variant="h6" textAlign="center" mb={2} fontWeight={600}>
        Order History
      </Typography>
      <Tabs
        value={historyFilter}
        onChange={(e, newValue) => setHistoryFilter(newValue)}
        centered
        variant="fullWidth"
      >
        <Tab label={`Today `} value="Today" />
        <Tab label={`This Week `} value="This Week" />
        <Tab label={`This Month `} value="This Month" />
      </Tabs>
      <Box sx={{ maxHeight: 450, overflowY: "auto", mt: 2 }}>
        {filteredOrders.map((order) => (
          <Card key={order._id} sx={{ mb: 2, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="body1" fontWeight={600}>
                {order.userName} - ₹{order.totalAmount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {dayjs(order.createdAt).format("DD MMM YYYY, hh:mm A")}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Grid>
  </Grid>

  {/* Edit Order Modal */}
  {selectedOrder && (
    <Modal open={openModal} onClose={() => setOpenModal(false)}>
      <Box sx={{ p: 4, width: "50%", mx: "auto", mt: 10, bgcolor: "white", borderRadius: 3, boxShadow: 4 }}>
        <Typography variant="h6" mb={2} fontWeight={600}>Edit Order</Typography>
        <Formik initialValues={selectedOrder} onSubmit={handleUpdate}>
          {({ values, handleChange, handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <TextField
                fullWidth label="User Name" name="userName"
                value={values.userName} onChange={handleChange} sx={{ mb: 2 }}
              />
              <TextField
                fullWidth label="Phone No" name="phoneNo"
                value={values.phoneNo} onChange={handleChange} sx={{ mb: 2 }}
              />
              <FieldArray name="items">
                {({ push, remove }) => (
                  <>
                    {values.items.map((item, index) => (
                      <Box key={index} sx={{ display: "flex", gap: 1, mb: 2 }}>
                        <TextField label="Name" name={`items.${index}.name`} value={item.name} onChange={handleChange} />
                        <TextField label="Price" name={`items.${index}.price`} type="number" value={item.price} onChange={handleChange} />
                        <TextField label="Qty" name={`items.${index}.quantity`} type="number" value={item.quantity} onChange={handleChange} />
                        <IconButton color="error" onClick={() => remove(index)}><DeleteIcon /></IconButton>
                      </Box>
                    ))}
                    <Button startIcon={<AddCircleIcon />} onClick={() => push({ name: "", price: "", quantity: "" })}>
                      Add Item
                    </Button>
                  </>
                )}
              </FieldArray>
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