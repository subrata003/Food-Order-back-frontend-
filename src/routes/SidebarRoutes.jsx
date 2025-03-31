import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashbord from "../pages/Dashbord";
import AddFood from "../components/AddFood";
import ManuManagement from "../pages/ManuManagement";
import OrderList from "../pages/OrderList";


const SidebarRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashbord />} />
      <Route path="/manu" element={<ManuManagement />} />
      <Route path="/orders" element={<OrderList />} />

    </Routes>
  );
};

export default SidebarRoutes;
