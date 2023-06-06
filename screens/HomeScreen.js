import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";

import GMapTextInput from "../components/GMapTextInput";
import { useDispatch, useSelector } from "react-redux";
import {
  SelectDestination,
  SelectOrigin,
  SetDestination,
  SetOrigin,
} from "../slices/mapSlice";

export default function HomeScreen({ navigation }) {
  const origin = useSelector(SelectOrigin);
  const destination = useSelector(SelectDestination);
  const dispatch = useDispatch();

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
  function OnSetDestination(data, details = null) {
    dispatch(
      SetDestination({
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
      <View className="w-3/4 m-5">
        <Text className="text-right mb-2">From where?</Text>
        <GMapTextInput
          placeholderText={"Enter your start position"}
          OnPressCall={OnSetOrigin}
          styles={{ container: { flex: 0 } }}
        />
      </View>
      <View className="w-3/4 m-5">
        <Text className="text-right mb-2">To where?</Text>
        <GMapTextInput
          placeholderText={"Enter your destination"}
          OnPressCall={OnSetDestination}
          styles={{ container: { flex: 0 } }}
        />
      </View>
      <TouchableOpacity
        className={
          "rounded-full px-10 py-3 " +
          (!origin || !destination ? "bg-gray-400" : "bg-black")
        }
        disabled={!origin || !destination}
        onPress={OnCheck}
      >
        <Text
          className={
            "font-semibold text-xl " +
            (!origin || !destination ? "text-gray-200" : "text-white")
          }
        >
          Check!
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
