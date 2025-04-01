import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Box, CssBaseline, Divider } from "@mui/material";
import AddFood from './components/AddFood'

import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashbord from './pages/Dashbord';
import { FoodProvider } from './storeContext/ContextApi';

function App() {


  return (
    <FoodProvider>
      <Box sx={{ display: "flex", height: "100vh" }}>
        <CssBaseline />

        {/* Sidebar - Fixed Width */}
        <Sidebar />


      </Box>
    </FoodProvider>
  )
}

export default App
