import axios from "axios";

const url = "http://localhost:8080";

// Function to get token from localStorage and set headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// User Login API function
export const userDetails = async (data) => {
  try {
    console.log("Sending login data:", data);

    const backendurl = `${url}/api/user/login`;

    // Sending login request
    const response = await axios.post(backendurl, data);

    console.log("Login response:", response);

    if (response.data.success) {
      // Store the token in localStorage
      localStorage.setItem("token", response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    return { success: false, message: "Login failed" };
  }
};

// Function to get user profile
export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${url}/api/user/profile`, {
      headers: getAuthHeaders(), // Send token for authentication
    });
    console.log("Profile response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error.response?.data || error.message);
    return { success: false, message: "Failed to fetch user profile" };
  }
};

//get all users

export const getAllUserProfile = async () => {
  try {
    const response = await axios.get(`${url}/api/user/allprofile`, {
      headers: getAuthHeaders(), // Send token for authentication
    });
    console.log("Profile response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error.response?.data || error.message);
    return { success: false, message: "Failed to fetch user profile" };
  }
};

// Logout function
export const logoutUser = (navigate) => {
  localStorage.removeItem("token"); // Remove token from localStorage
  navigate("/"); // Redirect user to login page
};
