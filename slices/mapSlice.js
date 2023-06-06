import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  origin: null,
  destinations: [],
  travelTime: null,
};

export const mapSlice = createSlice({
  name: "map",
  initialState: initialState,
  reducers: {
    SetOrigin: (state, action) => {
      state.origin = action.payload;
    },
    AddDestination: (state, action) => {
      state.destinations = [...state.destinations, action.payload];
    },
    RemoveDestination: (state, action) => {
      const id = state.destinations.findIndex(
        (dest) => dest.id === action.payload.id
      );
      let newDests = [...state.destinations];

      if (id >= 0) newDests.splice(id, 1);
      else
        console.warn(
          `Cannot remove destination (id:${action.payload.id}) as it is not in list`
        );

      state.destinations = newDests;
    },
    SetDestinations: (state, action) => {
      state.destinations = action.payload;

      console.log("Received: " + JSON.stringify(action.payload, null, 2));
      console.log(JSON.stringify(state.destinations, null, 2));
    },
    SetTravelTime: (state, action) => {
      state.travelTime = action.payload;
    },
  },
});

// Selectors
export const SelectOrigin = (state) => state.map.origin;
export const SelectDestinations = (state) => state.map.destinations;
export const SelectTravelTime = (state) => state.map.travelTime;
export const { SetOrigin, AddDestination, RemoveDestination, SetTravelTime } =
  mapSlice.actions;
export default mapSlice.reducer;
