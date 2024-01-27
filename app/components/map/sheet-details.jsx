'use client'

import React from 'react';

import { useGeolocated } from "react-geolocated";

import commaNumber from 'comma-number';
import * as turf from "@turf/turf";

const SheetDetails = ({ dst }) => {
  const {
    coords
  } = useGeolocated({
      positionOptions: {
        enableHighAccuracy: true
      },
      watchPosition: true,
      userDecisionTimeout: 5000
  });

  // Handle the case when coords are not available yet
  if (!coords) {
    return <div>Loading...</div>; // You can replace this with a loading indicator or any placeholder
  }

  return (
    <div
        width="100%"
        height="100%"
        style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        }}
    >
      <h1
        style={{
            fontSize: "2rem",
            fontWeight: "bold",
        }}
      >
        {commaNumber(turf.distance(
          [coords?.longitude, coords?.latitude],
          [dst.lng, dst.lat],
          { units: "meters" }
        ).toFixed(2))}{" "}
        meters
      </h1>
      <span
        style={{
          fontSize: "1.2rem",
          textAlign: "center",
        }}
      >
        If you walk at a speed of 1.4 m/s, it will take you{" "}
        {commaNumber((turf.distance(
          [coords?.longitude, coords?.latitude],
          [dst.lng, dst.lat],
          { units: "meters" }
        ) / 1.4).toFixed(2))}{" "}
        seconds to reach your destination!
      </span>
    </div>
  );
};

export default SheetDetails;