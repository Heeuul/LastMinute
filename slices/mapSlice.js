import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  origin: null,
  destination: null,
  travelTime: null,
};

export const mapSlice = createSlice({
  name: "map",
  initialState: initialState,
  reducers: {
    SetOrigin: (state, action) => {
      state.origin = action.payload;
    },
    SetDestination: (state, action) => {
      state.destination = action.payload;
    },
    SetTravelTime: (state, action) => {
      state.travelTime = action.payload;
    },
  },
});

// Selectors
export const SelectOrigin = (state) => state.map.origin;
export const SelectDestination = (state) => state.map.destination;
export const SelectTravelTime = (state) => state.map.travelTime;
export const { SetOrigin, SetDestination, SetTravelTime } = mapSlice.actions;
export default mapSlice.reducer;
