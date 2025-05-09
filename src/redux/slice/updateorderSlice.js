import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list:[],
};

const updateOrderSlice = createSlice({
  name: "updateorder",
  initialState,
  reducers: {
    setOrder: (state, action) => {
      state.list = action.payload;
      // localStorage.setItem("updateorder", JSON.stringify(action.payload));
    },
    clearOrder: (state) => {
      state.list = [];
      // localStorage.removeItem("updateorder");
    },
  },
});

export const { setOrder, clearOrder } = updateOrderSlice.actions;
export default updateOrderSlice.reducer;
