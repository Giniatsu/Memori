'use client'

import Head from "next/head";
import Image from "next/image";
import Map from "../components/Map";
import React from "react";
import { useGeolocated } from "react-geolocated";

import { useSearchParams } from 'next/navigation'

export default function MapPage() {
  const searchParams = useSearchParams()

  const dstLat = searchParams.get('lat');
  const dstLng = searchParams.get('lng');

  const {
    coords,
    isGeolocationAvailable,
    isGeolocationEnabled
  } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true
    },
    userDecisionTimeout: 5000
  });

  const [srcLat, setSrcLat] = React.useState(0);
  const [srcLng, setSrcLng] = React.useState(0);

  const locationHandler = (coords) => {
    const { latitude, longitude } = coords;
    setSrcLat(latitude);
    setSrcLng(longitude);
  };

  React.useEffect(() => {
    if (!isGeolocationAvailable) {
    } else if (!isGeolocationEnabled) {
    } else if (coords) {
      locationHandler(coords);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords, isGeolocationAvailable, isGeolocationEnabled]);

  if (isGeolocationAvailable && !isGeolocationEnabled) {
    return (
      <main className="w-100 h-100">
        <h1>Geolocation is not enabled, Please allow the location check your setting</h1>
      </main>
    );
  }

  if (!isGeolocationAvailable) {
    return (
      <main className="w-100 h-100">
        <h1>Your browser does not support Geolocation</h1>
      </main>
    );
  }

  return (
    <main className="w-100 h-100">
      <Map
        src={{ lat: srcLat, lng: srcLng }}
        dst={{ lat: parseFloat(dstLat), lng: parseFloat(dstLng) }}
      />
    </main>
  );
}
