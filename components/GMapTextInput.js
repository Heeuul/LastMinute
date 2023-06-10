import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import React, { forwardRef, useImperativeHandle, useRef } from "react";

import { GOOGLE_MAPS_APIKEY } from "@env";
import { useEffect } from "react";

export { GMapTextInput };
const GMapTextInput = forwardRef(
  ({ placeholderText, OnPressCall, styles, initialAddress }, ref) => {
    useImperativeHandle(ref, () => ({
      ClearInput() {
        inputRef.current.clear();
        inputRef.current.setAddressText("");
      },
    }));

    useEffect(() => {
      if (initialAddress) {
        console.log("Received initial address:" + initialAddress);
        inputRef.current.setAddressText(initialAddress);
      }
    }, []);

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
        keepResultsAfterBlur={true}
        enablePoweredByContainer={false}
        // currentLocation={true}
        fetchDetails={true}
        styles={styles}
      />
    );
  }
);
