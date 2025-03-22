import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Box, CssBaseline, Divider } from "@mui/material";
import AddFood from './pages/AddFood'
import { Route, Routes } from "react-router-dom"
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

function App() {


  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline /> {/* Ensures consistent styles */}

      {/* Sidebar - Fixed Width */}
      <Sidebar />

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Navbar at the top */}
        <Navbar />
        <Divider /> {/* Thin line below navbar */}

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, padding: 3 }}>
          <Routes>
            <Route path="/add" element={<AddFood />} />
            <Route path="/list" element={<h1>List Page</h1>} />
            <Route path="/order" element={<h1>Orders Page</h1>} />
          </Routes>
        </Box>
      </Box>
    </Box>
  )
}

export default App
