// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import notification from "./slice/notificationSlice"
import updateorder from "./slice/updateorderSlice"

export const store = configureStore({
  reducer: {
    notification: notification,
    updateorder:updateorder
  },
});
