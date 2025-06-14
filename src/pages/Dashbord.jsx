import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Outlet, useNavigate } from "react-router-dom";
import { compareDesc, isSameDay, isSameWeek, isSameMonth } from "date-fns";
import moment from "moment";
import Pai from "../components/Pai";
import { useFood } from "../storeContext/ContextApi";
import TableBarIcon from '@mui/icons-material/TableBar';
import dayjs from 'dayjs';
import { getAllTables } from "../apis/table/table";
const Dashboard = () => {
  const { orderList } = useFood();
  const navigate = useNavigate();

  const [filterType, setFilterType] = useState("month");
  const [historyFilter, setHistoryFilter] = useState("Today");
  const [orders, setOrders] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [getTables, setGetTables] = useState([])

  // console.log("total orders list is :", orderList);

  const totalListPrice = orderList.filter((item) => item.status === "Completed").reduce((acc, item) => {
    return acc + Number(item.totalAmount);
  }, 0);
  useEffect(() => {
    fetchTables();
  }, [])

  const fetchTables = async () => {
    const res = await getAllTables();
    console.log("all tables is :", res.tables);
    setGetTables(res.tables)

  }

  // console.log("deliverd order price is :", totalListPrice);



  const revenueData = {
    today: 0,
    week: 0,
    month: 0,
  };
  const now = dayjs();

  orderList
    .filter((item) => item.status === "Completed")
    .forEach((item) => {
      const createdAt = dayjs(item.createdAt);
      const amount = Number(item.totalAmount || 0);

      // Today
      if (createdAt.isSame(now, 'day')) {
        revenueData.today += amount;
      }

      // This week
      if (createdAt.isSame(now, 'week')) {
        revenueData.week += amount;
      }

      // This month
      if (createdAt.isSame(now, 'month')) {
        revenueData.month += amount;
      }
    });

  const filterLabels = {
    today: "Today",
    week: "This Week",
    month: "This Month",
  };

  const openMenu = Boolean(anchorEl);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleSelect = (type) => {
    setFilterType(type);
    handleMenuClose();
  };

  const newOrder = () => navigate("/sidebar/createorder");

  useEffect(() => {
    const sorted = [...orderList].sort((a, b) =>
      compareDesc(new Date(a.createdAt), new Date(b.createdAt))
    );
    setOrders(sorted);
  }, [orderList]);

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    const today = new Date();

    if (historyFilter === "Today") return isSameDay(orderDate, today);
    if (historyFilter === "This Week") return isSameWeek(orderDate, today);
    if (historyFilter === "This Month") return isSameMonth(orderDate, today);
    return true;
  });

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Dashboard</Typography>
        <Button variant="contained" color="success" onClick={newOrder}>
          Add New Order
        </Button>
      </Box>
      <Divider sx={{ mb: 3 }} />

      {/* Summary Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2 }}>
            <Typography variant="subtitle1">Total Revenue</Typography>
            <Typography variant="h6" color="green">{totalListPrice}</Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2 }}>
            <Typography variant="subtitle1">Total Orders</Typography>
            <Typography variant="h6" color="primary">{orderList.length}</Typography>
          </Card>
        </Grid>

        {/* Revenue Filter Card */}
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2, position: 'relative' }}>
            <Typography variant="subtitle1">
              {filterLabels[filterType]} Revenue
            </Typography>
            <Typography variant="h6" color="primary">
              ₹ {revenueData[filterType].toLocaleString()}
            </Typography>

            {/* More Icon */}
            <IconButton onClick={handleMenuOpen} sx={{ position: 'absolute', top: 8, right: 8 }}>
              <MoreVertIcon />
            </IconButton>

            {/* Filter Menu */}
            <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
              <MenuItem onClick={() => handleSelect("today")}>Today</MenuItem>
              <MenuItem onClick={() => handleSelect("week")}>This Week</MenuItem>
              <MenuItem onClick={() => handleSelect("month")}>This Month</MenuItem>
            </Menu>
          </Card>
        </Grid>

        {/* <Grid item xs={12} md={3}>
          <Card sx={{ p: 2 }}>
            <Typography variant="subtitle1">Profit</Typography>
            <Typography variant="h6" color="secondary">₹ 15,000</Typography>
          </Card>
        </Grid> */}

        {/* Order History */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>Tables</Typography>
            <Grid container spacing={2}>
              {getTables.map((table) => {
                const isFree = table.status === 'free';
                return (
                  <Grid item xs={6} sm={4} md={3} key={table._id}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: isFree ? '#e0f7e9' : '#fdecea',
                        color: isFree ? 'green' : 'red',
                        border: `2px solid ${isFree ? 'green' : 'red'}`,
                        transition: '0.3s',
                      }}
                    >
                      <TableBarIcon fontSize="large" />
                      <Typography variant="subtitle1">{table.tableNumber}</Typography>
                      <Typography variant="caption" sx={{ mt: 1 }}>
                        {isFree ? 'Free' : 'Reserved'}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Order History ({historyFilter})
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {["Today", "This Week", "This Month"].map((filter) => (
                <Button
                  key={filter}
                  variant={historyFilter === filter ? "contained" : "outlined"}
                  color="secondary"
                  onClick={() => setHistoryFilter(filter)}
                >
                  {filter}
                </Button>
              ))}
            </Box>

            <Box
              sx={{
                maxHeight: 400,
                overflowY: "auto",
                pr: 1,
                "&::-webkit-scrollbar": { width: "8px" },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#da1142",
                  borderRadius: "8px",
                },
              }}
            >
              {filteredOrders.map((order) => (
                <Card
                  key={order._id}
                  sx={{ mb: 2, boxShadow: 2, borderBottom: "2px solid #da1142" }}
                >
                  <CardContent>
                    <Typography variant="body1" fontWeight={600}>
                      {order.userName} - ₹{order.totalAmount}
                      <Chip
                        label={order.status}
                        variant="outlined"
                        color={
                          order.status === "Completed" ? "success" :
                            order.status === "Pending" ? "warning" :
                              order.status === "Processing" ? "info" :
                                order.status === "canceled" ? "error" : "default"
                        }
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {moment(order.createdAt).fromNow()} ({moment(order.createdAt).format("DD MMM YYYY")})
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>

          </Paper>


        </Grid>

        {/* Chart or Stats Panel */}
        <Grid item xs={12} md={6}>
          <Pai />
        </Grid>
      </Grid>

      <Outlet />
    </Box>
  );
};

export default Dashboard;
