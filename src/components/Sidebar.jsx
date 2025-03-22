import React from "react";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box } from "@mui/material";
import { NavLink } from "react-router-dom";
import AddCardIcon from "@mui/icons-material/AddCard";
import ListIcon from "@mui/icons-material/List";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const Sidebar = () => {
 return (
  <Drawer
   variant="permanent"
   sx={{
    width: 240,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
     width: 240,
     boxSizing: "border-box",
     backgroundColor: "#1e1e1e",
     color: "#fff",
    },
   }}
  >
   <NavLink to="/" style={{ textDecoration: "none", color: "inherit" }}>
    <Box sx={{ padding: "16px", textAlign: "center", fontSize: "1.2rem", fontWeight: "bold" }}>
     Admin Panel
    </Box>
   </NavLink>
   <List>
    {/* Add Items */}
    <NavLink to="/add" style={{ textDecoration: "none", color: "inherit" }}>
     <ListItemButton sx={{ "&:hover": { backgroundColor: "#333" } }}>
      <ListItemIcon>
       <AddCardIcon sx={{ color: "#fff" }} />
      </ListItemIcon>
      <ListItemText primary="Add Items" />
     </ListItemButton>
    </NavLink>

    {/* List Items */}
    <NavLink to="/list" style={{ textDecoration: "none", color: "inherit" }}>
     <ListItemButton sx={{ "&:hover": { backgroundColor: "#333" } }}>
      <ListItemIcon>
       <ListIcon sx={{ color: "#fff" }} />
      </ListItemIcon>
      <ListItemText primary="List Items" />
     </ListItemButton>
    </NavLink>

    {/* Orders */}
    <NavLink to="/order" style={{ textDecoration: "none", color: "inherit" }}>
     <ListItemButton sx={{ "&:hover": { backgroundColor: "#333" } }}>
      <ListItemIcon>
       <ShoppingCartIcon sx={{ color: "#fff" }} />
      </ListItemIcon>
      <ListItemText primary="Orders" />
     </ListItemButton>
    </NavLink>
   </List>
  </Drawer>
 );
};

export default Sidebar;
