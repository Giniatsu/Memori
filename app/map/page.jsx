'use client'

import Head from "next/head";
import Image from "next/image";
import Map2 from "../components/Map2";
import React from "react";

import { useSearchParams } from 'next/navigation'

export default function MapPage() {
  const searchParams = useSearchParams()

  const dstLat = searchParams.get('lat');
  const dstLng = searchParams.get('lng');

  return (
    <main className="w-screen h-screen">
      <Map2
        destination={{ lat: parseFloat(dstLat), lng: parseFloat(dstLng) }}
      />
    </main>
  );
}
