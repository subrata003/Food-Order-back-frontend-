import React, { createContext, useContext, useState, useEffect } from "react";
import { getAllFood, deleteFood } from "../apis/food/addFood"; // Import API functions
import { getUserProfile } from "../apis/user/user";
import { getAllOrder } from "../apis/order/order";

const FoodContext = createContext();

export const useFood = () => useContext(FoodContext);

export const FoodProvider = ({ children }) => {
  const [foodList, setFoodList] = useState([]);
  const[orderList,setOrderList]=useState([]);
  const [loading, setLoading] = useState(false);
     const [userData, setUserData] = useState(null);

  // Fetch food items on component mount
  useEffect(() => {
    // console.log("login  User data is ",orderList);

    fetchAllOrders();
    fetchProfile();
   fetchFoods();
 }, []);

  // Fetch all food items
  const fetchFoods = async () => {
    setLoading(true);
    try {
      const res = await getAllFood();
      // console.log("get al food is ",res);
      
      if (res.success===true) {
        setFoodList(res.data); // Update global food list
      }
    } catch (error) {
      console.error("Error fetching food data:", error);
    }
    setLoading(false);
  };

  // Delete a food item
  const removeFood = async (foodId) => {
    try {
      const res = await deleteFood(foodId);
      if (res.success) {
        setFoodList((prev) => prev.filter((item) => item._id !== foodId)); // Update list after deletion
      }
    } catch (error) {
      console.error("Error deleting food:", error);
    }
  };
 
    const fetchProfile = async () => {
      const data = await getUserProfile();
      // console.log("user daata is :",data.data);
      
      if (data.success) {
        setUserData(data.data);
      } else {
        console.log("Failed to fetch profile:", data.message);
      }
    };
    const fetchAllOrders=async()=>{
      const data = await getAllOrder();
      // console.log("orderdata is:",data.data);

      if (data.success) {
        setOrderList(data.data);
      } else {
        console.log("Failed to fetch orders:", data.message);
      }
    }

 

  

  return (
    <FoodContext.Provider value={{ foodList, removeFood,fetchFoods, loading,userData,fetchProfile ,orderList,fetchAllOrders}}>
      {children}
    </FoodContext.Provider>
  );
};
