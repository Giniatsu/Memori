import React, {useState} from 'react';
import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef
} from '@vis.gl/react-google-maps';

export const GraveMarker = ({ coords, grave }) => {
  const [infowindowOpen, setInfowindowOpen] = useState(true);
  const [markerRef, marker] = useAdvancedMarkerRef();

  if (grave === null) return <></> 

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        onClick={() => setInfowindowOpen(true)}
        position={coords}
        title={`${grave.firstname} ${grave.lastname}`}
      />
      {infowindowOpen && (
        <InfoWindow
          anchor={marker}
          maxWidth={200}
          onCloseClick={() => setInfowindowOpen(false)}>
          {grave.firstname}{' '}{grave.lastname}
          <code style={{whiteSpace: 'nowrap'}}>&lt;GraveMarker /&gt;</code>{' '}
          with an Infowindow.
        </InfoWindow>
      )}
    </>
  );
};
