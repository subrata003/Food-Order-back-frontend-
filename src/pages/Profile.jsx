import React from 'react'
import { useFood } from '../storeContext/ContextApi'
import { Avatar, Typography } from '@mui/material';
import {Box, Paper } from "@mui/material";

function Profile() {
 const {userData}=useFood();
  return (
   <Paper elevation={3} sx={{ padding: 2, display: "flex", alignItems: "center", maxWidth: 350 }}>
   <Avatar sx={{ bgcolor: "primary.main", marginRight: 2 }}>
       {userData.name.charAt(0).toUpperCase()}
   </Avatar>
   <Box>
       <Typography variant="h6" fontWeight="bold">
           {userData.name}
       </Typography>
       <Typography variant="body2" color="textSecondary">
           {userData.email}
       </Typography>
       <Typography variant="body2" color="textSecondary" sx={{ fontStyle: "italic" }}>
           {userData.role}
       </Typography>
   </Box>
</Paper>
  )
}

export default Profile
