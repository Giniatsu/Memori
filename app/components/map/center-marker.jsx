'use client'

import React, {useCallback, useEffect, useState} from 'react';
import { useMapsLibrary, Marker, useMap } from "@vis.gl/react-google-maps";

export const CenterMarker = ({ setCenter }) => {
  const geometryLib = useMapsLibrary('geometry')
  const coreLib = useMapsLibrary('core')
  const map = useMap()

  const [currentCenter, setCurrentCenter] = useState({ lat: 0, lng: 0 })

  const handleCenterChange = useCallback(() => {
    setCurrentCenter({ lat: map.getCenter().lat(), lng: map.getCenter().lng() })
  })

  useEffect(() => {
    handleCenterChange()
    map.addListener("center_changed", handleCenterChange)
  }, [map, setCenter])

  useEffect(() => {
    if (setCenter && typeof setCenter === 'function') setCenter(currentCenter)
  }, [currentCenter])

  // Handle the case when coords are not available yet
  if (!geometryLib || !coreLib) {
    return <div>Loading...</div>; // You can replace this with a loading indicator or any placeholder
  }

  return (
    <Marker
      position={currentCenter}
    />
  );
};
