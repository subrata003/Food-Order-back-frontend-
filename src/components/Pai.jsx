import React, { useState, useEffect } from 'react';
import { PieChart } from '@mui/x-charts';
import { useFood } from '../storeContext/ContextApi';
import { compareDesc, isToday, isThisWeek, isThisMonth, parseISO } from 'date-fns';
import { Box, Button, ButtonGroup, Typography } from '@mui/material';

function Pai() {
 const { orderList } = useFood();
 const [orders, setOrders] = useState([]);
 const [filterType, setFilterType] = useState("today");

 useEffect(() => {
  const sortedOrders = [...orderList].sort((a, b) =>
   compareDesc(new Date(a.createdAt), new Date(b.createdAt))
  );
  setOrders(sortedOrders);
 }, [orderList]);

 const filteredByDate = orders.filter(order => {
  const date = parseISO(order.createdAt);
  if (filterType === "today") return isToday(date);
  if (filterType === "week") return isThisWeek(date, { weekStartsOn: 1 });
  if (filterType === "month") return isThisMonth(date);
  return true;
 });

 // Count by status
 const statusCount = filteredByDate.reduce((acc, order) => {
  const status = order.status || "Unknown";
  acc[status] = (acc[status] || 0) + 1;
  return acc;
 }, {});

 // Define color mapping
 const statusColorMap = {
  Completed: '#4CAF50', // Green
  canceled: 'red', // Red
  Pending: '#FF9800',   // Orange
  Processing: '#2196F3', // Blue
  Unknown: '#9E9E9E',   // Grey fallback
 };

 const chartData = Object.entries(statusCount).map(([status, count], index) => ({
  id: index,
  value: count,
  label: status,
  color: statusColorMap[status] || '#9E9E9E', // fallback color
 }));

 const filterLabels = {
  today: "Today",
  week: "This Week",
  month: "This Month",
 };

 return (
  <Box
   display="flex"
   flexDirection="column"
   alignItems="center"
   justifyContent="center"
   sx={{ minHeight: '70vh', padding: 2 }}
  >
   <Typography variant="h5" mb={2}>
    Order Status - {filterLabels[filterType]}
   </Typography>

   <ButtonGroup variant="contained" sx={{ mb: 4 }}>
    <Button onClick={() => setFilterType("today")}>Today</Button>
    <Button onClick={() => setFilterType("week")}>This Week</Button>
    <Button onClick={() => setFilterType("month")}>This Month</Button>
   </ButtonGroup>

   <PieChart
    series={[{ data: chartData }]}
    width={400}
    height={300}
   />
  </Box>
 );
}

export default Pai;
