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
  Chip,
  Drawer,
} from "@mui/material";
import { Formik, Form, FieldArray } from "formik";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import dayjs from "dayjs";
import { useFood } from "../storeContext/ContextApi";
import { format, isSameDay, isSameWeek, isSameMonth, compareDesc } from "date-fns";
import { orderUpdate } from "../apis/order/order";
import SearchIcon from '@mui/icons-material/Search';
import moment from "moment";
import { useDispatch } from "react-redux";
import { setOrder } from "../redux/slice/updateorderSlice";
import { Outlet, useNavigate } from "react-router-dom";
import { getAllTables } from "../apis/table/table";
import axios from "axios";

const OrderList = () => {
// const url ="https://food-order-backend-production-84ea.up.railway.app"
const url ="http://localhost:8080";
  const { orderList, fetchAllOrders } = useFood();

  
  const [orders, setOrders] = useState([]);

  
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [historyFilter, setHistoryFilter] = useState("Today");
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState([])
  const [allTables, setAllTables] = useState([])
  const rowsPerPage = 6;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
 
  

  useEffect(() => {
    fetchAllOrders();
    //  console.log("all tables is : ",allTables);
  }, [orderList]);

  useEffect(() => {
    const sortedOrders = [...orderList].sort((a, b) =>
      compareDesc(new Date(a.createdAt), new Date(b.createdAt))
    );
    setOrders(sortedOrders);
  }, [orderList]);

  useEffect(() => {

    fetchtables();
  }, [])
  const fetchtables = async () => {
    const res = await getAllTables()
    setAllTables(res.tables)
    // console.log("tables is :",res);

  }



  const handleEdit = (order) => {
    setSelectedOrder(order);
    setOpenModal(true);
  };

  const handleUpdate = async (values) => {
    console.log("updated values is :", values);
    const id = values._id
    console.log("id is :", id);


    const total = values.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const updatedValues = {
      ...values,
      totalAmount: total,
    }
    // setFieldValue("totalAmount", total);



    try {
      const res = await orderUpdate(id, updatedValues)
      console.log("update value is :",updatedValues);


      if (updatedValues.status === "Completed" || updatedValues.status === "canceled") {
        const selectedTable = allTables.find(
          (table) => table.tableNumber === updatedValues.tableNo
        );

        if (selectedTable) {
          await axios.put(`${url}/api/table/updatetable/${selectedTable._id}`, {
            status: "free",
          });
          console.log(`✅ Table ${updatedValues.tableNo} freed`);
        }
      }





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

  useEffect(() => {
  console.log("filter order is:", filterOrder);
}, []);

  // console.log("filter order is :",filterOrder);
  

  const updateOrderForUser = () => {
    console.log("update order for user");
    console.log(selectedOrder);
    dispatch(setOrder(selectedOrder))
    navigate("/sidebar/createorder")


  }



  return (
    <Box sx={{ p: 4, maxWidth: "100vw", mx: "auto" }}>
      <Grid container spacing={3}>
        {/* Orders List */}
        <Grid item xs={12} md={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight={600}>Orders List</Typography>
            <Box display="flex" gap={2}>
              <TextField
                placeholder="Search by Order ID"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ width: 300 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: "10px",
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#da1142', // red when focused
                    },
                  },
                }}
                InputLabelProps={{
                  sx: {
                    '&.Mui-focused': {
                      color: '#da1142', // optional: make label red too when focused
                    },
                  },
                }}
              />


              <Button
                variant="contained"
                onClick={() => setDrawerOpen(true)}
                sx={{ backgroundColor: "#da1142", borderRadius: '10px' }}
              >
                View Order History
              </Button>
            </Box>
          </Box>

          {/* Your TableComponent here */}
          <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, marginTop: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#da1142" }}>
                  {['OrderId', 'User', 'Phone', 'Items', 'Total (₹)', 'Payment', 'Status', 'Date', 'Action'].map((head) => (
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
                    <TableCell>
                      <Chip
                        sx={{ fontSize: "14px" }}
                        variant="outlined"
                        label={order.payment}
                        color={
                          order.payment === 'Cash' || order.payment === 'Online' ? 'success' :
                            order.payment === 'Unpaid' ? 'error' : 'default'
                        }

                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={
                          order.status === 'Completed' ? 'success' :
                            order.status === 'Pending' ? 'warning' :
                              order.status === 'Processing' ? 'info' :
                                order.status === 'canceled' ? 'error' : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell>{format(new Date(order.createdAt), 'hh:mm a dd/MM/yy')}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleEdit(order)}>
                        <EditCalendarOutlinedIcon sx={{ color: "#f41f53" }} />
                      </Button>
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
      </Grid>

      {/* MUI Drawer for Order History */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 400 }, padding: 2 } }}
      >
        <Typography variant="h6" fontWeight={600} textAlign="center" mb={2}>
          Order History
        </Typography>
        <Tabs
          value={historyFilter}
          onChange={(e, newValue) => setHistoryFilter(newValue)}
          centered
          variant="fullWidth"
          TabIndicatorProps={{ style: { backgroundColor: "#da1142" } }}
        >
          <Tab label="Today" value="Today" />
          <Tab label="This Week" value="This Week" />
          <Tab label="This Month" value="This Month" />
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
              backgroundColor: "#b70d38",
            },
          }}
        >
          {filteredOrders.map((order) => (
            <Card key={order._id} sx={{ mb: 2, boxShadow: 2, borderBottom: "2px solid #da1142" }}>
              <CardContent>
                <Typography variant="body1" fontWeight={600}>
                  {order.userName} - ₹{order.totalAmount}
                  <Chip
                    label={order.status}
                    variant="outlined"
                    color={
                      order.status === 'Completed' ? 'success' :
                        order.status === 'Pending' ? 'warning' :
                          order.status === 'Processing' ? 'info' :
                            order.status === 'canceled' ? 'error' : 'default'
                    }
                    sx={{ ml: 1 }}
                  />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {`${moment(order.createdAt).fromNow()} (${moment(order.createdAt).format("DD MMM YYYY")})`}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Drawer>

      {/* Edit Order Modal */}
      {selectedOrder && (
        <Modal open={openModal} onClose={() => setOpenModal(false)} disableScrollLock={true}>
          <Box
            sx={{
              p: 4,
              width: "90%",
              maxWidth: 600,
              maxHeight: "90vh",
              overflowY: "auto",
              mx: "auto",
              my: "5vh",
              bgcolor: "white",
              borderRadius: 3,
              boxShadow: 4,

              // Scrollbar styling
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'white',
                borderRadius: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'white',
              },
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
                      disabled={isCompleted || isCanceled}

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
                                disabled={true}
                              />

                              <TextField
                                label="Price"
                                name={`items.${index}.price`}
                                type="number"
                                value={item.price}
                                onChange={handleChange}
                                disabled={true}
                              />
                              <TextField
                                label="Qty"
                                name={`items.${index}.quantity`}
                                type="number"
                                value={item.quantity}
                                onChange={handleChange}
                                disabled={isCompleted || isCanceled}


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
                            onClick={updateOrderForUser}
                            disabled={isCompleted}
                            sx={{ color: "#da1142" }}
                          >
                            Add Item
                          </Button>
                          <Outlet />
                        </>
                      )}
                    </FieldArray>

                    <Select
                      fullWidth
                      name="payment"
                      value={values.payment}
                      onChange={handleChange}
                      sx={{ my: 2 }}
                      disabled={isCompleted || isCanceled}

                    >
                      <MenuItem value="Cash">Cash</MenuItem>
                      <MenuItem value="Online">Online</MenuItem>
                      <MenuItem value="Unpaid">Unpaid</MenuItem>

                    </Select>

                    <Select
                      fullWidth
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      sx={{ my: 2 }}
                      disabled={isCompleted || isCanceled}

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
