import React, { createContext, useContext, useState, useEffect } from "react";
import { getAllFood, deleteFood } from "../apis/food/addFood"; // Import API functions

const FoodContext = createContext();

export const useFood = () => useContext(FoodContext);

export const FoodProvider = ({ children }) => {
  const [foodList, setFoodList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch food items on component mount
  useEffect(() => {
   fetchFoods();
 },[]);

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

  

  return (
    <FoodContext.Provider value={{ foodList, removeFood,fetchFoods, loading }}>
      {children}
    </FoodContext.Provider>
  );
};
