'use client'

import React, { useState } from 'react';

import {
  Map as GoogleMap,
} from '@vis.gl/react-google-maps';

import Sheet from 'react-modal-sheet';
import { Button } from 'flowbite-react';

import { GraveMarker } from './map/grave-marker';
import { UserMarker } from './map/user-marker';
import SheetDetails from './map/sheet-details';
import DirectionPolyline from './map/direction-polyline';

const Map = ({ dst }) => {
  const [isOpen, setOpen] = useState(true);

  return (
    <>
      <GoogleMap
        mapId={'bf51a910020fa25a'}
        zoom={3}
        center={{
          lat: dst?.lat ?? 0,
          lng: dst?.lng ?? 0
        }}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      >
        <UserMarker dst={dst} />
        <GraveMarker coords={dst} />
        <DirectionPolyline dst={dst} />
      </GoogleMap>

      <Button
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: "9999",
          width: "100%",
          maxWidth: "40rem",
        }}
        onClick={() => setOpen(true)}
      >
        View Distance
      </Button>

      <Sheet
        isOpen={isOpen}
        snapPoints={[0.4, 0.2]}
        initialSnap={1}
        onClose={() => setOpen(false)}
      >
        <Sheet.Container>
            <Sheet.Header />
            <Sheet.Content
              style={{
                  paddingX: "2rem",
              }}
            >
              <SheetDetails dst={dst} />
            </Sheet.Content>
        </Sheet.Container>
      </Sheet>
    </>
  );
};

export default Map;