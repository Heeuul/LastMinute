import React, { useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import GMapTextInput from "../components/GMapTextInput";
import { useDispatch, useSelector } from "react-redux";
import {
  SetOrigin,
  SelectOrigin,
  AddDestination,
  UpdateDestination,
  RemoveDestination,
  SelectDestinations,
} from "../slices/mapSlice";

export default function HomeScreen({ navigation }) {
  const origin = useSelector(SelectOrigin);
  const destinations = useSelector(SelectDestinations);
  const dispatch = useDispatch();

  const [destinationInput, SetDestinationInput] = useState([]);

  useLayoutEffect(() => {
    if (destinations.length === 0) AddInput();
  }, []);

  useEffect(() => {
    UpdateInputs();
  }, [destinations]);

  function AddInput() {
    dispatch(AddDestination({ id: destinations.length }));
  }
  function RemoveInput() {
    dispatch(RemoveDestination({ id: destinations.length - 1 }));
  }
  function UpdateInputs() {
    if (destinations.length === destinationInput.length) return;

    let input = [...destinationInput];
    if (destinations.length > destinationInput.length)
      input = [
        ...input,
        <View className="w-3/4 m-5" key={destinationInput.length}>
          <Text className="text-right mb-2">
            {destinationInput.length > 1 ? "or" : "To"} where?
          </Text>
          <GMapTextInput
            placeholderText={"Enter your destination"}
            OnPressCall={(data, details) =>
              OnSetDestination(destinationInput.length, data, details)
            }
            styles={{ container: { flex: 0 } }}
          />
        </View>,
      ];
    else if (destinations.length < destinationInput.length) input.pop();

    SetDestinationInput(input);
  }
  function OnSetOrigin(data, details = null) {
    dispatch(
      SetOrigin({
        name: data.structured_formatting.main_text,
        address: data.structured_formatting.secondary_text,
        coordinate: {
          latitude: details.geometry.location.lat,
          longitude: details.geometry.location.lng,
        },
      })
    );
  }
  function OnSetDestination(id, data, details = null) {
    dispatch(
      UpdateDestination({
        id: id,
        name: data.structured_formatting.main_text,
        address: data.structured_formatting.secondary_text,
        coordinate: {
          latitude: details.geometry.location.lat,
          longitude: details.geometry.location.lng,
        },
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
        <TouchableOpacity>
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
      {destinationInput}

      <View className="flex-row w-3/4 items-center justify-between">
        <View className="flex-row">
          <TouchableOpacity
            onPress={AddInput}
            disabled={destinations.length === 4}
          >
            <Ionicons
              name="add-circle"
              size={44}
              color={destinations.length === 4 ? "#d1d5db" : "black"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={RemoveInput}
            disabled={destinations.length === 1}
          >
            <Ionicons
              name="remove-circle"
              size={44}
              color={destinations.length === 1 ? "#d1d5db" : "black"}
            />
          </TouchableOpacity>
        </View>
        {/* Check Button */}
        <TouchableOpacity
          className={
            "rounded-full px-10 py-3 " +
            (!origin || !Array.isArray(destinations) || !destinations.length
              ? "bg-gray-300"
              : "bg-black")
          }
          disabled={
            !origin || !Array.isArray(destinations) || !destinations.length
          }
          onPress={OnCheck}
        >
          <Text className="font-semibold text-xl text-white">Check!</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
