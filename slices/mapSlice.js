import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  origin: null,
  destinations: [],
  travelTimes: [],
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
    AddTravelTime: (state, action) => {
      state.travelTimes = [...state.travelTimes, action.payload];
    },
    UpdateTravelTime: (state, action) => {
      if (action.payload.id > state.travelTimes.length)
        console.warn(
          `Cannot update travelTime for (id:${action.payload.id}) as it does not exist`
        );
      else state.travelTimes[action.payload.id] = action.payload;
    },
    RemoveTravelTime: (state, action) => {
      const id = state.travelTimes.findIndex(
        (duration) => duration.id === action.payload.id
      );
      let newDurations = [...state.travelTimes];

      if (id >= 0) newDurations.splice(id, 1);
      else
        console.warn(
          `Cannot remove destination (id:${action.payload.id}) as it is not in list`
        );

      state.travelTimes = newDurations;
    },
  },
});

// Selectors
export const SelectOrigin = (state) => state.map.origin;
export const SelectDestinations = (state) => state.map.destinations;
export const SelectTravelTimes = (state) => state.map.travelTimes;
export const {
  SetOrigin,
  AddDestination,
  UpdateDestination,
  RemoveDestination,
  AddTravelTime,
  UpdateTravelTime,
  RemoveTravelTime,
} = mapSlice.actions;
export default mapSlice.reducer;
