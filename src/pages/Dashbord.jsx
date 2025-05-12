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

const Dashboard = () => {
  const { orderList } = useFood();
  const navigate = useNavigate();

  const [filterType, setFilterType] = useState("month");
  const [historyFilter, setHistoryFilter] = useState("Today");
  const [orders, setOrders] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const revenueData = {
    today: 3500,
    week: 12000,
    month: 25000,
  };

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
            <Typography variant="h6" color="green">₹ 1,25,000</Typography>
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

        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2 }}>
            <Typography variant="subtitle1">Profit</Typography>
            <Typography variant="h6" color="secondary">₹ 15,000</Typography>
          </Card>
        </Grid>

        {/* Order History */}
        <Grid item xs={12} md={6}>
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
