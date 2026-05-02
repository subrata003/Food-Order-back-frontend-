import './App.css'
import { Box, CssBaseline, Divider } from "@mui/material";
import Sidebar from './components/Sidebar'
import { FoodProvider } from './storeContext/ContextApi';
import { Routes, Route } from "react-router-dom";
// import LogIn from './pages/LogIn';
// import SidebarRoutes from './routes/SidebarRoutes';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import CreateNewOrder from './components/CreateNewOrder';
import Dashbord from "./pages/Dashbord";
import ManuManagement from "./pages/ManuManagement";
import OrderList from "./pages/OrderList";
import Profile from "./pages/Profile";
// import CreateNewOrder from "../components/CreateNewOrder";
import LogIn from './pages/LogIn';
// import Dashbord from "./pages/Dashbord"

function App() {


  return (
    <Provider store={store}>
      <FoodProvider>
        <Box sx={{ display: "flex", height: "100vh" }}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LogIn />} />
            <Route path="/sidebar" element={<Sidebar />}>
              {/* <Route path="*" element={<SidebarRoutes />} /> ✅ Fix route */}
              <Route path="dashbord" element={<Dashbord />} />
              <Route path="createorder" element={<CreateNewOrder />} />
              <Route path="manu" element={<ManuManagement />} />
              <Route path="orders" element={<OrderList />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>

        </Box>
      </FoodProvider>
    </Provider>
  )
}

export default App
