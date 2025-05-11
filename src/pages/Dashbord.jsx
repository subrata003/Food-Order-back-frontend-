import { Box, Button, Card, CardContent, Chip, Paper, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Pai from "../components/Pai";
import { useFood } from "../storeContext/ContextApi";
import { compareDesc, isSameDay, isSameMonth, isSameWeek } from "date-fns";
import moment from "moment";

const Dashbord = () => {
  const { orderList, fetchAllOrders } = useFood();
  const [historyFilter, setHistoryFilter] = useState("Today");

  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const sortedOrders = [...orderList].sort((a, b) =>
      compareDesc(new Date(a.createdAt), new Date(b.createdAt))
    );
    setOrders(sortedOrders);
  }, [orderList]);
  const navigate = useNavigate()
  const newOrder = () => {
    navigate("/sidebar/createorder")

  }

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
    <>
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

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Paper elevation={3} sx={{ flex: 1, padding: 2 }}>
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
            <Outlet />
          </Paper>

          <Paper elevation={3} sx={{ flex: 1, padding: 2 }}>
            <Typography variant="h6" mb={2}>
              Order Stats
            </Typography>
            <Pai />
          </Paper>
        </Box>
      </Box>

    </>
  );
};

export default Dashbord
