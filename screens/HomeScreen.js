import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useLayoutEffect, useState } from "react";

import GMapTextInput from "../components/GMapTextInput";
import { useDispatch, useSelector } from "react-redux";
import {
  AddDestination,
  RemoveDestination,
  SelectDestinations,
  SelectOrigin,
  SetOrigin,
} from "../slices/mapSlice";

export default function HomeScreen({ navigation }) {
  const origin = useSelector(SelectOrigin);
  const destinations = useSelector(SelectDestinations);
  const dispatch = useDispatch();

  const [destinationCount, SetDestinationCount] = useState(1);
  const [destinationInput, SetDestinationInput] = useState([]);

  useEffect(() => {
    const input = [];

    for (let i = 0; i < destinationCount; i++) {
      input.push(
        <View className="w-3/4 m-5" key={i}>
          <Text className="text-right mb-2">To where?</Text>
          <GMapTextInput
            placeholderText={"Enter your destination"}
            OnPressCall={(data, details) => OnSetDestination(i, data, details)}
            styles={{ container: { flex: 0 } }}
          />
        </View>
      );
    }

    SetDestinationInput(input);
  }, [destinationCount]);
  function AddInput() {
    SetDestinationCount(destinationCount + 1);
  }
  function RemoveInput() {
    SetDestinationCount(destinationCount - 1);
    dispatch(RemoveDestination({ id: destinationCount }));
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
    dispatch(RemoveDestination({ id: id }));
    dispatch(
      AddDestination({
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
      <Text className={"w-3/4 font-bold text-3xl pb-5"}>Last Minute</Text>

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
            disabled={destinationCount === 4}
          >
            <Ionicons
              name="add-circle"
              size={44}
              color={destinationCount === 4 ? "#d1d5db" : "black"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={RemoveInput}
            disabled={destinationCount === 1}
          >
            <Ionicons
              name="remove-circle"
              size={44}
              color={destinationCount === 1 ? "#d1d5db" : "black"}
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
