import axios from "axios";
const url ="https://food-order-backend-production-84ea.up.railway.app"
// const url ="http://localhost:8080";

export const addTable = async (table) => {
 console.log("table is ",table);
 

 const backendurl = `${url}/api/table/createtable`

 const asd = await axios.post(backendurl, table);

 return asd.data;

}

export const getAllTables = async () => {

 const backendurl = `${url}/api/table/gettables`

 const asd = await axios.get(backendurl);
 // console.log("table data is ", asd.data);
 

 return asd.data;

}

export const updateTableStatus = async (id,table) => {

 const backendurl = `${url}/api/food/updatefood/${id}`

 const asd = await axios.put(backendurl, food, {
  headers: {
   "Content-Type": "multipart/form-data",
  }
 },);

 return asd.data;

}

