"use client";

import {
  TextInput,
} from "flowbite-react";
import {
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { useEffect, useState, useRef } from "react";

export default function PlacesField({
  onPlaceSelect, ...props
}) {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const placesLib = useMapsLibrary('places');
  const placesRef = useRef(null);

  useEffect(() => {
    if (!placesLib || !placesRef.current) return;

    const options = {
      types: ['(cities)'],
      fields: ['geometry', 'name', 'formatted_address']
    };

    setPlaceAutocomplete(new placesLib.Autocomplete(placesRef.current, options));
  }, [placesLib, placesRef]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener('place_changed', () => {
      onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <TextInput
      ref={placesRef}
      {...props}
    />
  );
}
