import React, { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import AppsOutlinedIcon from "@mui/icons-material/AppsOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { useNavigate } from "react-router-dom";
import SidebarRoutes from "../routes/SidebarRoutes";
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';

import LogoutIcon from '@mui/icons-material/Logout';
import { Avatar, Button, Modal, Paper } from "@mui/material";
import { useFood } from "../storeContext/ContextApi";
import Profile from "../pages/Profile";
import Notification from "./Notification";


const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({

  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open ? { ...openedMixin(theme), "& .MuiDrawer-paper": openedMixin(theme) } : { ...closedMixin(theme), "& .MuiDrawer-paper": closedMixin(theme) }),
}));

export default function Sidebar() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [openModal, setOpenModal] = useState(false)
  const navigate = useNavigate();
  const { userData } = useFood();
  // console.log("userdata is si sis :",userData);


  const handleSidebar = (index) => {
    switch (index) {
      case 0:
        navigate("/sidebar/dashbord"); // Fix path
        break;
      case 1:
        navigate("/sidebar/manu");
        break;
      case 2:
        navigate("/sidebar/orders");
        break;
      case 3:
        setOpenModal(true);
        break;
      default:
        break;
    }
  };
  const logout = () => {
    localStorage.removeItem("token");

    navigate("/");
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ backgroundColor: "#a7062d" }}>
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} edge="start" sx={{ marginRight: 5, ...(open && { display: "none" }) }}>
            <MenuIcon />
          </IconButton>
          <Typography sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
            <Typography variant="h5" noWrap component="div">
              Admin Panel
            </Typography>
            <Typography sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "30px" }}>
              <Typography sx={{ cursor: "pointer" }}> <Notification /></Typography>

              <Typography onClick={logout} sx={{ cursor: "pointer" }}> <LogoutIcon /></Typography>
            </Typography>
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
           <Typography variant="h5">Hotel Gold</Typography> 
          <IconButton onClick={handleDrawerClose}>{theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}</IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {["Dashbord", "Manu Management", "Orders", "My Profile"].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              <ListItemButton sx={{ minHeight: 48, justifyContent: open ? "initial" : "center", px: 2.5 }} onClick={() => handleSidebar(index)}>
                <ListItemIcon sx={{ minWidth: 0, justifyContent: "center", mr: open ? 3 : "auto" }}>
                  {index === 0 ? <AssessmentOutlinedIcon /> : index === 1 ? <AppsOutlinedIcon /> : index === 2 ? <AppRegistrationIcon /> : <AccountCircleOutlinedIcon />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: "80vw" }} margin={3}>
        <DrawerHeader />
        <SidebarRoutes /> {/* ✅ Renders nested routes correctly */}
      </Box>
      <Profile openModal={openModal} setOpenModal={setOpenModal} />
    </Box>
  );
}
