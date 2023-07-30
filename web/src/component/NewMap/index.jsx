import React, { useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useEffect } from "react";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};
const MapWithMarker = (props = { onClick: Function, lng: "", lat: "" }) => {
  const initialMarker = {
    lat: null,
    lng: null,
  };

  const [marker, setMarker] = useState(initialMarker);
  const [center, setCenter] = useState({
    lat: 37.7749,
    lng: -122.4194,
  });

  useEffect(() => {
    if (marker && marker.lat) {
      props.onClick(marker);
    }
  }, [marker]);
 
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        var data = { lat: Number(props.lat) || lat, lng: Number(props.lng) || lng }
        setCenter(data);
        if(props.lat){
          setMarker(data);
        }
      });
    }
  }, []);

  const { isLoaded, loadError } = useLoadScript({
    language: 'en',
    googleMapsApiKey: "AIzaSyA-Tm0Wf5xc4QvSEcoy43Hc1l_JlESU3fk",
  });

  const handleMapClick = event => {
    setMarker({
      lat: event.latLng.lat() || props.lat,
      lng: event.latLng.lng() || props.lng,
    });
  };

  const handleMarkerClick = () => {
    setMarker(initialMarker);
  };

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={8}
      options={{ language: 'en' }}
      center={center}
      onClick={handleMapClick}
    >
      {marker.lat && marker.lng && (
        <Marker
          position={{ lat: marker.lat, lng: marker.lng }}
          onClick={handleMarkerClick}
        />
      )}
    </GoogleMap>
  );
};

export default MapWithMarker;
