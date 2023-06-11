import React, { useRef, useMemo, useCallback, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Fontisto, Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import {
  AddDestination,
  RemoveDestination,
  SelectDestinations,
  SelectOrigin,
  SetOrigin,
  UpdateDestination,
} from "../slices/mapSlice";
import { GMapTextInput } from "./GMapTextInput";
import { Settings } from "../settings";

export default function Inputs() {
  const origin = useSelector(SelectOrigin);
  const destinations = useSelector(SelectDestinations);
  const dispatch = useDispatch();

  const singleSnapPercent = 8;
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => [singleSnapPercent * 1.25 + "%", "50%"], []);
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  function AddInput() {
    dispatch(AddDestination({ id: destinations.length }));
  }
  function RemoveInput() {
    dispatch(RemoveDestination({ id: destinations.length - 1 }));
  }

  function GetDestinationInputRender(item) {
    return (
      <>
        <Text className="text-right text-gray-500">1 Hours and 30 minutes</Text>
        <View className="flex-row">
          <View
            style={{ paddingRight: 10 }}
            className="items-center justify-center"
          >
            <Fontisto
              name="map-marker"
              size={35}
              color={"black"}
              style={{ justifyContent: "center", alignItems: "center" }}
            />
            <Fontisto
              name="map-marker-alt"
              size={25}
              color={item.id !== null && Settings.colors[item.id]}
              style={{
                position: "absolute",
                left: 4,
              }}
            />
          </View>
          <GMapTextInput
            placeholderText="Enter your destination"
            initialAddress={item.description}
            OnPressCall={(data, details) =>
              OnUpdateDestination(item.id, data, details)
            }
            styles={{
              textInput: {
                backgroundColor: "#eee",
              },
            }}
          />
        </View>
      </>
    );
  }

  function OnSetOrigin(data, details) {
    dispatch(
      SetOrigin({
        name: data.structured_formatting.main_text,
        address: data.structured_formatting.secondary_text,
        description: data.description,
        coordinate: {
          latitude: details.geometry.location.lat,
          longitude: details.geometry.location.lng,
        },
      })
    );
  }
  function OnUpdateDestination(id, data = null, details = null) {
    dispatch(
      UpdateDestination({
        id: id,
        name: data ? data.structured_formatting.main_text : null,
        address: data ? data.structured_formatting.secondary_text : null,
        description: data ? data.description : null,
        coordinate: details
          ? {
              latitude: details?.geometry.location.lat,
              longitude: details?.geometry.location.lng,
            }
          : null,
      })
    );
  }

  const [inputRefs, SetInputRefs] = useState([]);
  function ClearDestinations() {
    inputRefs.current.map((inputRef) => inputRef.ClearInput());
    destinations.map((destination, i) => OnUpdateDestination(i));
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
    >
      {/* Origin */}
      <View className="flex-row items-center w-full mx-2 pr-3">
        <Fontisto
          name="map-marker-alt"
          size={35}
          color={"black"}
          style={{ paddingRight: 10 }}
        />
        <GMapTextInput
          placeholderText="Enter your starting point"
          initialAddress={origin.description}
          OnPressCall={OnSetOrigin}
          styles={{
            textInput: {
              backgroundColor: "#eee",
            },
          }}
        />
      </View>

      {/* Separator */}
      <View className="w-full self-center border-t-gray-200 border-t-2 pb-2" />

      {/* Destination Inputs */}
      <BottomSheetFlatList
        data={destinations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          width: "100%",
          marginHorizontal: 10,
          paddingRight: 15,
        }}
        renderItem={({ item }) => GetDestinationInputRender(item)}
      />

      {/* Buttons */}
      <View className="flex-row w-full items-end justify-between pb-1 pl-2">
        <View className="flex-row">
          <TouchableOpacity
            onPress={AddInput}
            disabled={destinations.length === Settings.destinations.max}
          >
            <Ionicons
              name="add-circle"
              size={45}
              color={
                destinations.length === Settings.destinations.max
                  ? "#d1d5db"
                  : "black"
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={RemoveInput}
            disabled={destinations.length === Settings.destinations.min}
          >
            <Ionicons
              name="remove-circle"
              size={45}
              color={
                destinations.length === Settings.destinations.min
                  ? "#d1d5db"
                  : "black"
              }
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity className="h-1/2 w-1/2 justify-center items-center">
          <Text className="text-xl font-light text-black">
            Clear Destinations
          </Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}
