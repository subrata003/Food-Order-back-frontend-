import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashbord from "../pages/Dashbord";
import ManuManagement from "../pages/ManuManagement";
import OrderList from "../pages/OrderList";
import Profile from "../pages/Profile";
import CreateNewOrder from "../components/CreateNewOrder";

const SidebarRoutes = () => {
  return (
    <Routes>
      {/* Use relative paths (no leading "/") */}
      <Route path="dashbord" element={<Dashbord />}/>
      <Route path="createorder" element={<CreateNewOrder/>}/>
      <Route path="manu" element={<ManuManagement />} />
      <Route path="orders" element={<OrderList />} />
      


      {/* <Route path="profile" element={<Profile/>} /> */}

    </Routes>
  );
};

export default SidebarRoutes;
