import axios from "axios";
import { getAuthHeaders } from "../user/user";

const url = "http://localhost:8080";

export const addFood = async (food) => {

 const backendurl = `${url}/api/food/add`

 const asd = await axios.post(backendurl, food, {
  headers: {
   "Content-Type": "multipart/form-data",
  }
 },);

 return asd.data;

}

export const getAllFood = async () => {

 const backendurl = `${url}/api/food/getfood`

 const asd = await axios.get(backendurl, {
  headers:{
   ...getAuthHeaders(), 
   "Content-Type": "multipart/form-data",
  }
  
 },);
 // console.log("asd data is ", asd.data.data);
 

 return asd.data;

}

export const deleteFood = async (id) => {

 const backendurl = `${url}/api/food/deletefood/${id}`

 const asd = await axios.delete(backendurl, {
  headers: {
   "Content-Type": "multipart/form-data",
  }
 },);
 // console.log("asd data is ", asd.data.data);
 

 return asd.data;

}

export const updateFood = async (id,food) => {

 const backendurl = `${url}/api/food/updatefood/${id}`

 const asd = await axios.put(backendurl, food, {
  headers: {
   "Content-Type": "multipart/form-data",
  }
 },);

 return asd.data;

}