'use client'

import Map from "../components/Map";
import React from "react";

import {
  APIProvider,
} from '@vis.gl/react-google-maps';

import { useSearchParams } from 'next/navigation'

const API_KEY =
  globalThis.NEXT_PUBLIC_GOOGLE_MAP_API_KEY ?? (process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY);

export default function MapPage() {
  const searchParams = useSearchParams()

  const dstLat = searchParams.get('lat');
  const dstLng = searchParams.get('lng');

  return (
    <main className="w-screen h-screen">
      <APIProvider apiKey={API_KEY} libraries={['marker']}>
        <Map
          dst={{ lat: parseFloat(dstLat), lng: parseFloat(dstLng) }}
        />
      </APIProvider>
    </main>
  );
}
