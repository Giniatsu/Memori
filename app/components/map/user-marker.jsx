'use client'

import React, {useCallback, useState, useEffect} from 'react';
import { useMapsLibrary, Marker, useMap } from "@vis.gl/react-google-maps";
import { useGeolocated } from "react-geolocated";

export const UserMarker = ({ dst }) => {
  const {
    coords,
  } = useGeolocated({
      positionOptions: {
        enableHighAccuracy: true
      },
      watchPosition: true,
      userDecisionTimeout: 5000
  });

  const [rotation, setRotation] = useState(0);

  const geometryLib = useMapsLibrary('geometry')
  const coreLib = useMapsLibrary('core')
  const map = useMap()

  /*
  // Function to calculate the initial bearing between two points on Earth
  const calculateBearing = useCallback(() => {
    if (geometryLib && coreLib && coords && dst && 'lng' in dst && 'lat' in dst) {
      const fromLatLng = new coreLib.LatLng(coords.latitude, coords.longitude)
      const toLatLng = new coreLib.LatLng(dst.lat, dst.lng)
      const heading = geometryLib.spherical.computeHeading(fromLatLng, toLatLng)

      return heading;
    }
    return 0;
  }, [coords, dst, geometryLib, coreLib]);

  useEffect(() => {
    const heading = calculateBearing();
    setRotation(heading);
  }, [calculateBearing]);
  */

  useEffect(() => {
    if (coords) {
      setRotation(coords.heading)
    }
  }, [coords])

  useEffect(() => {
    if (coreLib && map && coords) {
      const bounds = new coreLib.LatLngBounds()

      bounds.extend({ lat: coords?.latitude, lng: coords?.longitude })
      bounds.extend(dst)

      map.fitBounds(bounds)
      map.setZoom(map.getZoom() - 1)
    }
  }, [coreLib, map, coords, dst])

  // Handle the case when coords are not available yet
  if (!coords || !geometryLib || !coreLib) {
    return <div>Loading...</div>; // You can replace this with a loading indicator or any placeholder
  }

  return (
    <Marker
      icon={{
        path: coreLib.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 4,
        rotation: rotation,
        strokeColor: 'red',
        strokeWeight: 3,
      }}
      position={{lat: coords.latitude, lng: coords.longitude}}
    />
  );
};