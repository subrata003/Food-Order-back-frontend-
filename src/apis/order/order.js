import axios from "axios";
import { getAuthHeaders } from "../user/user";
// const url ="https://food-order-backend-production-84ea.up.railway.app"
const url ="http://localhost:8080";

export const getAllOrder = async () => {

 const backendurl = `${url}/api/food/order/get`

 const asd = await axios.get(backendurl, {
  headers:{
   ...getAuthHeaders(), 
   "Content-Type": "multipart/form-data",
  }
  
 },);
 // console.log("asd data is ", asd.data);
 

 return asd.data;

}

export const orderUpdate = async (id,food) => {
 console.log("api food id is :",id,food);
 

 const backendurl = `${url}/api/food/order/update/${id}`

 const asd = await axios.put(backendurl,food);

 return asd.data;

}