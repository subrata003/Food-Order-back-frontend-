import './App.css'
import { Box, CssBaseline, Divider } from "@mui/material";
import Sidebar from './components/Sidebar'
import { FoodProvider } from './storeContext/ContextApi';
import { Routes, Route } from "react-router-dom";
import LogIn from './pages/LogIn';
import SidebarRoutes from './routes/SidebarRoutes';
// import LogIn from './pages/LogIn';

function App() {


  return (
    <FoodProvider>
      <Box sx={{ display: "flex", height: "100vh" }}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="/sidebar" element={<Sidebar />}>
            <Route path="*" element={<SidebarRoutes />} /> {/* ✅ Fix route */}
          </Route>
        </Routes>

      </Box>
    </FoodProvider>
  )
}

export default App
