import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import React, { forwardRef, useImperativeHandle, useRef } from "react";

import { GOOGLE_MAPS_APIKEY } from "@env";

export { GMapTextInput };
const GMapTextInput = forwardRef(
  ({ placeholderText, OnPressCall, styles }, ref) => {
    useImperativeHandle(ref, () => ({
      ClearInput() {
        console.log("a");
        inputRef.current.clear();
        inputRef.current.setAddressText("");
      },
    }));

    const inputRef = useRef();
    return (
      <GooglePlacesAutocomplete
        ref={inputRef}
        placeholder={placeholderText}
        nearbyPlacesAPI="GooglePlacesSearch"
        query={{ key: GOOGLE_MAPS_APIKEY, language: "en" }}
        components="country:my"
        debounce={400}
        minLength={2}
        onPress={OnPressCall}
        returnKeyType={"search"}
        enablePoweredByContainer={false}
        // currentLocation={true}
        fetchDetails={true}
        styles={styles}
      />
    );
  }
);
