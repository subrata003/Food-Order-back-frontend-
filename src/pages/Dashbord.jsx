import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useFood } from "../storeContext/ContextApi";


const socket = io("http://localhost:8080"); // Backend URL

const Dashbord= () => {
    const [notifications, setNotifications] = useState([]);
    const [blink, setBlink] = useState(false);
    // const {userData}=useFood();
    // console.log("this is login details :",userData);
    
 
    

    useEffect(() => {
        // Fetch existing notifications
        const fetchNotifications = async () => {
            const { data } = await axios.get("http://localhost:8080/notifications");
            setNotifications(data);
        };

        fetchNotifications();

        // Listen for new orders
        socket.on("receiveNotification", (notification) => {
            setNotifications((prev) => [notification, ...prev]);
            setBlink(true); // Start blinking
            setTimeout(() => setBlink(false), 10000); // Stop blinking after 3s
        });

        return () => {
            socket.off("receiveNotification");
        };
    }, []);

    // // Mark all notifications as read
    const markAsRead = async () => {
        await axios.put("http://localhost:8080/notifications/read");
        setNotifications([]);
    };
    ///user profile
    
    return (
      <>
        <div>
            <h3>📢 Admin Notifications</h3>
            <button 
                style={{ backgroundColor: blink ? "red" : "gray" }} 
                onClick={markAsRead}
            >
                🔔 {notifications.length} New Orders
            </button>
            
            {notifications.length === 0 ? (
                <p>No new orders</p>
            ) : (
                notifications.map((notif, index) => (
                    <div key={index} style={{ padding: "5px", borderBottom: "1px solid lightgray" }}>
                        {notif.message} <br />
                        <small>{new Date(notif.createdAt).toLocaleString()}</small>
                    </div>
                ))
            )}
        </div>


        </>
    );
};

export default Dashbord
