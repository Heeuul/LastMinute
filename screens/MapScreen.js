import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import React from "react";

import Inputs from "../components/Inputs";
import Map from "../components/Map";

//? Click on marker to show in middle of screen
//TODO: Compare route button (recall fittosuppliedmarkers)

export default function MapScreen() {
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={
        Platform.OS === "android"
          ? Dimensions.get("window").height - StatusBar.currentHeight
          : "padding"
      }
    >
      <GestureHandlerRootView className="flex-1">
        <Map />
        <Inputs />
      </GestureHandlerRootView>
    </KeyboardAvoidingView>
  );
}
