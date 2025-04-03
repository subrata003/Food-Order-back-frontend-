import axios from "axios";

const url = "http://localhost:8080";

export const userDetails = async (data) => {
 console.log("data is ",data);
 

 const backendurl = `${url}/api/user/login`

 const asd = await axios.post(backendurl, data);
 console.log("asd data is ",asd);
 

 return asd.data;

}