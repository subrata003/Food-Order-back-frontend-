import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Pai from "../components/Pai";
import { useFood } from "../storeContext/ContextApi";
import {
  compareDesc,
  isSameDay,
  isSameMonth,
  isSameWeek,
} from "date-fns";
import moment from "moment";

const Dashboard = () => {
  const { orderList } = useFood();
  const [mainTab, setMainTab] = useState("Orders");
  const [historyFilter, setHistoryFilter] = useState("Today");
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const sortedOrders = [...orderList].sort((a, b) =>
      compareDesc(new Date(a.createdAt), new Date(b.createdAt))
    );
    setOrders(sortedOrders);
  }, [orderList]);

  const newOrder = () => navigate("/sidebar/createorder");

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

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" mb={3}>
        Dashboard
      </Typography>

      <Button
        sx={{ mb: 3 }}
        variant="contained"
        color="success"
        onClick={newOrder}
      >
        Add New Order
      </Button>

      {/* Main Tabs */}
      <Tabs
        value={mainTab}
        onChange={(e, newValue) => setMainTab(newValue)}
        sx={{ mb: 4 }}
        indicatorColor="secondary"
        textColor="inherit"
        centered
      >
        <Tab label="Orders" value="Orders" />
        <Tab label="Statistics" value="Stats" />
        <Tab label="Revenue" value="Revenue" />
      </Tabs>

      {/* Orders Section */}
      {mainTab === "Orders" && (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Paper elevation={3} sx={{ flex: 1, padding: 2 }}>
            <Typography
              variant="h6"
              fontWeight={600}
              textAlign="center"
              mb={2}
            >
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
                <Card
                  key={order._id}
                  sx={{
                    mb: 2,
                    boxShadow: 2,
                    borderBottom: "2px solid #da1142",
                  }}
                >
                  <CardContent>
                    <Typography variant="body1" fontWeight={600}>
                      {order.userName} - ₹{order.totalAmount}
                      <Chip
                        label={order.status}
                        variant="outlined"
                        color={
                          order.status === "Completed"
                            ? "success"
                            : order.status === "Pending"
                            ? "warning"
                            : order.status === "Processing"
                            ? "info"
                            : order.status === "canceled"
                            ? "error"
                            : "default"
                        }
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {`${moment(order.createdAt).fromNow()} (${moment(
                        order.createdAt
                      ).format("DD MMM YYYY")})`}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
            <Outlet />
          </Paper>

          <Paper elevation={3} sx={{ flex: 1, padding: 2 }}>
            <Typography variant="h6" mb={2}>
              Order Stats
            </Typography>
            <Pai />
          </Paper>
        </Box>
      )}

      {/* Statistics Section */}
      {mainTab === "Stats" && (
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h6">📊 Statistics</Typography>
          <Typography>
            Coming soon: charts for popular items, orders trend, etc.
          </Typography>
        </Paper>
      )}

      {/* Revenue Section with Grid */}
      {mainTab === "Revenue" && (
        <Box>
          <Typography variant="h5" mb={3}>
            💰 Revenue Dashboard
          </Typography>
          <Grid container spacing={3}>
            {/* Total Revenue */}
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2 }}>
                <Typography variant="subtitle1">Total Revenue</Typography>
                <Typography variant="h6" color="green">₹ 1,25,000</Typography>
              </Card>
            </Grid>

            {/* This Month Revenue */}
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2 }}>
                <Typography variant="subtitle1">Revenue This Month</Typography>
                <Typography variant="h6" color="primary">₹ 25,000</Typography>
              </Card>
            </Grid>

            {/* Profit */}
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 2 }}>
                <Typography variant="subtitle1">Profit</Typography>
                <Typography variant="h6" color="secondary">₹ 15,000</Typography>
              </Card>
            </Grid>

            {/* Top Selling Items */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2 }}>
                <Typography variant="subtitle1" mb={1}>
                  Top Selling Items
                </Typography>
                <ul>
                  <li>Pizza - ₹10,000</li>
                  <li>Burger - ₹7,000</li>
                  <li>Fries - ₹5,000</li>
                </ul>
              </Card>
            </Grid>

            {/* Chart Placeholder */}
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 2 }}>
                <Typography variant="subtitle1" mb={1}>
                  Revenue Chart
                </Typography>
                <Box
                  sx={{
                    height: 200,
                    backgroundColor: "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 2,
                  }}
                >
                  📈 Chart Coming Soon
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
