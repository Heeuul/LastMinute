import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import React from "react";

import { GOOGLE_MAPS_APIKEY } from "@env";

export default function GMapTextInput({
  placeholderText,
  OnPressCall,
  styles,
}) {
  return (
    <GooglePlacesAutocomplete
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
