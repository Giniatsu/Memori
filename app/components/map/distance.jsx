'use client'

import React from 'react';

import { useGeolocated } from "react-geolocated";

import commaNumber from 'comma-number';
import * as turf from "@turf/turf";
import { THRESHOLD_DISTANCE_METERS } from './variables';

const DistanceSheet = ({ dst }) => {
  const {
    coords
  } = useGeolocated({
      positionOptions: {
        enableHighAccuracy: true
      },
      watchPosition: true,
      userDecisionTimeout: 5000
  });

  const distanceInMeters = React.useMemo(() => {
    return turf.distance(
      [coords?.longitude, coords?.latitude],
      [dst.lng, dst.lat],
      { units: "meters" }
    ).toFixed(2)
  }, [coords, dst])

  return (
    <div class="bg-gray-900 rounded-lg p-4 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" class="bi bi-compass" viewBox="0 0 16 16">
        <path d="M8 16.016a7.5 7.5 0 0 0 1.962-14.74A1 1 0 0 0 9 0H7a1 1 0 0 0-.962 1.276A7.5 7.5 0 0 0 8 16.016m6.5-7.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0"/>
        <path d="m6.94 7.44 4.95-2.83-2.83 4.95-4.949 2.83 2.828-4.95z"/>
      </svg>
      { distanceInMeters > THRESHOLD_DISTANCE_METERS ? ( 
        <p class="text-white ml-2">
          Approx. {commaNumber(distanceInMeters)}{" "} meters away
        </p>
      ) : (
        <p class="text-white ml-2">
          You are approximately at the Grave location.
        </p>
      ) }
    </div>
  );
};

export default DistanceSheet;
