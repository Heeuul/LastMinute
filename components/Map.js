import MapViewDirections from "react-native-maps-directions";
import MapView, { Marker } from "react-native-maps";
import { Fontisto } from "@expo/vector-icons";
import React, { useRef, useEffect } from "react";
import { View, Dimensions } from "react-native";

import { GOOGLE_MAPS_APIKEY } from "@env";
import { useSelector } from "react-redux";
import { SelectDestinations, SelectOrigin } from "../slices/mapSlice";
import { Settings } from "../settings";

export default function Map() {
  const origin = useSelector(SelectOrigin);
  const destinations = useSelector(SelectDestinations);
  const mapRef = useRef(null);

  useEffect(() => {}, [destinations]);

  return (
    <View className="flex-1">
      <MapView
        ref={mapRef}
        className="flex-1"
        provider="google"
        mapType="mutedStandard"
        fitToElements={true}
        initialRegion={{
          latitude: origin.coordinate.latitude,
          longitude: origin.coordinate.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        {origin &&
          Array.isArray(destinations) &&
          destinations.length &&
          destinations.map(
            (dest, i) =>
              dest.coordinate && (
                <MapViewDirections
                  key={i}
                  apikey={GOOGLE_MAPS_APIKEY}
                  origin={origin.coordinate}
                  destination={dest.coordinate}
                  strokeWidth={3}
                  strokeColor={Settings.colors[i]}
                  region="MY"
                  onReady={(result) => {
                    console.log(
                      "Travel Duration to " +
                        dest.name +
                        ": " +
                        JSON.stringify(result.duration, null, 2) +
                        " mins"
                    );

                    // Zoom to show all markers
                    mapRef.current.fitToSuppliedMarkers(
                      [
                        "origin",
                        "destination 0",
                        "destination 1",
                        "destination 2",
                        "destination 3",
                      ],
                      {
                        edgePadding: {
                          top: 50,
                          bottom: 150,
                          right: 25,
                          left: 25,
                        },
                      }
                    );
                  }}
                />
              )
          )}

        {origin?.coordinate && (
          <Marker
            title={origin.name}
            description={origin.address}
            coordinate={origin.coordinate}
            identifier="origin"
          >
            <Fontisto name="map-marker-alt" size={32} color="black" />
          </Marker>
        )}

        {Array.isArray(destinations) &&
          destinations.length &&
          destinations.map(
            (dest, i) =>
              dest.coordinate && (
                <Marker
                  key={i}
                  title={dest.name}
                  description={dest.address}
                  coordinate={dest.coordinate}
                  identifier={"destination " + i}
                >
                  <View className="items-center justify-center">
                    <Fontisto name="map-marker" size={35} color={"black"} />
                    <Fontisto
                      name="map-marker-alt"
                      size={25}
                      color={Settings.colors[i]}
                      style={{ position: "absolute" }}
                    />
                  </View>
                </Marker>
              )
          )}
      </MapView>
      <View style={{ height: Dimensions.get("window").height * 0.1 }} />
    </View>
  );
}
