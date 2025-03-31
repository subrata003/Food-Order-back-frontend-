import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Route, Routes, useNavigate } from "react-router-dom"
import Dashbord from '../pages/Dashbord';
import SidebarRoutes from '../routes/SidebarRoutes';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
const drawerWidth = 240;



const openedMixin = (theme) => ({
 width: drawerWidth,
 transition: theme.transitions.create('width', {
  easing: theme.transitions.easing.sharp,
  duration: theme.transitions.duration.enteringScreen,
 }),
 overflowX: 'hidden',
});

const closedMixin = (theme) => ({
 transition: theme.transitions.create('width', {
  easing: theme.transitions.easing.sharp,
  duration: theme.transitions.duration.leavingScreen,
 }),
 overflowX: 'hidden',
 width: `calc(${theme.spacing(7)} + 1px)`,
 [theme.breakpoints.up('sm')]: {
  width: `calc(${theme.spacing(8)} + 1px)`,
 },
});

const DrawerHeader = styled('div')(({ theme }) => ({
 display: 'flex',
 alignItems: 'center',
 justifyContent: 'flex-end',
 padding: theme.spacing(0, 1),
 // necessary for content to be below app bar
 ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
 shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
 zIndex: theme.zIndex.drawer + 1,
 transition: theme.transitions.create(['width', 'margin'], {
  easing: theme.transitions.easing.sharp,
  duration: theme.transitions.duration.leavingScreen,
 }),
 variants: [
  {
   props: ({ open }) => open,
   style: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
     easing: theme.transitions.easing.sharp,
     duration: theme.transitions.duration.enteringScreen,
    }),
   },
  },
 ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
 ({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  variants: [
   {
    props: ({ open }) => open,
    style: {
     ...openedMixin(theme),
     '& .MuiDrawer-paper': openedMixin(theme),
    },
   },
   {
    props: ({ open }) => !open,
    style: {
     ...closedMixin(theme),
     '& .MuiDrawer-paper': closedMixin(theme),
    },
   },
  ],
 }),
);



export default function Sideabr() {
 const theme = useTheme();
 const [open, setOpen] = React.useState(false);
 const navigate = useNavigate()


 const handleSidebar = (index) => {
  switch (index) {
   case 0:
    navigate("/")
    break;
   case 1:
    navigate("/manu")
    break;
   case 2:
    navigate("/orders")
    break;

   default:
    break;
  }

 }
 const handleDrawerOpen = () => {
  setOpen(true);
 };

 const handleDrawerClose = () => {
  setOpen(false);
 };

 return (
  <Box sx={{ display: 'flex' }}>
   <CssBaseline />
   <AppBar position="fixed" open={open}>
    <Toolbar>
     <IconButton
      color="inherit"
      aria-label="open drawer"
      onClick={handleDrawerOpen}
      edge="start"
      sx={[
       {
        marginRight: 5,
       },
       open && { display: 'none' },
      ]}
     >
      <MenuIcon />
     </IconButton>
     <Typography variant="h6" noWrap component="div">
     Admin Panel
     </Typography>
    </Toolbar>
   </AppBar>
   <Drawer variant="permanent" open={open}>
   
    <DrawerHeader>
    Hotel Gold
     <IconButton onClick={handleDrawerClose}>
      {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
     </IconButton>
    </DrawerHeader>
    <Divider />
    <List>
     {['Dashbord', 'Manu Management', 'Orders', 'My Profile'].map((text, index) => (
      <ListItem key={text} disablePadding sx={{ display: 'block' }} >
       <ListItemButton
        sx={[
         {
          minHeight: 48,
          px: 2.5,
         },
         open
          ? {
           justifyContent: 'initial',
          }
          : {
           justifyContent: 'center',
          },
        ]}
        onClick={()=>handleSidebar(index)}

       >
        <ListItemIcon
         sx={[
          {
           minWidth: 0,
           justifyContent: 'center',
          },
          open
           ? {
            mr: 3,
           }
           : {
            mr: 'auto',
           },
         ]}
        >
         {index === 0 ? <AssessmentOutlinedIcon/> : index === 1 ? <AppsOutlinedIcon /> :index==2? <AppRegistrationIcon/>:<AccountCircleOutlinedIcon />}

        </ListItemIcon>
        <ListItemText
         primary={text}
         sx={[
          open
           ? {
            opacity: 1,
           }
           : {
            opacity: 0,
           },
         ]}
        />
       </ListItemButton>
      </ListItem>
     ))}
    </List>
    
   
   </Drawer>
   <Box component="main" sx={{ flexGrow: 1, p: 3,width:"80vw" }} margin={3}>
    <DrawerHeader />
    <SidebarRoutes />

   </Box>
  </Box>
 );  
}
