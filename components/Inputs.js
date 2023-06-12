import React, {
  useRef,
  useMemo,
  useCallback,
  useState,
  useLayoutEffect,
} from "react";
import { View, Text, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Fontisto, Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import {
  SetOrigin,
  AddDestination,
  UpdateDestination,
  RemoveDestination,
  AddTravelTime,
  UpdateTravelTime,
  RemoveTravelTime,
  SelectOrigin,
  SelectDestinations,
  SelectTravelTimes,
} from "../slices/mapSlice";
import { GMapTextInput } from "./GMapTextInput";
import { Settings } from "../settings";

export default function Inputs() {
  const origin = useSelector(SelectOrigin);
  const destinations = useSelector(SelectDestinations);
  const travelTimes = useSelector(SelectTravelTimes);
  const dispatch = useDispatch();

  const singleSnapPercent = 8;
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => [singleSnapPercent * 1.25 + "%", "50%"], []);
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  function AddInput() {
    dispatch(AddDestination({ id: destinations.length }));
    dispatch(AddTravelTime({ id: travelTimes.length }));
  }
  function RemoveInput() {
    dispatch(RemoveDestination({ id: destinations.length - 1 }));
    dispatch(RemoveTravelTime({ id: travelTimes.length - 1 }));
  }

  function GetDestinationInputRender(item) {
    return (
      <>
        <Text className="text-right text-gray-500">
          {travelTimes[item.id]?.duration
            ? (travelTimes[item.id].duration > 60
                ? Math.floor(travelTimes[item.id].duration / 60) + " hours "
                : " ") +
              (Math.round(travelTimes[item.id].duration % 60) + " minutes")
            : ""}
        </Text>
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
            ref={(el) => (destinationInputRefs.current[item.id] = el)}
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
  function OnClearDestinationInputs() {
    destinationInputRefs.current.map((inputRef) => inputRef.ClearInput());
    destinations.map((destinations, i) => {
      OnUpdateDestination(i);
      dispatch(UpdateTravelTime({ id: i }));
    });
  }

  const [renderList, SetRenderList] = useState(false);
  const destinationInputRefs = useRef([]);
  useLayoutEffect(() => {
    // Update refs for destination inputs
    destinationInputRefs.current = destinationInputRefs.current.slice(
      0,
      destinations.length
    );

    // Rerender destination inputs Flatlist
    SetRenderList(!renderList);
  }, [destinations]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
    >
      {/* Origin */}
      <View className="flex-row items-center w-full pr-1 border-b-gray-300 border-b-2">
        <Fontisto
          name="map-marker-alt"
          size={35}
          color={"black"}
          style={{ paddingHorizontal: 10 }}
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
        extraData={renderList}
      />

      {/* Buttons */}
      <View className="flex-row w-full items-center justify-between pb-1 px-2 border-t-gray-300 border-t-2">
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

        <TouchableOpacity
          className="rounded-3xl border-gray-700 border-solid border"
          onPress={OnClearDestinationInputs}
        >
          <Text className="text-base font-base text-gray-700 p-2">
            Clear Destinations
          </Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}
