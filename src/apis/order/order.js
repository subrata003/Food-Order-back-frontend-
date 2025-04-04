import axios from "axios";
import { getAuthHeaders } from "../user/user";
const url = "http://localhost:8080";

export const getAllOrder = async () => {

 const backendurl = `${url}/api/food/order/get`

 const asd = await axios.get(backendurl, {
  headers:{
   ...getAuthHeaders(), 
   "Content-Type": "multipart/form-data",
  }
  
 },);
 console.log("asd data is ", asd.data);
 

 return asd.data;

}