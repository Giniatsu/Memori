'use client'

import React, { useState, useEffect, useCallback } from 'react';

import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map,
  Marker,
  Pin,
  useApiIsLoaded
} from '@vis.gl/react-google-maps';

import { useGeolocated } from "react-geolocated";

import {MovingMarker} from './map/moving-marker';
import {MarkerWithInfowindow} from './map/marker-with-infowindow';
import { UserMarker } from './map/user-marker';

const API_KEY =
  globalThis.NEXT_PUBLIC_GOOGLE_MAP_API_KEY ?? (process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY);

const Map2 = ({ dst }) => {
  console.log(dst)
  const {
    coords,
    isGeolocationAvailable,
    isGeolocationEnabled
  } = useGeolocated({
      positionOptions: {
          enableHighAccuracy: true
      },
      watchPosition: true,
      userDecisionTimeout: 5000
  });

  useEffect(() => {
    // Check geolocation status and render elements conditionally
    if (isGeolocationAvailable && !isGeolocationEnabled) {
      const geolocationNotEnabledElement = document.getElementById('geolocationNotEnabled');
      if (geolocationNotEnabledElement) {
        geolocationNotEnabledElement.innerHTML = "<h1>Geolocation is not enabled, Please allow the location check your setting</h1>";
      }
    }

    if (!isGeolocationAvailable) {
      const geolocationNotSupportedElement = document.getElementById('geolocationNotSupported');
      if (geolocationNotSupportedElement) {
        geolocationNotSupportedElement.innerHTML = "<h1>Your browser does not support Geolocation</h1>";
      }
    }
  }, [isGeolocationAvailable, isGeolocationEnabled]);

  return (
    <APIProvider apiKey={API_KEY} libraries={['marker']}>
      <div id="geolocationNotEnabled"></div>
      <div id="geolocationNotSupported"></div>
      <Map
        mapId={'bf51a910020fa25a'}
        zoom={3}
        center={{lat: 12, lng: 0}}
        gestureHandling={'greedy'}
        disableDefaultUI={true}>
        {/* simple marker */}
        <Marker
          position={{lat: 10, lng: 10}}
          clickable={true}
          onClick={() => alert('marker was clicked!')}
          title={'clickable google.maps.Marker'}
        />

        <UserMarker dst={dst} />

        {/* advanced marker with customized pin */}
        <AdvancedMarker
          position={{lat: 20, lng: 10}}
          title={'AdvancedMarker with customized pin.'}>
          <Pin
            background={'#22ccff'}
            borderColor={'#1e89a1'}
            glyphColor={'#0f677a'}></Pin>
        </AdvancedMarker>

        {/* advanced marker with html pin glyph */}
        <AdvancedMarker
          position={{lat: 15, lng: 20}}
          title={'AdvancedMarker with customized pin.'}>
          <Pin background={'#22ccff'} borderColor={'#1e89a1'} scale={1.4}>
            {/* children are rendered as 'glyph' of pin */}
            👀
          </Pin>
        </AdvancedMarker>

        {/* advanced marker with html-content */}
        <AdvancedMarker
          position={{lat: 30, lng: 10}}
          title={'AdvancedMarker with custom html content.'}>
          <div
            style={{
              width: 16,
              height: 16,
              position: 'absolute',
              top: 0,
              left: 0,
              background: '#1dbe80',
              border: '2px solid #0e6443',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)'
            }}></div>
        </AdvancedMarker>

        {/* simple positioned infowindow */}
        <InfoWindow position={{lat: 40, lng: 0}} maxWidth={200}>
          <p>
            This is the content for another infowindow with <em>HTML</em>
            -elements.
          </p>
        </InfoWindow>

        {/* simple stateful infowindow */}
        <MarkerWithInfowindow />
      </Map>
    </APIProvider>
  );
};

export default Map2;