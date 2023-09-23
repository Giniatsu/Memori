'use client'

import Head from "next/head";
import Image from "next/image";
import Map from "../components/Map";

export default function MapPage() {
  return (
    <main className="w-100 h-100">
      <Map></Map>
    </main>
  );
}
