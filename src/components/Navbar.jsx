import React from "react";
import { AppBar, Toolbar, Typography, Avatar, Box } from "@mui/material";

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "purple", padding: "8px 16px" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Left Side (Title) */}
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Hotel Memo
          </Typography>
          <Typography variant="subtitle2">Admin Panel</Typography>
        </Box>

        {/* Right Side (Profile Image) */}
        <Avatar
          alt="Admin"
          src="https://cdn.pixabay.com/photo/2016/03/12/21/05/boy-1252771_640.jpg"
          sx={{ width: 48, height: 48 }}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
