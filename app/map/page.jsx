'use client'

import Head from "next/head";
import Image from "next/image";
import Map from "../components/Map";
import React from "react";

import { useSearchParams } from 'next/navigation'

export default function MapPage() {
  const searchParams = useSearchParams()

  const dstLat = searchParams.get('lat');
  const dstLng = searchParams.get('lng');

  return (
    <main className="w-100 h-100">
      <Map
        dst={{ lat: parseFloat(dstLat), lng: parseFloat(dstLng) }}
      />
    </main>
  );
}
