import { GestureHandlerRootView } from "react-native-gesture-handler";
import React from "react";

import Inputs from "../components/Inputs";

export default function MapScreen() {
  return (
    <GestureHandlerRootView className="flex-1">
      <Inputs className="flex-1" />
      {/* <Map /> */}
    </GestureHandlerRootView>
  );
}
