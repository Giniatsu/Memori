import React, {useEffect, useState, useMemo} from 'react';
import {AdvancedMarker, Marker, useMap} from '@vis.gl/react-google-maps';

import { useGeolocated } from "react-geolocated";
import { UserArrow } from './user-arrow';

export const UserMarker = ({ asd }) => {

  const [dst, setTest] = useState({
    lat: 0,
    lng: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const t = performance.now();
      const lat = Math.sin(t / 2000) * 5;
      const lng = Math.cos(t / 3000) * 5;

      setTest({lat, lng});
    }, 200);

    return () => clearInterval(interval);
  });

  const {
    coords
  } = useGeolocated({
      positionOptions: {
          enableHighAccuracy: true
      },
      watchPosition: true,
      userDecisionTimeout: 5000
  });

  const src = useMemo(() => {
    return { lat: coords?.latitude ?? 0, lng: coords?.longitude ?? 0 }
  }, [coords])

  return (
    <>
    <Marker position={dst}></Marker>
    <AdvancedMarker
      position={src}
    >
      <UserArrow src={src} dst={dst} />
    </AdvancedMarker>
    </>
    
  );
};