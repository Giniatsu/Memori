import React from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

import { useGeolocated } from "react-geolocated";

export default function DirectionPolyline({ dst }) {
  const {
    coords
  } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true
    },
    watchPosition: true,
    userDecisionTimeout: 5000
  });

  const map = useMap();
  const maps = useMapsLibrary("maps");

  const pathCoordinates = React.useMemo(() => {
    return [
      { lat: coords?.latitude ?? 0, lng: coords?.longitude ?? 0 },
      dst,
    ]
  }, [coords, dst])

  React.useEffect(() => {
    if (!maps || !map) {
      return
    } 

    const path = new maps.Polyline({
      path: pathCoordinates,
      geodesic: true,
      strokeColor: "black",
      strokeOpacity: 0.5,
      strokeWeight: 2,
      icons: [
        {
          icon: {
            path: "M 0,-1 0,1",
            strokeOpacity: 1,
            scale: 4,
          },
          offset: "0",
          repeat: "20px",
        },
      ],
    });
  
    path.setMap(map);

    return () => {
      if (path) {
        path.setMap(null)
      }
    }
  }, [map, maps, pathCoordinates])

  return (
    <></>
  );
}