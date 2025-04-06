// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import notification from "./slice/notificationSlice"

export const store = configureStore({
  reducer: {
    notification: notification,
  },
});
