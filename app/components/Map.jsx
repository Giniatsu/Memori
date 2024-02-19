// Import necessary dependencies and components

import React, { useEffect, useMemo, useState } from 'react';
import { Map as GoogleMap } from '@vis.gl/react-google-maps';
import { useGeolocated } from 'react-geolocated';

import { GraveMarker } from './map/grave-marker';
import { UserMarker } from './map/user-marker';
import Distance from './map/distance';
import DirectionPolyline from './map/direction-polyline';
import { createClient } from '@supabase/supabase-js';
import RateButton from './map/rate-button';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

const Map = ({ graveId }) => {
  const [graveTarget, setGraveTarget] = useState(null)

  const getGrave = async () => {
    const { data } = await supabase.rpc("get_graves")
      .eq("grave_id", graveId)
      .single();
    setGraveTarget(data) 
  }

  useEffect(() => {
    getGrave()
  }, [])

  const dst = useMemo(() => {
    return {
      lat: parseFloat(graveTarget?.latitude ?? 0),
      lng: parseFloat(graveTarget?.longitude ?? 0),
    }
  }, [graveTarget])

  const {
    coords,
    isGeolocationAvailable,
    isGeolocationEnabled,
    positionError
  } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
    },
    watchLocationPermissionChange: true,
  });

  if (!isGeolocationAvailable) {
    return <div>Your browser does not support Geolocation</div>;
  }

  if (!isGeolocationEnabled) {
    return <div>Geolocation is not enabled</div>;
  }

  if (positionError) {
    return <div>{positionError.message}</div>;
  }

  if (!coords) {
    return <div>Getting the location data&hellip;</div>;
  }

  return (
    <>
      <GoogleMap
        mapId={'bf51a910020fa25a'}
        mapTypeId='satellite'
        zoom={3}
        center={{
          lat: dst?.lat ?? 0,
          lng: dst?.lng ?? 0,
        }}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      >
        <UserMarker dst={dst} />
        <GraveMarker grave={graveTarget} coords={dst} />
        <DirectionPolyline dst={dst} />
      </GoogleMap>

      <div class="fixed bottom-2 right-2 ml-2 max-w-xs flex flex-col items-end space-y-2">
        <RateButton dst={dst} graveId={graveId} />
        <Distance dst={dst} />
      </div>
    </>
  );
};

export default Map;
