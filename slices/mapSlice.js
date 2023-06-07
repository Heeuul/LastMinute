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
    UpdateDestination: (state, action) => {
      if (action.payload.id > state.destinations.length)
        console.warn(
          `Cannot update destination for (id:${action.payload.id}) as it does not exist`
        );
      else state.destinations[action.payload.id] = action.payload;
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
    SetTravelTime: (state, action) => {
      state.travelTime = action.payload;
    },
  },
});

// Selectors
export const SelectOrigin = (state) => state.map.origin;
export const SelectDestinations = (state) => state.map.destinations;
export const SelectTravelTime = (state) => state.map.travelTime;
export const {
  SetOrigin,
  AddDestination,
  UpdateDestination,
  RemoveDestination,
  SetTravelTime,
} = mapSlice.actions;
export default mapSlice.reducer;
