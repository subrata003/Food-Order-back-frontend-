import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const Dashbord= () => {
  const navigate=useNavigate()
  const newOrder=()=>{
    navigate("/sidebar/createorder")

  }
 return (
      <>
        <Button onClick={newOrder}>Add New Order</Button>
        <Outlet />

        </>
    );
};

export default Dashbord
