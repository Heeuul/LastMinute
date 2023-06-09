import React, { useRef, useMemo, useCallback } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { Fontisto } from "@expo/vector-icons";
import { View, Text, Dimensions } from "react-native";
import { useSelector } from "react-redux";

import { SelectDestinations, SelectOrigin } from "../slices/mapSlice";
import { GMapTextInput } from "./GMapTextInput";

/*
TODO - MapScreen Inputs: 
* [<Black Marker> <        Origin Input        >] //TODO - Automatically pull up to only show origin when blur 
? [<Color Marker> <Destination Input> <Duration>] 
? [<Color Marker> <Destination Input> <Duration>] 
? [<Color Marker> <Destination Input> <Duration>] //! <--- Bottom Sheets over the map 
? [<Color Marker> <Destination Input> <Duration>] 
* [+][-]______________________________________[^] //TODO - Add/Reduce Input field & pull up buttons 
  |                                             | 
  |                     map                     | //! <--- Normal/SafeArea View, allow keyboard overlaps 
  |_____________________________________________| 
*/

export default function Inputs() {
  const inputHeight = Dimensions.get("window").height * 0.1;

  const origin = useSelector(SelectOrigin);
  const destinations = useSelector(SelectDestinations);

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(
    () => [inputHeight, (destinations.length + 1) * inputHeight],
    []
  );

  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
    >
      <View className="flex-1">
        {/* Origin */}
        <View className="flex-row items-center mx-2">
          <Fontisto
            name="map-marker-alt"
            size={34}
            color={"black"}
            style={{ paddingRight: 10 }}
          />
          <GMapTextInput
            placeholderText="Enter your starting point"
            initialAddress={origin.description}
            styles={{
              container: {
                backgroundColor: "#eee",
              },
              textInput: {
                backgroundColor: "#eee",
              },
            }}
          />
        </View>

        {/* Destination */}
        <View></View>

        {/* Buttons */}
        <View></View>
      </View>
    </BottomSheet>
  );
}
