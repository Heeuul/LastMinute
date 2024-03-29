import React, { useLayoutEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { GMapTextInput } from "../components/GMapTextInput";
import { useDispatch, useSelector } from "react-redux";
import {
  SetOrigin,
  AddDestination,
  UpdateDestination,
  RemoveDestination,
  AddTravelTime,
  RemoveTravelTime,
  SelectOrigin,
  SelectDestinations,
  SelectTravelTimes,
} from "../slices/mapSlice";
import { Settings } from "../settings";

export default function HomeScreen({ navigation }) {
  const origin = useSelector(SelectOrigin);
  const destinations = useSelector(SelectDestinations);
  const travelTimes = useSelector(SelectTravelTimes);
  const dispatch = useDispatch();

  const [destinationInputs, SetDestinationInputs] = useState([]);
  const inputRefs = useRef([]);

  useLayoutEffect(() => {
    if (Settings.destinations.min > Settings.destinations.max) {
      console.error(
        "MINDESTINATIONS[line 17] cannot be higher than MAXDESTINATIONS[line 18]!"
      );
      return;
    }

    inputRefs.current = inputRefs.current.slice(0, destinationInputs.length);
    if (destinations.length < Settings.destinations.min) AddInput();
  }, [destinationInputs]);

  function ClearDestinations() {
    inputRefs.current.map((inputRef) => inputRef.ClearInput());
    destinations.map((destination, i) => OnUpdateDestination(i));
  }

  function AddInput() {
    dispatch(AddDestination({ id: destinationInputs.length }));
    dispatch(AddTravelTime({ id: travelTimes.length }));

    let addInput = [...destinationInputs];
    addInput = [
      ...addInput,
      <View className="w-3/4 m-5" key={destinationInputs.length}>
        <Text className="text-right mb-2">
          {destinationInputs.length > 1 ? "or" : "To"} where?
        </Text>
        <GMapTextInput
          ref={(el) => (inputRefs.current[destinationInputs.length] = el)}
          placeholderText={"Enter your destination"}
          OnPressCall={(data, details) =>
            OnUpdateDestination(destinationInputs.length, data, details)
          }
          styles={{ container: { flex: 0 } }}
        />
      </View>,
    ];
    SetDestinationInputs(addInput);
  }
  function RemoveInput() {
    dispatch(RemoveDestination({ id: destinationInputs.length - 1 }));
    dispatch(RemoveTravelTime({ id: travelTimes.length - 1 }));

    let cutInput = [...destinationInputs];
    cutInput.pop();
    SetDestinationInputs(cutInput);
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
  function OnCheck() {
    navigation.replace("Map");
  }

  return (
    <SafeAreaView className="h-full justify-center items-center">
      {/* Title */}
      <View className="w-3/4 pb-5 flex-row items-end justify-between">
        <Text className={"font-bold text-3xl"}>Last Minute</Text>
        <TouchableOpacity onPress={ClearDestinations}>
          <Ionicons
            name="warning"
            size={35}
            color="black"
            style={{
              position: "absolute",
              left: 30,
              top: -10,
            }}
          />
          <MaterialCommunityIcons
            name="clock-time-eleven-outline"
            size={50}
            color="black"
          />
        </TouchableOpacity>
      </View>

      {/* Origin */}
      <View className="w-3/4 m-5">
        <Text className="text-right mb-2">From where?</Text>
        <GMapTextInput
          placeholderText={"Enter your start position"}
          OnPressCall={OnSetOrigin}
          styles={{ container: { flex: 0 } }}
        />
      </View>
      {/* Destination(s) */}
      {destinationInputs}

      <View className="flex-row w-3/4 items-center justify-between">
        <View className="flex-row">
          <TouchableOpacity
            onPress={AddInput}
            disabled={destinationInputs.length === Settings.destinations.max}
          >
            <Ionicons
              name="add-circle"
              size={44}
              color={
                destinationInputs.length === Settings.destinations.max
                  ? "#d1d5db"
                  : "black"
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={RemoveInput}
            disabled={destinationInputs.length === Settings.destinations.min}
          >
            <Ionicons
              name="remove-circle"
              size={44}
              color={
                destinationInputs.length === Settings.destinations.min
                  ? "#d1d5db"
                  : "black"
              }
            />
          </TouchableOpacity>
        </View>
        {/* Check Button */}
        <TouchableOpacity
          className={
            "rounded-full px-10 py-3 " + (!origin ? "bg-gray-300" : "bg-black")
          }
          disabled={!origin}
          onPress={OnCheck}
        >
          <Text className="font-semibold text-xl text-white">Check!</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
