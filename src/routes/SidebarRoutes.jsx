import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashbord from "../pages/Dashbord";
import ManuManagement from "../pages/ManuManagement";
import OrderList from "../pages/OrderList";

const SidebarRoutes = () => {
  return (
    <Routes>
      {/* Use relative paths (no leading "/") */}
      <Route path="dashbord" element={<Dashbord />} />
      <Route path="manu" element={<ManuManagement />} />
      <Route path="orders" element={<OrderList />} />
    </Routes>
  );
};

export default SidebarRoutes;
