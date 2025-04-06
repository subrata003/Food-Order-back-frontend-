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
  InputAdornment,
} from "@mui/material";
import { Formik, Form, FieldArray } from "formik";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import dayjs from "dayjs";
import { useFood } from "../storeContext/ContextApi";
import { format, isSameDay, isSameWeek, isSameMonth, compareDesc } from "date-fns";
import { orderUpdate } from "../apis/order/order";
import SearchIcon from '@mui/icons-material/Search';

const OrderList = () => {
  const { orderList, fetchAllOrders } = useFood();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [historyFilter, setHistoryFilter] = useState("Today");
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState([])
  const rowsPerPage = 6;

  useEffect(() => {
    fetchAllOrders();
  }, [orderList]);

  useEffect(() => {
    const sortedOrders = [...orderList].sort((a, b) =>
      compareDesc(new Date(a.createdAt), new Date(b.createdAt))
    );
    setOrders(sortedOrders);
  }, [orderList]);

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setOpenModal(true);
  };

  const handleUpdate = async (values) => {
    console.log("updated values is :", values);
    const id = values._id
    console.log("id is :", id);


    try {
      const res = await orderUpdate(id, values)
      if (res.success == true) {
        console.log("order updated");
        fetchAllOrders();
      }

    } catch (error) {
      console.log(error);


    }

    // setOrders((prevOrders) =>
    //   prevOrders.map((order) =>
    //     order._id === selectedOrder._id ? { ...values, _id: selectedOrder._id } : order
    //   )
    // );
    setOpenModal(false);
  };

  const filteredOrders = orders
    .filter((order) => {
      const orderDate = new Date(order.createdAt);
      const today = new Date();
      if (historyFilter === "Today") return isSameDay(orderDate, today);
      if (historyFilter === "This Week") return isSameWeek(orderDate, today);
      if (historyFilter === "This Month") return isSameMonth(orderDate, today);
      return true;
    })
    .sort((a, b) => compareDesc(new Date(a.createdAt), new Date(b.createdAt)));

  const handleChangePage = (event, newPage) => setPage(newPage);

  const filterOrder = orders.filter((item) => {
    const term = String(searchTerm || "").toLowerCase();
    return item.orderId?.toString().toLowerCase().includes(term);
  });
  ;


  return (
    <Box sx={{ p: 4, maxWidth: "100%", mx: "auto" }}>
      <Grid container spacing={15}>
        {/* Orders List Section */}
        <Grid item xs={12} md={8}>
          <Typography sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h5" textAlign="center" mb={3} fontWeight={600}>
              Orders List
            </Typography>
            <Typography variant="h5" textAlign="center" mb={3} fontWeight={600}>
              <TextField
                placeholder="Search by orderId"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ width: 300, marginBottom: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Typography>
          </Typography>
          <TableContainer component={Paper} sx={{ boxShadow: 4, borderRadius: 2, width: "50vw" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#da1142" }}>
                  {['OrderId', 'User', 'Phone', 'Items', 'Total (₹)', 'Status', 'Date', 'Action'].map((head) => (
                    <TableCell key={head} sx={{ color: "white", fontWeight: "bold" }}>
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filterOrder.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
                  <TableRow key={order._id} hover>
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>{order.userName}</TableCell>
                    <TableCell>{order.phoneNo}</TableCell>
                    <TableCell>
                      {order.items.map((item) => `${item.name}${item.quantity > 1 ? ` x${item.quantity}` : ""}`).join(", ")}
                    </TableCell>
                    <TableCell>₹{order.totalAmount}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{format(new Date(order.createdAt), 'hh:mm a dd/MM/yy')}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleEdit(order)}> <EditCalendarOutlinedIcon sx={{ color: "#f41f53 " }} /> </Button>
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
            TabIndicatorProps={{
              style: {
                backgroundColor: "#da1142",// '#ff9800', // custom underline color
              },
            }}
          >
            <Tab sx={{
              '&.Mui-selected': {
                color: "#f41f53 ",// '#ff9800', // selected text color
                fontWeight: 'bold',
              },
            }} label="Today" value="Today" />
            <Tab sx={{
              '&.Mui-selected': {
                color: "#f41f53 ",//'#ff9800', // selected text color
                fontWeight: 'bold',
              },
            }} label="This Week" value="This Week" />
            <Tab sx={{
              '&.Mui-selected': {
                color: "#f41f53 ", // '#ff9800', // selected text color
                fontWeight: 'bold',
              },
            }} label="This Month" value="This Month" />
          </Tabs>
          <Box
            sx={{
              maxHeight: 450,
              overflowY: "auto",
              mt: 2,
              pr: 1, 
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f0f0f0", 
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#da1142", 
                borderRadius: "8px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor:"#b70d38", 
              },
            }}
          >
            {filteredOrders.map((order) => (
              <Card key={order._id} sx={{ mb: 2, boxShadow: 2, borderBottom: "2px solid #da1142" }}>
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
          <Box
            sx={{
              p: 4,
              width: "50%",
              mx: "auto",
              mt: 10,
              bgcolor: "white",
              borderRadius: 3,
              boxShadow: 4,
            }}
          >
            <Typography variant="h6" mb={2} fontWeight={600}>
              Edit Order
            </Typography>

            <Formik initialValues={selectedOrder} onSubmit={handleUpdate}>
              {({ values, handleChange, handleSubmit }) => {
                const isCompleted = selectedOrder.status === "Completed";
                const isCanceled = selectedOrder.status === "canceled";

                return (
                  <Form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      label="User Name"
                      name="userName"
                      value={values.userName}
                      onChange={handleChange}
                      sx={{ mb: 2 }}
                      disabled={isCompleted || isCanceled}
                    />

                    <TextField
                      fullWidth
                      label="Phone No"
                      name="phoneNo"
                      value={values.phoneNo}
                      onChange={handleChange}
                      sx={{ mb: 2 }}
                      disabled={isCompleted}
                    />

                    <FieldArray name="items">
                      {({ push, remove }) => (
                        <>
                          {values.items.map((item, index) => (
                            <Box key={index} sx={{ display: "flex", gap: 1, mb: 2 }}>
                              <TextField
                                label="Name"
                                name={`items.${index}.name`}
                                value={item.name}
                                onChange={handleChange}
                                disabled={isCompleted}
                              />
                              <TextField
                                label="Price"
                                name={`items.${index}.price`}
                                type="number"
                                value={item.price}
                                onChange={handleChange}
                                disabled={isCompleted}
                              />
                              <TextField
                                label="Qty"
                                name={`items.${index}.quantity`}
                                type="number"
                                value={item.quantity}
                                onChange={handleChange}
                                disabled={isCompleted}
                              />
                              <IconButton
                                color="error"
                                onClick={() => remove(index)}
                                disabled={isCompleted}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          ))}
                          <Button
                            startIcon={<AddCircleIcon sx={{ color: "#da1142" }} />}
                            onClick={() => push({ name: "", price: "", quantity: "" })}
                            disabled={isCompleted}
                            sx={{ color: "#da1142" }}
                          >
                            Add Item
                          </Button>
                        </>
                      )}
                    </FieldArray>

                    <Select
                      fullWidth
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      sx={{ my: 2 }}
                      disabled={isCompleted}
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Processing">Processing</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                      <MenuItem value="canceled">canceled</MenuItem>
                    </Select>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                      <Button
                        variant="contained"
                        type="submit"

                        disabled={isCompleted || isCanceled}
                        sx={{ background: "#da1142" }}
                      >
                        Update Order
                      </Button>
                    </Box>
                  </Form>
                );
              }}
            </Formik>
          </Box>
        </Modal>

      )}
    </Box>
  );
};

export default OrderList;
