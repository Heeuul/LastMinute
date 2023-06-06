import MapViewDirections from "react-native-maps-directions";
import MapView, { Marker } from "react-native-maps";
import React, { useEffect, useRef } from "react";
import { Fontisto } from "@expo/vector-icons";

import { GOOGLE_MAPS_APIKEY } from "@env";
import { useSelector } from "react-redux";
import { SelectDestination, SelectOrigin } from "../slices/mapSlice";

export default function Map() {
  const origin = useSelector(SelectOrigin);
  const destination = useSelector(SelectDestination);
  const mapRef = useRef(null);

  console.log(
    "Origin:" +
      JSON.stringify(origin, null, 2) +
      "\nDestination:" +
      JSON.stringify(destination, null, 2)
  );

  useEffect(() => {
    if (!origin || !destination) return;

    // Zoom to fit markers
    mapRef.current.fitToSuppliedMarkers(["origin", "destination"], {
      edgePadding: { top: 75, bottom: 75, right: 50, left: 50 },
    });

    // Update delay workaround
    setTimeout(() => {
      mapRef.current.fitToElements(true);
    }, 1);
  }, [origin, destination]);

  return (
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
      {origin && destination && (
        <MapViewDirections
          apikey={GOOGLE_MAPS_APIKEY}
          origin={origin.coordinate}
          destination={destination.coordinate}
          strokeWidth={3}
          strokeColor="charcoal"
          region="MY"
          onReady={(result) =>
            console.log(
              "Travel Duration: " +
                JSON.stringify(result.duration, null, 2) +
                " mins"
            )
          }
        />
      )}

      {origin?.coordinate && (
        <Marker
          title={origin.name}
          description={origin.address}
          coordinate={origin.coordinate}
          identifier="origin"
          pinColor="grey"
        >
          <Fontisto name="map-marker-alt" size={32} color="black" />
        </Marker>
      )}

      {destination?.coordinate && (
        <Marker
          title={destination.name}
          description={destination.address}
          coordinate={destination.coordinate}
          identifier="destination"
        >
          <Fontisto name="flag" size={32} color={"red"} />
        </Marker>
      )}
    </MapView>
  );
}
